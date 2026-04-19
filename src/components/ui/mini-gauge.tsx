import React from 'react'

interface MiniGaugeProps {
  value: number
  size?: number
  strokeWidth?: number
  color?: string
  label?: string
  showValue?: boolean
  trend?: 'up' | 'down' | 'neutral'
}

export function MiniGauge({
  value,
  size = 48,
  strokeWidth = 4,
  color,
  label,
  showValue = true,
  trend
}: MiniGaugeProps) {
  // Clamp value between 0 and 100
  const clampedValue = Math.max(0, Math.min(100, value))

  // Calculate default color if none is provided
  let gaugeColor = color
  if (!gaugeColor) {
    if (clampedValue <= 33) gaugeColor = '#FF5C8D' // coral
    else if (clampedValue <= 66) gaugeColor = '#EF9F27' // amber
    else if (clampedValue <= 89) gaugeColor = '#3E5BFF' // blue
    else gaugeColor = '#0fa856' // green
  }

  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (clampedValue / 100) * circumference

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
      <div
        className="group"
        style={{
          position: 'relative',
          display: 'inline-flex',
          width: size,
          height: size,
        }}
      >
        <svg
          viewBox={`0 0 ${size} ${size}`}
          width={size}
          height={size}
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--ws-glass-border-strong)"
            strokeWidth={strokeWidth}
            style={{ opacity: 0.15 }}
          />
          
          {/* Progress Indicator */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={gaugeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 600ms ease' }}
          />
        </svg>

        {showValue && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: `${size * 0.22}px`,
              fontWeight: 600,
              color: gaugeColor,
              letterSpacing: '-0.02em',
            }}
          >
            {Math.round(clampedValue)}%
          </div>
        )}

        {/* Tooltip on Hover */}
        <div 
          className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10"
          style={{
            fontSize: '10px',
            background: 'var(--ws-glass-bg-hover)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--ws-glass-border)',
            borderRadius: '6px',
            padding: '4px 8px',
            color: 'var(--ws-text-1)',
            boxShadow: 'var(--ws-glass-shadow-sm)'
          }}
        >
          vs. mês anterior
        </div>
      </div>
      
      {label && (
        <span style={{ fontSize: '12px', color: 'var(--ws-text-2)', fontWeight: 500 }}>
          {label}
        </span>
      )}
    </div>
  )
}
