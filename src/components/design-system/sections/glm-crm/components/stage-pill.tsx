import { memo } from 'react'
import { STAGE_STYLES } from '../constants'
import type { StageId } from '../types'

const StagePill = memo(function StagePill({ stage }: { stage: StageId }) {
  const s = STAGE_STYLES[stage]
  return (
    <span
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        color: s.color,
        borderRadius: 9999,
        padding: '2px 8px',
        fontSize: 10,
        fontWeight: 600,
      }}
    >
      {s.label}
    </span>
  )
})

export { StagePill }