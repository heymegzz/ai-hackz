"""
VIGIL — Scenario Definitions
8 pre-built biometric scenarios that cycle through the demo stream.
Scenario 8 is the only one that fires an alert.
"""

SCENARIOS = [
    {
        "scenario_id": 1,
        "name": "Normal rest at home",
        "duration": (8, 12),
        "expected": "VETO",
        "data": {
            "heart_rate": 68,
            "hrv": 58.2,
            "accelerometer": {"x": 0.01, "y": 0.02, "z": 9.80},
            "gps_zone": "home",
            "active_app": None,
            "battery": 84,
            "step_count": 0,
        },
        "context_note": "User is resting at home with very low movement and stable vitals.",
    },
    {
        "scenario_id": 2,
        "name": "Evening workout at gym",
        "duration": (8, 12),
        "expected": "VETO",
        "threshold_fires": True,   # HR > 120 — threshold system would alert
        "data": {
            "heart_rate": 142,
            "hrv": 31.1,
            "accelerometer": {"x": 1.82, "y": 2.41, "z": 8.10},
            "gps_zone": "gym",
            "active_app": "Workout",
            "battery": 71,
            "step_count": 847,
        },
        "context_note": "Active workout session at the gym on a Tuesday evening. High movement confirmed.",
    },
    {
        "scenario_id": 3,
        "name": "Morning commute, elevated stress baseline",
        "duration": (8, 12),
        "expected": "VETO",
        "data": {
            "heart_rate": 98,
            "hrv": 44.5,
            "accelerometer": {"x": 0.31, "y": 0.44, "z": 9.62},
            "gps_zone": "commute",
            "active_app": "Maps",
            "battery": 92,
            "step_count": 203,
        },
        "context_note": "Morning commute. Elevated stress baseline is expected on this route.",
    },
    {
        "scenario_id": 4,
        "name": "Deep work at office",
        "duration": (8, 12),
        "expected": "VETO",
        "data": {
            "heart_rate": 76,
            "hrv": 52.0,
            "accelerometer": {"x": 0.00, "y": 0.01, "z": 9.81},
            "gps_zone": "office",
            "active_app": "Focus",
            "battery": 63,
            "step_count": 12,
        },
        "context_note": "Deep focus session at the office. Sedentary but cognitively engaged.",
    },
    {
        "scenario_id": 5,
        "name": "Dhikr / beads counting session",
        "duration": (8, 12),
        "expected": "VETO",
        "threshold_fires": True,   # HR > 120 — threshold system would alert
        "data": {
            "heart_rate": 138,
            "hrv": 28.4,
            "accelerometer": {"x": 0.12, "y": 0.08, "z": 9.79},
            "gps_zone": "home",
            "active_app": "Beads",
            "battery": 55,
            "step_count": 0,
        },
        "context_note": "Dhikr session at home. Rhythmic low movement, elevated HR is expected and appears in 91% of recorded sessions.",
    },
    {
        "scenario_id": 6,
        "name": "Post-workout cooldown",
        "duration": (8, 12),
        "expected": "VETO",
        "threshold_fires": True,   # HR > 120 — threshold system would alert
        "data": {
            "heart_rate": 112,
            "hrv": 38.7,
            "accelerometer": {"x": 0.04, "y": 0.03, "z": 9.80},
            "gps_zone": "gym",
            "active_app": "Workout",
            "battery": 48,
            "step_count": 1204,
        },
        "context_note": "Post-workout cooldown at the gym. HR declining from peak, movement minimal.",
    },
    {
        "scenario_id": 7,
        "name": "Normal evening, watching something",
        "duration": (8, 12),
        "expected": "VETO",
        "data": {
            "heart_rate": 72,
            "hrv": 61.3,
            "accelerometer": {"x": 0.00, "y": 0.01, "z": 9.81},
            "gps_zone": "home",
            "active_app": "Media",
            "battery": 38,
            "step_count": 5,
        },
        "context_note": "Relaxed evening at home watching media. All vitals within normal resting range.",
    },
    {
        "scenario_id": 8,
        "name": "2AM — Unfamiliar location, no context",
        "duration": (10, 14),
        "expected": "ALERT",
        "data": {
            "heart_rate": 89,
            "hrv": 29.1,
            "accelerometer": {"x": 0.0, "y": 0.0, "z": 9.8},
            "gps_zone": "unfamiliar",
            "active_app": None,
            "battery": 31,
            "step_count": 0,
            "time_context": "02:17 AM",
        },
        "context_note": "2:17 AM. Unfamiliar location. No movement for 22+ minutes. No active app. Zero historical context matches.",
    },
]

# Lookup by scenario_id for fast access
SCENARIO_MAP = {s["scenario_id"]: s for s in SCENARIOS}
