import { memo } from 'react'
import { EQUIPE_STYLES } from '../constants'

const EquipeTag = memo(function EquipeTag({ label, variant }: { label: string; variant?: string }) {
  const s = EQUIPE_STYLES[variant ?? 'comercial']
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        border: `0.5px solid ${s.border}`,
        borderRadius: 9999,
        padding: '1px 6px',
        fontSize: 10,
        fontWeight: 500,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
})

export { EquipeTag }