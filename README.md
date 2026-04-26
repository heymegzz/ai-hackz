# VIGIL — Contextual Wearable Intelligence

> *"The most intelligent decision an AI can make is sometimes to say absolutely nothing."*

VIGIL is a sophisticated multi-agent AI system designed to serve as the cognitive layer for next-generation wearable devices. By processing high-resolution biometric telemetry through a dual-agent reasoning pipeline, VIGIL filters out physiological "noise" to deliver high-fidelity, context-aware alerts.

---

## 🚀 The Value Proposition: 3 — 1 — 2

A traditional biometric monitor relies on static thresholds (e.g., HR > 120 bpm), leading to alert fatigue and irrelevant interruptions. VIGIL solves this through **Contextual Restraint**.

- **3 Threshold Alerts**: A standard system would have interrupted the user 3 times during a typical day (workout, prayer, stress).
- **1 Vigil Alert**: VIGIL fires exactly once—the only time an anomaly had no benign contextual explanation.
- **2 Silent Actions**: VIGIL handles background tasks silently (e.g., enabling DND during prayer), proving intelligence through action, not just interruption.

---

## 🛠 Technical Architecture

VIGIL utilizes a **streaming multi-agent architecture** to process data with sub-second latency.

### 1. Data Ingestion (Telemetry Stream)
The system ingests a real-time stream of biometric packets at 1Hz. Each packet includes:
- **Physiological**: Heart Rate (BPM), Heart Rate Variability (HRV).
- **Kinetic**: 3-axis Accelerometer data (Magnitude Calculation).
- **Contextual**: GPS Zone, Active Application, Battery Level, and Step Count.

### 2. The Profiler Agent (Awareness Layer)
Powered by **Llama 3.3 70B (via Groq)**, the Profiler translates raw numerical telemetry into a high-level "State Sentence." It understands user patterns (e.g., gym on Tuesdays, dhikr sessions at home) and provides the semantic foundation for decision-making.

### 3. The Action Agent (Decision Layer)
The Action Agent evaluates the Profiler's state alongside raw telemetry and historical decisions. It operates on three distinct output types:
- **VETO**: Total silence. Confirmed benign context.
- **ACT**: A "Silent Action." Handled in the background (e.g., dimming screen, holding notifications) without user interruption.
- **ALERT**: Immediate interruption. High physiological risk + zero contextual match.

### 4. Real-time Communication (SSE)
The backend communicates with the dashboard via **Server-Sent Events (SSE)**. This persistent HTTP connection allows the server to push AI reasoning and telemetry updates to the frontend in real-time without the overhead of polling.

---

## 💻 Tech Stack

- **Backend**: Python 3.9+, FastAPI, Uvicorn.
- **AI/LLM**: Groq Cloud API, Llama-3.3-70b-versatile.
- **Frontend**: React 18, Vite, TailwindCSS.
- **State Management**: React Hooks (useRef for high-frequency tracking, useCallback for stream stability).
- **Styling**: Minimalist "VIGIL Dark" theme, custom animations, and glassmorphism.

---

## ⚙️ Installation & Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- A [Groq API Key](https://console.groq.com/)

### 1. Backend Setup
```bash
cd backend
# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "GROQ_API_KEY=your_key_here" > .env

# Run server
python3 -m uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Usage
1. Open **http://localhost:5173** (Optimized for landscape desktop view).
2. Hover over the bottom controls to reveal the demo strip.
3. Click **START DEMO** to begin the 8-scenario simulation.

---

## 🧪 Simulation Scenarios

VIGIL cycles through 8 distinct real-world scenarios to demonstrate its reasoning:
1. **Normal Rest**: Stable baseline.
2. **Gym Workout**: High HR, but VETOED due to "Workout" app context.
3. **Commute**: Maps active, low battery. **ACTED** silently to conserve power.
4. **Deep Work**: Stationary, "Focus" app active.
5. **Dhikr/Prayer**: Elevated HR, rhythmic movement. **ACTED** to enable Do Not Disturb.
6. **Cooldown**: HR declining normally after session.
7. **Media Consumption**: Resting vitals.
8. **2 AM Anomaly**: Normal vitals, but stationary in an unfamiliar location at 2 AM. **ALERT FIRED**.

---

## 📄 License
MIT License. Created for the AI Hackathon 2026.
