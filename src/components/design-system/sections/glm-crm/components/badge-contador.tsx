import { memo } from 'react'

export const BadgeContador = memo(function BadgeContador({ count }: { count: number }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        background: 'rgba(255,92,141,0.15)',
        border: '1px solid rgba(255,92,141,0.25)',
        color: '#ff5c8d',
        borderRadius: 9999,
        padding: '1px 5px',
        fontSize: 9,
        fontWeight: 700,
        minWidth: 16,
        lineHeight: 1.4,
      }}
    >
      {count}
    </span>
  )
})