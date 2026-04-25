import { useState, useEffect, useRef } from 'react'

function getMovementLabel(acc) {
  if (!acc) return null
  const mag = Math.sqrt(
    Math.pow(acc.x, 2) +
    Math.pow(acc.y, 2) +
    Math.pow((acc.z || 9.8) - 9.8, 2)
  )
  if (mag < 0.1) return 'STILL'
  if (mag < 0.5) return 'LOW'
  if (mag < 1.5) return 'ACTIVE'
  return 'INTENSE'
}

function MetricCard({ label, value, unit, highlight }) {
  const [flash, setFlash] = useState(false)
  const prevRef = useRef(value)

  useEffect(() => {
    if (prevRef.current !== value && value != null) {
      setFlash(true)
      const t = setTimeout(() => setFlash(false), 350)
      prevRef.current = value
      return () => clearTimeout(t)
    }
    prevRef.current = value
  }, [value])

  const isEmpty = value == null

  return (
    <div className="bg-vigil-black border border-vigil-border p-3">
      <div className="text-[9px] font-semibold tracking-[0.2em] uppercase text-vigil-muted mb-1">
        {label}
      </div>
      <div className={`flex items-baseline gap-1 ${flash ? 'animate-fade-value' : ''}`}>
        {isEmpty ? (
          <span className="text-2xl font-light text-vigil-muted/25">—</span>
        ) : (
          <>
            <span
              className={`text-5xl font-light tabular-nums leading-none ${
                highlight ? 'text-vigil-blue' : 'text-vigil-text'
              }`}
            >
              {value}
            </span>
            {unit && (
              <span className="text-xs text-vigil-muted font-normal">{unit}</span>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function TextCard({ label, value, highlight }) {
  const [flash, setFlash] = useState(false)
  const prevRef = useRef(value)

  useEffect(() => {
    if (prevRef.current !== value && value != null) {
      setFlash(true)
      const t = setTimeout(() => setFlash(false), 350)
      prevRef.current = value
      return () => clearTimeout(t)
    }
    prevRef.current = value
  }, [value])

  const isEmpty = !value

  return (
    <div className="bg-vigil-black border border-vigil-border p-3">
      <div className="text-[9px] font-semibold tracking-[0.2em] uppercase text-vigil-muted mb-1">
        {label}
      </div>
      <div
        className={`font-medium tracking-wide ${flash ? 'animate-fade-value' : ''} ${
          isEmpty
            ? 'text-xl text-vigil-muted/25'
            : 'text-2xl ' + (highlight ? 'text-vigil-blue' : 'text-vigil-text')
        }`}
      >
        {isEmpty ? '—' : value}
      </div>
    </div>
  )
}

export default function BiometricsPanel({ telemetry, profilerState, demoRunning }) {
  const movement = getMovementLabel(telemetry?.accelerometer)
  const isIntense = movement === 'INTENSE' || movement === 'ACTIVE'

  return (
    <div className="flex flex-col h-full p-4 gap-3">
      {/* Panel title */}
      <div className="text-[9px] font-semibold tracking-[0.3em] uppercase text-vigil-blue flex-shrink-0">
        BIOMETRICS
      </div>

      {/* 5 metric cards */}
      <div className="flex flex-col gap-2 flex-shrink-0">
        <MetricCard
          label="HEART RATE"
          value={telemetry?.heart_rate ?? null}
          unit="bpm"
        />
        <MetricCard
          label="HRV"
          value={telemetry?.hrv ?? null}
          unit="ms"
        />
      </div>

      {/* Text-based metrics */}
      <div className="flex flex-col gap-2 flex-shrink-0">
        <TextCard
          label="MOVEMENT"
          value={movement}
          highlight={isIntense}
        />
        <TextCard
          label="LOCATION"
          value={
            telemetry?.gps_zone
              ? telemetry.gps_zone.charAt(0).toUpperCase() + telemetry.gps_zone.slice(1)
              : null
          }
        />
        <TextCard
          label="ACTIVE APP"
          value={telemetry?.active_app || null}
        />
      </div>

      {/* Divider */}
      <div className="border-t border-vigil-border flex-shrink-0" />

      {/* Context / Profiler state */}
      <div className="flex-1 overflow-hidden">
        <div className="text-[9px] font-semibold tracking-[0.2em] uppercase text-vigil-blue mb-2">
          CONTEXT
        </div>
        <p
          className={`text-sm italic leading-relaxed ${
            demoRunning ? 'text-vigil-text opacity-80' : 'text-vigil-muted/50'
          }`}
        >
          {profilerState}
        </p>
      </div>

      {/* Battery & step count at bottom */}
      <div className="flex-shrink-0 flex items-center justify-between pt-2 border-t border-vigil-border">
        <div className="flex items-center gap-1">
          <span className="text-[9px] tracking-widest uppercase text-vigil-muted">BATTERY</span>
          <span className="text-xs text-vigil-text ml-1">
            {telemetry ? `${telemetry.battery}%` : '—'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[9px] tracking-widest uppercase text-vigil-muted">STEPS</span>
          <span className="text-xs text-vigil-text ml-1">
            {telemetry ? telemetry.step_count?.toLocaleString() : '—'}
          </span>
        </div>
      </div>
    </div>
  )
}
