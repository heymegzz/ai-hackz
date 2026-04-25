# VIGIL — Multi-Agent Wearable Intelligence

> *"The most intelligent decision an AI can make is sometimes to say absolutely nothing."*

VIGIL is a multi-agent AI system that acts as the intelligent brain for a wearable device. It ingests a real-time biometric data stream and uses two AI agents to decide — with explicit reasoning — when to alert the user and when to stay silent.

**The core intelligence of the product is restraint. It fires one alert in the entire demo.**

---

## Running Locally

### 1. Start the Backend

```bash
cd vigil/backend
python3 -m uvicorn main:app --reload --port 8000
```

### 2. Start the Frontend

```bash
cd vigil/frontend
npm install   # first time only
npm run dev
```

Open **http://localhost:5173** in a browser (minimum 1280px wide, landscape).

Hover over the bottom strip to reveal demo controls → click **START DEMO**.

---

## Architecture

```
Stream (1 packet/sec)
     │
     ▼
Profiler Agent (Groq LLM)
     │  "what is happening right now"
     ▼
Action Agent (Groq LLM)
     │  VETO or ALERT + reason
     ▼
SSE → Frontend Dashboard
```

### 8 Scenarios

| # | Name | HR | Expected | Threshold Fires |
|---|---|---|---|---|
| 1 | Normal rest at home | 68 | VETO | ✗ |
| 2 | Evening workout at gym | 142 | VETO | ✓ |
| 3 | Morning commute | 98 | VETO | ✗ |
| 4 | Deep work at office | 76 | VETO | ✗ |
| 5 | Dhikr / beads session | 138 | VETO | ✓ |
| 6 | Post-workout cooldown | 112 | VETO | ✓ |
| 7 | Normal evening, media | 72 | VETO | ✗ |
| **8** | **2AM — Unfamiliar location** | **89** | **ALERT** | ✗ |

Scenario 8 is the proof of concept: **heart rate is normal — everything else is not.**

---

## The Pitch

Without context: **3 alerts** fired (HR > 120 threshold).  
With VIGIL: **1 alert** fired, at the moment that actually matters.

The contrast between those two numbers is the product.
