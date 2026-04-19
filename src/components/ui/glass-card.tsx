import React from 'react'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
  hover?: boolean
}

export function GlassCard({ children, className, style, onClick, hover }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        background: 'var(--ws-glass-bg)',
        border: '1px solid var(--ws-glass-border)',
        borderRadius: 'var(--ws-radius-lg)',
        backdropFilter: 'blur(16px)',
        boxShadow: 'var(--ws-glass-shadow)',
        position: 'relative',
        overflow: 'hidden',
        transition: hover ? 'var(--ws-transition)' : undefined,
        cursor: onClick ? 'pointer' : undefined,
        ...style,
      }}
      onMouseEnter={hover && onClick ? (e) => {
        e.currentTarget.style.background = 'var(--ws-glass-bg-hover)'
        e.currentTarget.style.boxShadow = 'var(--ws-glass-shadow-lg)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      } : undefined}
      onMouseLeave={hover && onClick ? (e) => {
        e.currentTarget.style.background = 'var(--ws-glass-bg)'
        e.currentTarget.style.boxShadow = 'var(--ws-glass-shadow)'
        e.currentTarget.style.transform = 'translateY(0)'
      } : undefined}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />
      {children}
    </div>
  )
}
