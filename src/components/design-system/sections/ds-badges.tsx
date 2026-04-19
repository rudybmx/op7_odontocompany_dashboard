'use client'

interface BadgeProps {
  label: string
  bg: string
  border: string
  color: string
}

function Badge({ label, bg, border, color }: BadgeProps) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      background: bg, border: `1px solid ${border}`,
      borderRadius: 9999, padding: '2px 9px',
      fontSize: 10, fontWeight: 600, color,
      whiteSpace: 'nowrap',
    }}>{label}</span>
  )
}

function BadgeGroup({ title, badges }: { title: string; badges: BadgeProps[] }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ws-text-3)', marginBottom: 10 }}>{title}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {badges.map(b => <Badge key={b.label} {...b} />)}
      </div>
    </div>
  )
}

export function DSBadges() {
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ws-text-1)', marginBottom: 6 }}>Badges & Pills</h2>
        <p style={{ fontSize: 14, color: 'var(--ws-text-2)', lineHeight: 1.6 }}>
          Sempre com border + background soft. Nunca background sólido.
          Font: 10px / 600 / border-radius: 9999px / padding: 2px 9px.
        </p>
      </div>

      <div style={{
        background: 'var(--ws-glass-bg)', border: '1px solid var(--ws-glass-border)',
        borderRadius: 'var(--ws-radius-lg)', backdropFilter: 'blur(16px)',
        boxShadow: 'var(--ws-glass-shadow)', padding: 24,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)' }} />

        <BadgeGroup title="Status — Meta Ads" badges={[
          { label: 'Ativo',       bg: 'rgba(15,168,86,0.12)',  border: 'rgba(15,168,86,0.25)',  color: '#007a40' },
          { label: 'Pausado',     bg: 'rgba(255,92,141,0.12)', border: 'rgba(255,92,141,0.25)', color: '#c2004f' },
          { label: 'Aprendendo',  bg: 'rgba(62,91,255,0.12)',  border: 'rgba(62,91,255,0.25)',  color: '#2340c4' },
          { label: 'Fadiga',      bg: 'rgba(255,92,141,0.15)', border: 'rgba(255,92,141,0.30)', color: '#c2004f' },
          { label: 'Evergreen',   bg: 'rgba(15,168,86,0.12)',  border: 'rgba(15,168,86,0.25)',  color: '#007a40' },
          { label: 'Novo',        bg: 'rgba(14,20,42,0.08)',   border: 'rgba(14,20,42,0.15)',   color: '#0E142A' },
        ]} />

        <BadgeGroup title="Prioridade" badges={[
          { label: 'Top',   bg: 'rgba(0,184,200,0.12)',  border: 'rgba(0,184,200,0.25)',  color: '#007a87' },
          { label: 'Alto',  bg: 'rgba(255,92,141,0.12)', border: 'rgba(255,92,141,0.25)', color: '#c2004f' },
          { label: 'Médio', bg: 'rgba(122,90,248,0.12)', border: 'rgba(122,90,248,0.25)', color: '#5a3db5' },
          { label: 'Baixo', bg: 'rgba(15,168,86,0.12)',  border: 'rgba(15,168,86,0.25)',  color: '#007a40' },
        ]} />

        <BadgeGroup title="Tipo de Campanha — Google Ads" badges={[
          { label: 'Search',  bg: '#e6f1fb', border: 'rgba(24,95,165,0.25)', color: '#185fa5' },
          { label: 'PMax',    bg: '#eaf3de', border: 'rgba(59,109,17,0.25)', color: '#3b6d11' },
          { label: 'Display', bg: '#faeeda', border: 'rgba(133,79,11,0.25)', color: '#854f0b' },
          { label: 'Video',   bg: '#fcebeb', border: 'rgba(163,45,45,0.25)', color: '#a32d2d' },
        ]} />

        <BadgeGroup title="Com Ícone / Dot" badges={[
          { label: '● Ativo',    bg: 'rgba(15,168,86,0.12)',  border: 'rgba(15,168,86,0.25)',  color: '#007a40' },
          { label: '● Em pausa', bg: 'rgba(255,92,141,0.12)', border: 'rgba(255,92,141,0.25)', color: '#c2004f' },
          { label: '● Rascunho', bg: 'rgba(14,20,42,0.08)',   border: 'rgba(14,20,42,0.15)',   color: '#0E142A' },
        ]} />

        <div style={{ borderTop: '1px solid var(--ws-divider)', paddingTop: 16, marginTop: 4 }}>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ws-text-3)', marginBottom: 8 }}>Regras</div>
          <ul style={{ fontSize: 12, color: 'var(--ws-text-2)', paddingLeft: 18, lineHeight: 2, margin: 0 }}>
            <li><code style={{ fontFamily: 'monospace', fontSize: 11 }}>font-size: 10px</code>, <code style={{ fontFamily: 'monospace', fontSize: 11 }}>font-weight: 600</code></li>
            <li><code style={{ fontFamily: 'monospace', fontSize: 11 }}>border-radius: 9999px</code> — sempre pill</li>
            <li><code style={{ fontFamily: 'monospace', fontSize: 11 }}>padding: 2px 9px</code></li>
            <li>Background sempre rgba com opacidade baixa (0.08–0.15)</li>
            <li>Nunca fundo sólido, nunca sem border</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
