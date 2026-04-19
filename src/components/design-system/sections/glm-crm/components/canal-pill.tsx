import { memo } from 'react'
import { CANAL_META } from '../constants'
import type { Canal } from '../types'

const CanalPill = memo(function CanalPill({ canal }: { canal: Canal }) {
  const m = CANAL_META[canal]
  return (
    <span
      style={{
        background: m.bg,
        color: m.color,
        borderRadius: 9999,
        padding: '1px 6px',
        fontSize: 10,
        fontWeight: 600,
      }}
    >
      {m.label}
    </span>
  )
})

export { CanalPill }