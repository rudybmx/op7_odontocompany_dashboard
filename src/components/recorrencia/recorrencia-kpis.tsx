'use client'

import React from 'react'
import { Clock, Play, CheckCircle2, RefreshCw } from 'lucide-react'

interface RecorrenciaKpisProps {
  metricas: {
    aguardando: number
    ativos: number
    concluidos: number
    taxaReconversao: number
  }
}

export function RecorrenciaKpis({ metricas }: RecorrenciaKpisProps) {
  const cards = [
    {
      label: 'Aguardando',
      value: metricas.aguardando,
      icon: Clock,
      color: 'var(--gold)',
      bg: 'rgba(201, 168, 76, 0.12)'
    },
    {
      label: 'Ativos',
      value: metricas.ativos,
      icon: Play,
      color: 'var(--ws-green)',
      bg: 'var(--ws-green-soft)'
    },
    {
      label: 'Concluídos',
      value: metricas.concluidos,
      icon: CheckCircle2,
      color: 'var(--ws-blue)',
      bg: 'var(--ws-blue-soft)'
    },
    {
      label: 'Taxa Reconv.',
      value: `${metricas.taxaReconversao.toFixed(1)}%`,
      icon: RefreshCw,
      color: 'var(--ws-purple)',
      bg: 'var(--ws-purple-soft)'
    }
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 12,
      marginBottom: 24,
    }}>
      {cards.map((card, idx) => (
        <div 
          key={idx}
          style={{
            background: 'var(--ws-glass-bg)',
            border: '1px solid var(--ws-glass-border)',
            borderRadius: 'var(--ws-radius-lg)',
            backdropFilter: 'blur(16px)',
            boxShadow: 'var(--ws-glass-shadow)',
            padding: '18px 20px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Linha de brilho OBRIGATÓRIA */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.8),transparent)',
            pointerEvents: 'none',
          }} />

          <div className="flex items-center justify-between mb-2">
            <span style={{ 
              fontSize: '10px', 
              textTransform: 'uppercase', 
              letterSpacing: '0.06em',
              color: 'var(--ws-text-2)',
              fontWeight: 600
            }}>
              {card.label}
            </span>
            <div 
              className="p-1.5 rounded-md"
              style={{ background: card.bg, color: card.color }}
            >
              <card.icon size={14} />
            </div>
          </div>

          <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--ws-text-1)' }}>
            {card.value}
          </div>
        </div>
      ))}
    </div>
  )
}
