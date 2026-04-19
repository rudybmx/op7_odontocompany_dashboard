import { memo } from 'react'
import { ETIQUETA_STYLES } from '../constants'
import type { EtiquetaVariant } from '../types'

const EtiquetaPill = memo(function EtiquetaPill({ et }: { et: { label: string; variant: EtiquetaVariant } }) {
  const s = ETIQUETA_STYLES[et.variant]
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        borderRadius: 9999,
        padding: '1px 6px',
        fontSize: 10,
        fontWeight: 500,
        whiteSpace: 'nowrap',
      }}
    >
      {et.label}
    </span>
  )
})

export { EtiquetaPill }