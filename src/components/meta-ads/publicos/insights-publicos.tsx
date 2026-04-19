'use client'

import { useState } from 'react'
import { TriangleAlert, TrendingUp, Info, ChevronDown, ChevronUp } from 'lucide-react'
import type { InsightPublico, SeveridadeInsight } from '@/types/meta-ads-publicos'

interface Props {
  insights: InsightPublico[]
  onAbrirSegmento?: (id: string) => void
}

const CONFIG_SEVERIDADE: Record<SeveridadeInsight, {
  cor: string
  icone: React.ComponentType<{ size: number; className?: string; color?: string }>
  bg: string
}> = {
  alerta: { cor: '#a32d2d', icone: TriangleAlert, bg: 'rgba(163,45,45,0.06)' },
  oportunidade: { cor: '#3b6d11', icone: TrendingUp, bg: 'rgba(59,109,17,0.06)' },
  info: { cor: 'var(--ws-gold)', icone: Info, bg: 'rgba(201,168,76,0.06)' },
}

function CardInsight({ insight, onAbrirSegmento }: { insight: InsightPublico; onAbrirSegmento?: (id: string) => void }) {
  const [expandido, setExpandido] = useState(false)
  const cfg = CONFIG_SEVERIDADE[insight.severidade]
  const Icone = cfg.icone

  return (
    <div
      style={{
        background: 'var(--ws-glass-bg)',
        border: '1px solid var(--ws-glass-border)',
        borderLeftColor: cfg.cor,
        borderLeftWidth: 3,
        borderLeftStyle: 'solid',
        borderRadius: 'var(--ws-radius-md)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: 'var(--ws-glass-shadow-sm)',
        padding: '10px 12px',
        cursor: 'pointer',
      }}
      onClick={() => setExpandido(!expandido)}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <span style={{ color: cfg.cor, flexShrink: 0, marginTop: 1, display: 'flex' }}>
          <Icone size={14} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 2, color: 'var(--ws-text-1)' }}>{insight.titulo}</div>
          <div style={{ fontSize: 11, color: 'var(--ws-text-2)', lineHeight: 1.5 }}>{insight.mensagem}</div>
          {expandido && (
            <div style={{ fontSize: 11, color: 'var(--ws-text-2)', marginTop: 8, lineHeight: 1.6, borderTop: '1px solid var(--ws-glass-border)', paddingTop: 8 }}>
              {insight.analiseCompleta}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          {insight.segmentoId && onAbrirSegmento && (
            <button
              style={{ fontSize: 10, color: cfg.cor, fontWeight: 500, border: `1px solid ${cfg.cor}`, borderRadius: 4, padding: '2px 6px', background: 'transparent' }}
              onClick={(e) => { e.stopPropagation(); onAbrirSegmento(insight.segmentoId ?? '') }}
            >
              {insight.labelAcao}
            </button>
          )}
          {expandido ? <ChevronUp size={12} style={{ color: 'var(--ws-text-2)' }} /> : <ChevronDown size={12} style={{ color: 'var(--ws-text-2)' }} />}
        </div>
      </div>
    </div>
  )
}

export function InsightsPublicos({ insights, onAbrirSegmento }: Props) {
  const [expandido, setExpandido] = useState(false)
  const visiveis = expandido ? insights : insights.slice(0, 2)

  return (
    <div style={{
      background: 'var(--ws-glass-bg)',
      border: '1px solid var(--ws-glass-border)',
      borderRadius: 'var(--ws-radius-lg)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      boxShadow: 'var(--ws-glass-shadow)',
      padding: 20,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* LINHA BRILHO */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
      }} />

      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ws-text-1)' }}>Insights IA</span>
          <span style={{
            fontSize: 9, fontWeight: 600,
            background: 'var(--ws-purple-soft)',
            border: '1px solid rgba(122,90,248,0.20)',
            borderRadius: 9999, padding: '2px 8px', color: 'var(--ws-purple)',
          }}>{insights.length} insights</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {visiveis.map((insight) => (
          <CardInsight key={insight.id} insight={insight} onAbrirSegmento={onAbrirSegmento} />
        ))}
      </div>

      {insights.length > 2 && (
        <button
          type="button"
          style={{
            marginTop: 12, width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            padding: '8px', borderRadius: 'var(--ws-radius-md)',
            background: 'var(--ws-glass-bg)', border: '1px solid var(--ws-glass-border)',
            cursor: 'pointer', fontSize: 11, fontWeight: 500, color: 'var(--ws-blue)',
            transition: 'var(--ws-transition)',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--ws-glass-bg-hover)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--ws-glass-bg)')}
          onClick={() => setExpandido(!expandido)}
        >
          {expandido ? '↑ Ver menos' : `↓ Ver mais ${insights.length - 2} insights`}
        </button>
      )}
    </div>
  )
}

