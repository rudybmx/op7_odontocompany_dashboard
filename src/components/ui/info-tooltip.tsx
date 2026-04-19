'use client'

import { useEffect, useState } from 'react'

interface InfoTooltipProps {
  title: string
  description: string
  diagram?: string
}

export function InfoTooltip({ title, description, diagram }: InfoTooltipProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const updateTheme = () => setIsDark(media.matches)

    updateTheme()
    media.addEventListener('change', updateTheme)

    return () => media.removeEventListener('change', updateTheme)
  }, [])

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        overflow: 'visible',
        flexShrink: 0
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        type="button"
        aria-label={`Informações sobre ${title}`}
        style={{
          width: 16,
          height: 16,
          border: '0.5px solid rgba(15,39,68,0.20)',
          background: 'transparent',
          color: 'var(--muted-foreground)',
          fontSize: 9,
          fontWeight: 600,
          cursor: 'default',
          borderRadius: '50%',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          lineHeight: 1,
        }}
      >
        i
      </button>

      <div
        style={{
          position: 'absolute',
          zIndex: 50,
          top: 'calc(100% + 6px)',
          right: 0,
          background: isDark ? '#141c38' : '#ffffff',
          border: isDark
            ? '1px solid rgba(255,255,255,0.12)'
            : '1px solid rgba(14,20,42,0.12)',
          borderRadius: 10,
          padding: '12px 14px',
          minWidth: 220,
          maxWidth: 280,
          boxShadow: isDark
            ? '0 8px 32px rgba(0,0,0,0.40), 0 2px 8px rgba(0,0,0,0.30)'
            : '0 8px 32px rgba(14,20,42,0.14), 0 2px 8px rgba(14,20,42,0.08)',
          backdropFilter: 'none',
          opacity: isHovered ? 1 : 0,
          visibility: isHovered ? 'visible' : 'hidden',
          transition: 'opacity 200ms ease, visibility 200ms ease',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: isDark ? '#ffffff' : '#0E142A',
            marginBottom: 4
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 11,
            color: isDark ? 'rgba(255,255,255,0.65)' : '#4a5580',
            lineHeight: 1.5,
            marginBottom: 0
          }}
        >
          {description}
        </div>
        {diagram && (
          <div
            style={{
              marginTop: 10,
              paddingTop: 10,
              borderTop: isDark
                ? '1px solid rgba(255,255,255,0.08)'
                : '1px solid rgba(14,20,42,0.08)',
              filter: isDark ? 'invert(0.85) hue-rotate(180deg)' : 'none'
            }}
            dangerouslySetInnerHTML={{ __html: diagram }}
          />
        )}
      </div>
    </div>
  )
}
