"""
VIGIL — FastAPI Backend
Serves:
  GET  /stream          — SSE stream of live telemetry + AI decisions
  POST /control/start   — begin or restart the demo
  POST /control/reset   — reset all counters and state
  GET  /status          — current demo state
"""

import asyncio
import json
import logging
import random
import time
from datetime import datetime, timezone
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from agents import call_profiler, call_action_agent
from scenarios import SCENARIOS

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(title="VIGIL Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Global in-memory state — only tracks running flag and cancel signal
# ---------------------------------------------------------------------------

state = {
    "running": False,
    "cancel_requested": False,   # set True to kill any active stream
}

# Scenarios that would trigger a naive threshold system (HR > 120)
THRESHOLD_SCENARIO_IDS = {2, 5, 6}


def request_cancel():
    """Ask any in-flight stream to stop."""
    state["cancel_requested"] = True
    state["running"] = False


# ---------------------------------------------------------------------------
# Telemetry packet builder
# ---------------------------------------------------------------------------

def build_packet(scenario: dict, tick: int) -> dict:
    """Add realistic jitter to scenario base data to make stream feel live."""
    base = scenario["data"].copy()
    sid = scenario["scenario_id"]

    # Add small natural variance to biometrics
    base["heart_rate"] = max(40, base["heart_rate"] + random.randint(-2, 2))
    base["hrv"] = round(max(10.0, base["hrv"] + random.uniform(-0.8, 0.8)), 1)

    acc = base["accelerometer"].copy()
    # Add subtle noise to accelerometer
    acc["x"] = round(acc["x"] + random.uniform(-0.05, 0.05), 3)
    acc["y"] = round(acc["y"] + random.uniform(-0.05, 0.05), 3)
    acc["z"] = round(acc["z"] + random.uniform(-0.02, 0.02), 3)
    base["accelerometer"] = acc

    # Attach metadata
    base["timestamp"] = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    base["scenario_id"] = sid
    base["context_note"] = scenario.get("context_note", "")

    return base


# ---------------------------------------------------------------------------
# SSE event generator
# ---------------------------------------------------------------------------

async def event_generator() -> AsyncGenerator[str, None]:
    """Core coordinator loop — all counters are LOCAL to this connection instance.
    Each new /stream connection gets a clean slate."""

    logger.info("SSE stream started")
    state["running"] = True
    state["cancel_requested"] = False

    # ── Local per-connection state ────────────────────────────────────────────
    local_decisions: list = []
    total_possible_alerts = 0
    vigil_alerts_fired = 0
    tick = 0
    # ─────────────────────────────────────────────────────────────────────────

    for scenario_idx, scenario in enumerate(SCENARIOS):
        if state["cancel_requested"]:
            logger.info("Cancel requested — stopping stream")
            break

        sid = scenario["scenario_id"]
        duration = random.randint(*scenario.get("duration", (8, 12)))
        logger.info(f"▶ Scenario {sid}: {scenario['name']} ({duration}s)")

        # Threshold alert fires ONCE per threshold scenario (not per tick)
        if sid in THRESHOLD_SCENARIO_IDS:
            total_possible_alerts += 1

        # Vigil alert fires AT MOST ONCE per scenario
        scenario_alert_fired = False

        for t in range(duration):
            if state["cancel_requested"]:
                break

            packet = build_packet(scenario, tick)
            tick += 1

            # ---- Call Profiler ----
            profiler_state = call_profiler(packet, local_decisions[-10:])
            logger.info(f"  Profiler: {profiler_state}")

            # ---- Call Action Agent ----
            action_result = call_action_agent(packet, profiler_state, local_decisions[-10:])
            decision = action_result.get("decision", "VETO")
            reason = action_result.get("reason", "No reason provided.")
            alert_message = action_result.get("alert_message", None)

            logger.info(f"  Action: {decision} — {reason}")

            # Vigil counter: fire once per scenario max, and only on first tick of alert
            if decision == "ALERT" and not scenario_alert_fired:
                vigil_alerts_fired += 1
                scenario_alert_fired = True
            elif decision == "ALERT" and scenario_alert_fired:
                # Subsequent ticks in same alert scenario: keep ALERT decision but
                # don't send the overlay again (null out alert_message after first)
                alert_message = None

            # Build log entry
            entry = {
                "scenario_id": sid,
                "decision": decision,
                "reason": reason,
                "alert_message": alert_message,
                "timestamp": datetime.now().strftime("%H:%M:%S"),
            }
            local_decisions.append(entry)
            if len(local_decisions) > 50:
                local_decisions = local_decisions[-50:]

            # Build SSE payload
            payload = {
                "telemetry": packet,
                "profiler_state": profiler_state,
                "decision": decision,
                "reason": reason,
                "alert_message": alert_message,
                "timestamp": entry["timestamp"],
                "scenario_id": sid,
                "scenario_name": scenario["name"],
                "scenario_index": scenario_idx,      # 0-based
                "total_scenarios": len(SCENARIOS),
                "total_possible_alerts": total_possible_alerts,
                "vigil_alerts_fired": vigil_alerts_fired,
            }

            yield f"data: {json.dumps(payload)}\n\n"

            # Wait 1 second between packets (non-blocking)
            await asyncio.sleep(1)

    # Stream finished
    state["running"] = False
    state["cancel_requested"] = False
    logger.info("SSE stream completed all scenarios")
    yield f"data: {json.dumps({'event': 'done', 'message': 'All scenarios completed.'})}\n\n"


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/stream")
async def stream():
    """SSE endpoint — frontend connects here for live data."""
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )


@app.post("/control/start")
async def start_demo():
    """Cancel any running stream so the frontend can open a fresh one."""
    request_cancel()
    await asyncio.sleep(0.1)   # brief yield so the old generator sees the cancel
    state["cancel_requested"] = False
    state["running"] = False
    return {"status": "ready"}


@app.post("/control/reset")
async def reset_demo():
    """Cancel the active stream and return to standby."""
    request_cancel()
    return {"status": "reset"}


@app.get("/status")
async def get_status():
    return {
        "running": state["running"],
    }


@app.get("/health")
async def health():
    return {"status": "ok", "service": "VIGIL Backend"}
