import { useState } from 'react'

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

export default function DemoControls({
  demoRunning,
  demoDone,
  scenarioIndex,
  scenarioName,
  onStart,
  onReset,
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 transition-all duration-300"
      style={{
        transform: hovered ? 'translateY(0)' : 'translateY(calc(100% - 4px))',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Hover trigger strip */}
      <div className="h-1 w-full bg-vigil-border cursor-pointer" />

      {/* Control bar */}
      <div className="bg-vigil-black border-t border-vigil-border px-6 py-3 flex items-center gap-4">
        {/* Start / Restart */}
        <button
          id="btn-start-demo"
          onClick={onStart}
          disabled={demoRunning}
          className={`px-4 py-1.5 text-xs font-semibold tracking-widest uppercase transition-all duration-200 ${
            demoRunning
              ? 'bg-vigil-border text-vigil-muted cursor-not-allowed'
              : 'bg-vigil-blue text-black hover:bg-white'
          }`}
        >
          {demoDone ? 'RESTART DEMO' : 'START DEMO'}
        </button>

        {/* Reset */}
        <button
          id="btn-reset-demo"
          onClick={onReset}
          className="px-4 py-1.5 text-xs font-semibold tracking-widest uppercase border border-vigil-border text-vigil-muted hover:border-vigil-text hover:text-vigil-text transition-all duration-200"
        >
          RESET
        </button>

        {/* Divider */}
        <div className="h-4 w-px bg-vigil-border" />

        {/* Current scenario info */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] tracking-widest uppercase text-vigil-muted">SCENARIO</span>
          <span className="text-[10px] text-vigil-text font-mono tabular-nums">
            {scenarioIndex >= 0 ? `${scenarioIndex + 1} / 8` : '— / 8'}
          </span>
          {scenarioName && (
            <>
              <span className="text-vigil-muted">·</span>
              <span className="text-[10px] text-vigil-muted italic">{scenarioName}</span>
            </>
          )}
        </div>

        {/* Right side — status */}
        <div className="ml-auto flex items-center gap-2">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              demoRunning ? 'bg-vigil-blue animate-status-pulse' : 'bg-vigil-muted'
            }`}
          />
          <span className="text-[9px] tracking-widest uppercase text-vigil-muted">
            {demoRunning ? 'LIVE' : demoDone ? 'COMPLETE' : 'STANDBY'}
          </span>
        </div>
      </div>
    </div>
  )
}
