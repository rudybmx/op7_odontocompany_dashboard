'use client'

interface SparklineProps {
  data: number[]
  color: string
  width?: number
  height?: number
}

function Sparkline({ data, color, width = 72, height = 28 }: SparklineProps) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const stepX = width / (data.length - 1)

  const points = data.map((v, i) => ({
    x: i * stepX,
    y: height - ((v - min) / range) * (height - 4) - 2,
  }))

  const polyline = points.map(p => `${p.x},${p.y}`).join(' ')
  const area = `M${points[0].x},${height} ` +
    points.map(p => `L${p.x},${p.y}`).join(' ') +
    ` L${points[points.length - 1].x},${height} Z`

  return (
    <svg width={width} height={height} style={{ overflow: 'visible', display: 'block' }}>
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.35} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#grad-${color.replace('#', '')})`} />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  )
}

interface KpiProps {
  label: string
  value: string
  delta: string
  positive: boolean
  sparkData: number[]
  accentColor: string
  glowColor: string
}

function KpiCard({ label, value, delta, positive, sparkData, accentColor, glowColor }: KpiProps) {
  return (
    <div style={{
      background: 'var(--ws-glass-bg)',
      border: `1px solid ${accentColor}33`,
      borderRadius: 'var(--ws-radius-lg)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      boxShadow: `var(--ws-glass-shadow), 0 0 24px ${glowColor}`,
      padding: 16,
      position: 'relative',
      overflow: 'hidden',
      transition: 'var(--ws-transition)',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = `var(--ws-glass-shadow-lg), 0 0 32px ${glowColor}`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = `var(--ws-glass-shadow), 0 0 24px ${glowColor}`
      }}
    >
      {/* shine */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)' }} />
      {/* glow circle */}
      <div style={{
        position: 'absolute', bottom: -20, right: -20,
        width: 80, height: 80, borderRadius: '50%',
        background: accentColor, opacity: 0.07,
      }} />

      <div style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.10em', color: 'var(--ws-text-3)', marginBottom: 8 }}>{label}</div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--ws-text-1)', letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
            <span style={{ fontSize: 11, color: positive ? 'var(--ws-green)' : 'var(--ws-coral)', fontWeight: 500 }}>
              {positive ? '↑' : '↓'} {delta}
            </span>
          </div>
        </div>
        <Sparkline data={sparkData} color={accentColor} />
      </div>
    </div>
  )
}

const SPARK1 = [30, 45, 38, 60, 55, 72, 68, 85, 78, 92, 88, 102]
const SPARK2 = [12, 18, 15, 22, 19, 28, 24, 32, 29, 38, 35, 42]
const SPARK3 = [8.5, 7.2, 8.8, 7.5, 9.1, 7.8, 8.2, 7.1, 7.9, 6.8, 7.4, 6.2]

export function DSKpiCards() {
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ws-text-1)', marginBottom: 6 }}>KPI Cards</h2>
        <p style={{ fontSize: 14, color: 'var(--ws-text-2)', lineHeight: 1.6 }}>
          Cards de métrica com sparkline SVG inline. Sem dependências externas para o sparkline.
          Círculo de glow no canto para identidade visual.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <KpiCard
          label="Investimento Total"
          value="R$ 48.720"
          delta="+18,4% vs. anterior"
          positive={true}
          sparkData={SPARK1}
          accentColor="#3E5BFF"
          glowColor="rgba(62,91,255,0.12)"
        />
        <KpiCard
          label="Leads Gerados"
          value="1.247"
          delta="+32,1% vs. anterior"
          positive={true}
          sparkData={SPARK2}
          accentColor="#0fa856"
          glowColor="rgba(15,168,86,0.12)"
        />
        <KpiCard
          label="CPL Médio"
          value="R$ 39,07"
          delta="−10,2% vs. anterior"
          positive={true}
          sparkData={SPARK3}
          accentColor="#FF5C8D"
          glowColor="rgba(255,92,141,0.12)"
        />
      </div>

      <div style={{
        background: 'var(--ws-glass-bg)', border: '1px solid var(--ws-glass-border)',
        borderRadius: 'var(--ws-radius-lg)', backdropFilter: 'blur(16px)',
        boxShadow: 'var(--ws-glass-shadow)', padding: 16,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)' }} />
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ws-text-3)', marginBottom: 8 }}>Sparkline SVG inline</div>
        <p style={{ fontSize: 12, color: 'var(--ws-text-2)', lineHeight: 1.6, margin: 0 }}>
          O sparkline é gerado em SVG puro (72×28px) sem Recharts. Usa <code style={{ fontFamily: 'monospace' }}>polyline</code> + área com <code style={{ fontFamily: 'monospace' }}>linearGradient</code> opacity 0.35→0.
          Delta verde = CPL caindo (positivo para o usuário). Delta coral = métrica piorando.
        </p>
      </div>
    </div>
  )
}
