'use client'

function GlassCard({
  size = 'md',
  color,
  children,
  title,
  desc,
}: {
  size?: 'sm' | 'md' | 'lg'
  color?: 'blue' | 'purple' | 'coral' | 'green'
  children?: React.ReactNode
  title: string
  desc: string
}) {
  const paddings = { sm: 12, md: 16, lg: 20 }
  const radii = { sm: 'var(--ws-radius-md)', md: 'var(--ws-radius-lg)', lg: 'var(--ws-radius-xl)' }

  const colorMap = {
    blue:   { border: 'rgba(62,91,255,0.40)',  glow: '0 0 24px rgba(62,91,255,0.15)' },
    purple: { border: 'rgba(122,90,248,0.40)', glow: '0 0 24px rgba(122,90,248,0.15)' },
    coral:  { border: 'rgba(255,92,141,0.40)', glow: '0 0 24px rgba(255,92,141,0.15)' },
    green:  { border: 'rgba(15,168,86,0.40)',  glow: '0 0 24px rgba(15,168,86,0.15)' },
  }

  const borderColor = color ? colorMap[color].border : 'var(--ws-glass-border)'
  const shadow = color
    ? `var(--ws-glass-shadow), ${colorMap[color].glow}`
    : 'var(--ws-glass-shadow)'

  return (
    <div style={{
      background: 'var(--ws-glass-bg)',
      border: `1px solid ${borderColor}`,
      borderRadius: radii[size],
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      boxShadow: shadow,
      padding: paddings[size],
      position: 'relative',
      overflow: 'hidden',
      transition: 'var(--ws-transition)',
      cursor: 'default',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = color
          ? `var(--ws-glass-shadow-lg), ${colorMap[color!].glow}`
          : 'var(--ws-glass-shadow-lg)'
        e.currentTarget.style.background = 'var(--ws-glass-bg-hover)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = shadow
        e.currentTarget.style.background = 'var(--ws-glass-bg)'
      }}
    >
      {/* shine line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
      }} />
      {children ?? (
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ws-text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{title}</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--ws-text-1)', letterSpacing: '-0.01em' }}>R$ 12.480</div>
          <div style={{ fontSize: 12, color: 'var(--ws-text-2)', marginTop: 4 }}>{desc}</div>
        </div>
      )}
    </div>
  )
}

export function DSCards() {
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ws-text-1)', marginBottom: 6 }}>Glass Cards</h2>
        <p style={{ fontSize: 14, color: 'var(--ws-text-2)', lineHeight: 1.6 }}>
          Todo componente de conteúdo usa glass card como wrapper.
          Hover aplica <code style={{ fontFamily: 'monospace', fontSize: 12 }}>shadow-lg + translateY(-2px)</code>.
        </p>
      </div>

      {/* Tamanhos */}
      <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ws-text-3)', marginBottom: 12 }}>Tamanhos</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        <GlassCard size="sm" title="Card SM" desc="radius: 10px · padding: 12px" />
        <GlassCard size="md" title="Card MD (padrão)" desc="radius: 14px · padding: 16px" />
        <GlassCard size="lg" title="Card LG" desc="radius: 18px · padding: 20px" />
      </div>

      {/* Coloridos */}
      <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ws-text-3)', marginBottom: 12 }}>Variações Coloridas (borda + glow)</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        <GlassCard color="blue"   title="Blue"   desc="Ação primária, dados" />
        <GlassCard color="purple" title="Purple" desc="IA, insights, magics" />
        <GlassCard color="coral"  title="Coral"  desc="Alertas, pausados" />
        <GlassCard color="green"  title="Green"  desc="Positivo, sucesso" />
      </div>

      {/* Especificação */}
      <div style={{
        background: 'var(--ws-glass-bg)', border: '1px solid var(--ws-glass-border)',
        borderRadius: 'var(--ws-radius-lg)', backdropFilter: 'blur(16px)',
        boxShadow: 'var(--ws-glass-shadow)', padding: 20,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)' }} />
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ws-text-3)', marginBottom: 12 }}>CSS Base</div>
        <pre style={{
          fontSize: 11, fontFamily: 'monospace', color: 'var(--ws-text-1)',
          background: 'rgba(0,0,0,0.04)', borderRadius: 8, padding: 16,
          overflow: 'auto', lineHeight: 1.6, margin: 0,
        }}>{`background: var(--ws-glass-bg);
border: 1px solid var(--ws-glass-border);
border-radius: var(--ws-radius-lg); /* 14px */
backdrop-filter: blur(16px);
box-shadow: var(--ws-glass-shadow);
position: relative; overflow: hidden;

/* Linha de brilho no topo */
::after {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
}

/* Hover */
:hover {
  box-shadow: var(--ws-glass-shadow-lg);
  background: var(--ws-glass-bg-hover);
  transform: translateY(-2px);
}`}</pre>
      </div>
    </div>
  )
}
