import { useEffect, useState } from 'react'

export default function AlertOverlay({ message }) {
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    // Fade in
    requestAnimationFrame(() => setOpacity(1))
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500"
      style={{
        backgroundColor: 'rgba(0,0,0,0.88)',
        opacity,
      }}
    >
      <div className="flex flex-col items-center gap-6 max-w-sm text-center px-8">
        {/* Pulsing amber circle */}
        <div className="relative flex items-center justify-center">
          {/* Outer ring */}
          <div
            className="absolute w-28 h-28 rounded-full border border-vigil-amber/30 animate-pulse-ring"
            style={{ animationDelay: '0.2s' }}
          />
          {/* Middle ring */}
          <div
            className="absolute w-20 h-20 rounded-full border border-vigil-amber/60 animate-pulse-ring"
          />
          {/* Inner dot */}
          <div className="w-12 h-12 rounded-full border-2 border-vigil-amber" />
        </div>

        {/* Alert message */}
        <p className="text-2xl text-white font-light leading-relaxed tracking-wide">
          {message}
        </p>

        {/* Attribution */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-[9px] tracking-[0.3em] uppercase text-vigil-amber font-semibold">
            VIGIL — Context Anomaly Detected
          </span>
          <span className="text-[9px] tracking-widest text-vigil-muted uppercase">
            Heart rate normal · Everything else is not
          </span>
        </div>
      </div>
    </div>
  )
}
