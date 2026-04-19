import { memo } from 'react'
import type { PainelRow } from '../types'

type InfoRowProps = Pick<PainelRow, 'label' | 'valor' | 'valorColor'>

export const InfoRow = memo(function InfoRow({ label, valor, valorColor }: InfoRowProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
      <span style={{ fontSize: 11, color: 'var(--ws-text-3)', minWidth: 80 }}>{label}</span>
      <span style={{ fontSize: 11, fontWeight: 500, color: valorColor ?? 'var(--ws-text-1)' }}>{valor}</span>
    </div>
  )
})