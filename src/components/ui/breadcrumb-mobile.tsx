'use client'

import React from 'react'

interface Props {
  plataforma: string           // ex: "Google Ads"
  paginaAtual: string          // ex: "Visão Geral"
  iconeSvgPath: string         // o path SVG do simple-icons ou lucide
  iconeCor: string             // cor hex da marca
}

export function BreadcrumbMobile({ plataforma, paginaAtual, iconeSvgPath, iconeCor }: Props) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '6px 12px',
      marginBottom: 12,
      background: 'rgba(255,255,255,0.72)',
      border: '1px solid rgba(255,255,255,0.40)',
      borderRadius: 999,
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      boxShadow: '0 2px 8px rgba(14,20,42,0.08)',
      width: 'fit-content',
    }}>
      {/* Ícone da plataforma via SVG inline */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill={iconeCor}
        style={{ flexShrink: 0 }}
      >
        <path d={iconeSvgPath} />
      </svg>

      {/* Plataforma */}
      <span style={{
        fontSize: 12,
        fontWeight: 500,
        color: '#0E142A',
      }}>
        {plataforma}
      </span>

      {/* Separador */}
      <span style={{ fontSize: 12, color: 'rgba(14,20,42,0.30)' }}>›</span>

      {/* Página atual */}
      <span style={{
        fontSize: 12,
        fontWeight: 600,
        color: iconeCor,
      }}>
        {paginaAtual}
      </span>
    </div>
  )
}
