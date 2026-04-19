import { memo, useState } from 'react'
import { ArrowRightLeft, X, CheckCheck } from 'lucide-react'

type AcaoBtnProps = {
  label: string
  variant: 'ghost' | 'danger' | 'primary'
  icon?: React.ReactNode
}

const baseStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  height: 28,
  padding: '0 10px',
  borderRadius: 'var(--ws-radius-md)',
  fontSize: 11,
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'var(--ws-transition)',
}

const variantStyles: Record<string, React.CSSProperties> = {
  primary: {
    background: 'linear-gradient(135deg, #3E5BFF, #7A5AF8)',
    color: 'white',
    border: 'none',
    boxShadow: '0 4px 16px rgba(62,91,255,0.35)',
  },
  danger: {
    background: 'rgba(255,92,141,0.12)',
    border: '1px solid rgba(255,92,141,0.25)',
    color: '#c2004f',
  },
  ghost: {
    background: 'transparent',
    border: '1px solid var(--ws-divider)',
    color: 'var(--ws-text-2)',
  },
}

const hoverStyles: Record<string, React.CSSProperties> = {
  primary: {
    boxShadow: '0 6px 24px rgba(62,91,255,0.5)',
    filter: 'brightness(1.1)',
  },
  danger: {
    background: 'rgba(255,92,141,0.22)',
  },
  ghost: {
    background: 'rgba(15,39,68,0.06)',
    borderColor: 'var(--ws-text-3)',
  },
}

export const AcaoBtn = memo(function AcaoBtn({ label, variant, icon }: AcaoBtnProps) {
  const [hovered, setHovered] = useState(false)

  const style: React.CSSProperties = {
    ...baseStyle,
    ...variantStyles[variant],
    ...(hovered ? hoverStyles[variant] : {}),
  }

  return (
    <button
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {icon}
      {label}
    </button>
  )
})