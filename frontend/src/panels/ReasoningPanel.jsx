import { useRef, useEffect } from 'react'

function DecisionBadge({ decision }) {
  if (decision === 'ALERT') {
    return (
      <span className="flex-shrink-0 inline-flex items-center px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase bg-vigil-amber text-black rounded-sm">
        ALERT FIRED
      </span>
    )
  }
  return (
    <span className="flex-shrink-0 inline-flex items-center px-2 py-0.5 text-[9px] font-semibold tracking-widest uppercase border border-vigil-blue text-vigil-blue rounded-sm bg-black">
      VETOED
    </span>
  )
}

function DecisionRow({ entry, index }) {
  const isAlert = entry.decision === 'ALERT'
  const isFaded = index >= 3   // entries 3+ fade to 30%

  return (
    <div
      className={`animate-slide-in flex-shrink-0 transition-opacity duration-500 ${
        isFaded ? 'opacity-30' : 'opacity-100'
      }`}
    >
      <div
        className={`flex items-start gap-3 py-2.5 px-3 border-b border-vigil-border ${
          isAlert ? 'bg-vigil-amber/5 border-l-2 border-l-vigil-amber' : ''
        }`}
      >
        {/* Timestamp */}
        <span className="flex-shrink-0 text-[10px] text-vigil-muted font-mono tabular-nums mt-0.5">
          {entry.timestamp}
        </span>

        {/* Badge */}
        <DecisionBadge decision={entry.decision} />

        {/* Reason */}
        <span
          className={`text-xs leading-relaxed flex-1 ${
            isAlert ? 'text-vigil-amber' : 'text-vigil-text'
          }`}
        >
          {entry.reason}
        </span>
      </div>

      {/* Alert message card */}
      {isAlert && entry.alert_message && (
        <div className="mx-3 mb-2 mt-1 p-3 border border-vigil-amber/40 bg-vigil-amber/5 rounded-sm">
          <div className="text-[9px] tracking-widest uppercase text-vigil-amber mb-1.5 font-semibold">
            MESSAGE SENT TO USER
          </div>
          <p className="text-sm text-vigil-amber leading-relaxed font-medium">
            "{entry.alert_message}"
          </p>
        </div>
      )}
    </div>
  )
}

export default function ReasoningPanel({ decisions, thinking, reasoningFlash, demoRunning, demoDone, onStart }) {
  const listRef = useRef(null)
  const visible = decisions.slice(0, 8)

  return (
    <div
      className={`flex flex-col h-full border border-transparent transition-all duration-200 ${
        reasoningFlash ? 'animate-border-flash-amber' : ''
      } ${thinking && demoRunning ? 'thinking-pulse' : ''}`}
    >
      {/* Panel header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-vigil-border">
        <span className="text-[9px] font-semibold tracking-[0.3em] uppercase text-vigil-blue">
          VIGIL REASONING
        </span>
        <div className="flex items-center gap-2">
          {thinking && demoRunning && (
            <span className="text-[9px] tracking-widest text-vigil-muted animate-status-pulse uppercase">
              processing
            </span>
          )}
          <span className="text-[9px] text-vigil-muted tabular-nums">
            {decisions.length} decisions
          </span>
        </div>
      </div>

      {/* Empty state / Welcome state */}
      {decisions.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 gap-6">
          <div className="text-center space-y-4">
            <div className="text-vigil-muted text-[10px] tracking-[0.3em] uppercase">
              {demoRunning ? 'Initializing agents...' : 'Vigil is Standby'}
            </div>
            
            {!demoRunning && !demoDone && (
              <div className="space-y-6">
                <p className="text-vigil-text/60 text-sm leading-relaxed max-w-xs mx-auto italic">
                  Vigil monitors biometrics with context. Most alerts are noise. Vigil is the signal.
                </p>
                <button
                  onClick={onStart}
                  className="px-8 py-3 bg-vigil-blue text-black text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-white transition-colors"
                >
                  Start Demo
                </button>
              </div>
            )}

            {demoDone && (
              <div className="space-y-6">
                <p className="text-vigil-amber text-sm leading-relaxed max-w-xs mx-auto italic">
                  Demo Complete. 8 scenarios analyzed. 1 critical anomaly detected.
                </p>
                <button
                  onClick={onStart}
                  className="px-8 py-3 border border-vigil-blue text-vigil-blue text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-vigil-blue hover:text-black transition-all"
                >
                  Restart
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Decisions log — newest on top */}
      {decisions.length > 0 && (
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto flex flex-col"
        >
          {visible.map((entry, i) => (
            <DecisionRow key={entry.id} entry={entry} index={i} />
          ))}
        </div>
      )}

      {/* Footer — total count if more than 8 */}
      {decisions.length > 8 && (
        <div className="flex-shrink-0 px-4 py-2 border-t border-vigil-border bg-black/50">
          <span className="text-[9px] text-vigil-muted tracking-widest uppercase">
            +{decisions.length - 8} earlier decisions archived
          </span>
        </div>
      )}
    </div>
  )
}

