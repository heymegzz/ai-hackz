import { useState, useEffect, useRef, useCallback } from 'react'
import BiometricsPanel from './panels/BiometricsPanel'
import ReasoningPanel from './panels/ReasoningPanel'
import ScorePanel from './panels/ScorePanel'
import AlertOverlay from './components/AlertOverlay'
import DemoControls from './components/DemoControls'

const BACKEND = 'http://localhost:8000'

export default function App() {
  const [demoRunning, setDemoRunning] = useState(false)
  const [demoDone, setDemoDone] = useState(false)

  // Live telemetry
  const [telemetry, setTelemetry] = useState(null)
  const [profilerState, setProfilerState] = useState('Waiting for signal...')
  const [currentDecision, setCurrentDecision] = useState(null)

  // Log of all decisions (newest first for rendering)
  const [decisions, setDecisions] = useState([])

  // Counters
  const [totalPossibleAlerts, setTotalPossibleAlerts] = useState(0)
  const [vigilAlertsFired, setVigilAlertsFired] = useState(0)
  const [silentActionsFired, setSilentActionsFired] = useState(0)

  // Scenario tracking
  const [scenarioIndex, setScenarioIndex] = useState(-1)   // 0-based
  const [scenarioId, setScenarioId] = useState(null)
  const [scenarioName, setScenarioName] = useState('')

  // Alert overlay
  const [alertVisible, setAlertVisible] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')

  // Reasoning panel "thinking" pulse
  const [thinking, setThinking] = useState(false)

  // Panel flash triggers
  const [reasoningFlash, setReasoningFlash] = useState(false)
  const [counterFlash, setCounterFlash] = useState({ threshold: false, vigil: false })

  const esRef = useRef(null)
  const prevTotalRef = useRef(0)
  const prevVigilRef = useRef(0)
  const prevSilentRef = useRef(0)
  const lastSilentScenarioRef = useRef(null)

  const stopStream = useCallback(() => {
    if (esRef.current) {
      esRef.current.close()
      esRef.current = null
    }
  }, [])

  const startStream = useCallback(() => {
    stopStream()
    setThinking(true)

    const es = new EventSource(`${BACKEND}/stream`)
    esRef.current = es

    es.onmessage = (event) => {
      setThinking(false)
      const data = JSON.parse(event.data)

      // Demo done signal
      if (data.event === 'done') {
        setDemoRunning(false)
        setDemoDone(true)
        setThinking(false)
        stopStream()
        return
      }

      const {
        telemetry: tel,
        profiler_state,
        decision,
        reason,
        action_taken,
        alert_message,
        timestamp,
        scenario_id,
        scenario_name,
        scenario_index,
        total_possible_alerts,
        vigil_alerts_fired,
      } = data

      setTelemetry(tel)
      setProfilerState(profiler_state)
      setScenarioId(scenario_id)
      setScenarioName(scenario_name)
      setScenarioIndex(scenario_index)

      const entry = {
        id: `${scenario_id}-${timestamp}-${Math.random()}`,
        decision,
        reason,
        action_taken,
        alert_message,
        timestamp,
        scenario_id,
      }

      setCurrentDecision(entry)
      setDecisions(prev => [entry, ...prev].slice(0, 50))

      // Counter flash on threshold increment
      if (total_possible_alerts > prevTotalRef.current) {
        setCounterFlash(f => ({ ...f, threshold: true }))
        setTimeout(() => setCounterFlash(f => ({ ...f, threshold: false })), 700)
      }
      prevTotalRef.current = total_possible_alerts

      // Vigil alert counter flash
      if (vigil_alerts_fired > prevVigilRef.current) {
        setCounterFlash(f => ({ ...f, vigil: true }))
        setTimeout(() => setCounterFlash(f => ({ ...f, vigil: false })), 700)
      }
      prevVigilRef.current = vigil_alerts_fired

      // Silent actions counter
      if (decision === 'ACT' && lastSilentScenarioRef.current !== scenario_id) {
        setSilentActionsFired(s => s + 1)
        lastSilentScenarioRef.current = scenario_id
        setCounterFlash(f => ({ ...f, silent: true }))
        setTimeout(() => setCounterFlash(f => ({ ...f, silent: false })), 700)
      }

      setTotalPossibleAlerts(total_possible_alerts)
      setVigilAlertsFired(vigil_alerts_fired)

      // Alert scenario: show overlay + flash reasoning border
      if (decision === 'ALERT' && alert_message) {
        setAlertMessage(alert_message)
        setAlertVisible(true)
        setReasoningFlash(true)
        setTimeout(() => setReasoningFlash(false), 900)
        setTimeout(() => setAlertVisible(false), 4000)
      }

      // Brief "thinking" between packets
      setTimeout(() => setThinking(true), 800)
    }

    es.onerror = () => {
      setThinking(false)
      // Silently keep last state — never show error in UI
      stopStream()
      setDemoRunning(false)
    }
  }, [stopStream])

  const handleStart = useCallback(async () => {
    // Reset all state
    setDecisions([])
    setTelemetry(null)
    setProfilerState('Waiting for signal...')
    setCurrentDecision(null)
    setTotalPossibleAlerts(0)
    setVigilAlertsFired(0)
    setScenarioIndex(-1)
    setScenarioId(null)
    setScenarioName('')
    setAlertVisible(false)
    setAlertMessage('')
    setDemoDone(false)
    setSilentActionsFired(0)
    prevTotalRef.current = 0
    prevVigilRef.current = 0
    prevSilentRef.current = 0

    try {
      await fetch(`${BACKEND}/control/start`, { method: 'POST' })
    } catch (_) { /* backend may not respond — that's ok */ }

    setDemoRunning(true)
    startStream()
  }, [startStream])

  const handleReset = useCallback(async () => {
    stopStream()
    try {
      await fetch(`${BACKEND}/control/reset`, { method: 'POST' })
    } catch (_) {}
    setDecisions([])
    setTelemetry(null)
    setProfilerState('Waiting for signal...')
    setCurrentDecision(null)
    setTotalPossibleAlerts(0)
    setVigilAlertsFired(0)
    setScenarioIndex(-1)
    setScenarioId(null)
    setScenarioName('')
    setAlertVisible(false)
    setDemoDone(false)
    setDemoRunning(false)
    setThinking(false)
    setSilentActionsFired(0)
    prevTotalRef.current = 0
    prevVigilRef.current = 0
    prevSilentRef.current = 0
    lastSilentScenarioRef.current = null
  }, [stopStream])

  // Cleanup on unmount
  useEffect(() => () => stopStream(), [stopStream])

  return (
    <div className="relative flex flex-col h-screen w-screen bg-vigil-black overflow-hidden select-none">

      {/* ── Top brand bar ── */}
      <header className="flex-shrink-0 flex items-center justify-between px-6 py-3 border-b border-vigil-border">
        <div className="flex items-center gap-3">
          {/* Pulsing status dot */}
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              demoRunning
                ? 'bg-vigil-blue animate-status-pulse'
                : demoDone
                ? 'bg-vigil-amber'
                : 'bg-vigil-muted'
            }`}
          />
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-vigil-blue">VIGIL</span>
          <span className="text-xs text-vigil-muted tracking-widest uppercase">— Contextual Intelligence</span>
        </div>
        <div className="text-xs text-vigil-muted tracking-widest uppercase">
          {demoRunning
            ? `SCENARIO ${scenarioIndex >= 0 ? scenarioIndex + 1 : '—'} / 8`
            : demoDone
            ? 'DEMO COMPLETE'
            : 'STANDBY'}
        </div>
      </header>

      {/* ── Three-panel main layout ── */}
      <main className="flex flex-1 gap-0 overflow-hidden min-w-0">
        {/* Left 30% */}
        <div className="flex-shrink-0 border-r border-vigil-border overflow-hidden" style={{ width: '30%' }}>
          <BiometricsPanel
            telemetry={telemetry}
            profilerState={profilerState}
            demoRunning={demoRunning}
          />
        </div>

        {/* Center 40% */}
        <div className="flex-1 border-r border-vigil-border overflow-hidden" style={{ minWidth: 0 }}>
          <ReasoningPanel
            decisions={decisions}
            thinking={thinking}
            reasoningFlash={reasoningFlash}
            demoRunning={demoRunning}
            demoDone={demoDone}
            onStart={handleStart}
          />
        </div>

        {/* Right 30% */}
        <div className="flex-shrink-0 overflow-hidden" style={{ width: '30%' }}>
          <ScorePanel
            totalPossibleAlerts={totalPossibleAlerts}
            vigilAlertsFired={vigilAlertsFired}
            silentActionsFired={silentActionsFired}
            scenarioIndex={scenarioIndex}
            scenarioId={scenarioId}
            counterFlash={counterFlash}
            demoRunning={demoRunning}
          />
        </div>
      </main>

      {/* ── Alert overlay ── */}
      {alertVisible && (
        <AlertOverlay message={alertMessage} />
      )}

      {/* ── Demo controls (bottom hover bar) ── */}
      <DemoControls
        demoRunning={demoRunning}
        demoDone={demoDone}
        scenarioIndex={scenarioIndex}
        scenarioName={scenarioName}
        onStart={handleStart}
        onReset={handleReset}
      />
    </div>
  )
}
