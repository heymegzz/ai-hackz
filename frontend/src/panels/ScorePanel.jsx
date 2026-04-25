const SCENARIO_NAMES = [
  'Normal rest at home',
  'Evening workout at gym',
  'Morning commute',
  'Deep work at office',
  'Dhikr / beads session',
  'Post-workout cooldown',
  'Normal evening, media',
  '2AM — Unfamiliar location',
]

function ScenarioDot({ state }) {
  // state: 'done' | 'current' | 'upcoming'
  if (state === 'done') {
    return (
      <div className="w-2.5 h-2.5 rounded-full bg-vigil-blue flex-shrink-0" />
    )
  }
  if (state === 'current') {
    return (
      <div className="w-2.5 h-2.5 rounded-full bg-white animate-dot-pulse flex-shrink-0" />
    )
  }
  return (
    <div className="w-2.5 h-2.5 rounded-full border border-vigil-muted flex-shrink-0" />
  )
}

export default function ScorePanel({
  totalPossibleAlerts,
  vigilAlertsFired,
  scenarioIndex,
  scenarioId,
  counterFlash,
  demoRunning,
}) {
  const isAlert = scenarioId === 8 && vigilAlertsFired > 0
  const isAnomalyActive = scenarioId === 8 && demoRunning

  return (
    <div className="flex flex-col h-full p-4 gap-5">
      {/* Panel title */}
      <div className="text-[9px] font-semibold tracking-[0.3em] uppercase text-vigil-blue flex-shrink-0">
        INTELLIGENCE SUMMARY
      </div>

      {/* Threshold counter */}
      <div className="flex-shrink-0">
        <div className="text-[9px] tracking-[0.2em] uppercase text-vigil-muted mb-1">
          WITHOUT CONTEXT
        </div>
        <div
          className={`text-8xl font-light tabular-nums leading-none text-vigil-text transition-all duration-300 ${
            counterFlash.threshold ? 'animate-flash-white' : ''
          }`}
        >
          {totalPossibleAlerts}
        </div>
        <div className="text-[10px] text-vigil-muted mt-1.5 leading-relaxed">
          alerts a threshold system<br />would have fired
        </div>
      </div>

      {/* Divider line */}
      <div className="border-t border-vigil-border/60 flex-shrink-0" />

      {/* Vigil counter */}
      <div className="flex-shrink-0">
        <div className="text-[9px] tracking-[0.2em] uppercase text-vigil-blue mb-1">
          VIGIL
        </div>
        <div
          className={`text-8xl font-light tabular-nums leading-none transition-all duration-500 ${
            counterFlash.vigil
              ? 'animate-flash-amber-number'
              : vigilAlertsFired > 0
              ? 'text-vigil-amber'
              : 'text-vigil-blue'
          }`}
        >
          {vigilAlertsFired}
        </div>
        <div className="text-[10px] text-vigil-muted mt-1.5 leading-relaxed">
          alerts actually fired
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Scenario timeline */}
      <div className="flex-shrink-0">
        <div className="text-[9px] tracking-[0.2em] uppercase text-vigil-muted mb-3">
          SCENARIO PROGRESS
        </div>
        <div className="flex items-center gap-2">
          {SCENARIO_NAMES.map((_, i) => {
            let dotState = 'upcoming'
            if (scenarioIndex < 0) dotState = 'upcoming'
            else if (i < scenarioIndex) dotState = 'done'
            else if (i === scenarioIndex) dotState = 'current'
            return <ScenarioDot key={i} state={dotState} />
          })}
        </div>

        {/* Current scenario label */}
        <div className="mt-2 text-[9px] text-vigil-muted leading-relaxed truncate">
          {scenarioIndex >= 0 && scenarioIndex < 8
            ? `${scenarioIndex + 1}/8 — ${SCENARIO_NAMES[scenarioIndex]}`
            : demoRunning ? 'Starting...' : 'No active scenario'}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-vigil-border flex-shrink-0" />

      {/* System status */}
      <div className="flex-shrink-0">
        <div className="text-[9px] tracking-[0.2em] uppercase text-vigil-muted mb-1.5">
          SYSTEM STATUS
        </div>
        {isAnomalyActive ? (
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-vigil-amber animate-status-pulse" />
            <span className="text-[11px] font-semibold tracking-widest uppercase text-vigil-amber animate-status-pulse">
              ANOMALY DETECTED
            </span>
          </div>
        ) : demoRunning ? (
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-[11px] font-semibold tracking-widest uppercase text-green-400">
              MONITORING — CONTEXT CLEAR
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-vigil-muted" />
            <span className="text-[11px] font-semibold tracking-widest uppercase text-vigil-muted">
              STANDBY
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
