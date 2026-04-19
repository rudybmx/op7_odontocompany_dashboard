'use client'

import { useState } from 'react'
import { TriangleAlert, TrendingUp, Info, ChevronDown } from 'lucide-react'
import type { InsightGoogle, SeveridadeInsight } from '@/types/google-ads'

interface Props {
  insights: InsightGoogle[]
}

const CONFIG: Record<SeveridadeInsight, {
  cor: string
  bgIcone: string
  corIcone: string
  label: string
  labelColor: string
  Icone: React.ElementType
}> = {
  alerta: { 
    cor: '#FF5C8D', 
    bgIcone: 'rgba(255,92,141,0.12)', 
    corIcone: '#FF5C8D', 
    label: 'ALERTA', 
    labelColor: '#c2004f', 
    Icone: TriangleAlert 
  },
  oportunidade: { 
    cor: '#0fa856', 
    bgIcone: 'rgba(15,168,86,0.12)', 
    corIcone: '#0fa856', 
    label: 'OPORTUNIDADE', 
    labelColor: '#007a40', 
    Icone: TrendingUp 
  },
  info: { 
    cor: '#3E5BFF', 
    bgIcone: 'rgba(62,91,255,0.12)', 
    corIcone: '#3E5BFF', 
    label: 'INFO', 
    labelColor: '#2340c4', 
    Icone: Info 
  },
}

const LIMITE_PADRAO = 2

export function InsightsGoogle({ insights }: Props) {
  const [expandido, setExpandido] = useState(false)
  const [aberto, setAberto] = useState<string | null>(null)

  if (insights.length === 0) return null

  const visiveis = expandido ? insights : insights.slice(0, LIMITE_PADRAO)
  const temMais = insights.length > LIMITE_PADRAO

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
      marginBottom: 24,
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)' }} />

      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ws-text-1)' }}>Insights IA</span>
          <span style={{
            fontSize: 9, fontWeight: 600,
            background: 'var(--ws-purple-soft)',
            border: '1px solid rgba(122,90,248,0.20)',
            borderRadius: 9999, padding: '2px 8px',
            color: 'var(--ws-purple)',
          }}>{insights.length} insights</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {visiveis.map(insight => {
          const cfg = CONFIG[insight.severidade]
          const { Icone } = cfg
          const estaAberto = aberto === insight.id
          return (
            <div
              key={insight.id}
              onClick={() => setAberto(estaAberto ? null : insight.id)}
              style={{
                borderLeft: `3px solid ${cfg.cor}`,
                background: 'var(--ws-glass-bg)',
                border: '1px solid var(--ws-glass-border)',
                borderLeftColor: cfg.cor,
                borderRadius: 'var(--ws-radius-md)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                boxShadow: 'var(--ws-glass-shadow-sm)',
                padding: '12px 14px',
                display: 'flex', gap: 12, alignItems: 'flex-start',
                cursor: 'pointer',
                transition: 'var(--ws-transition)',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--ws-glass-bg-hover)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--ws-glass-bg)')}
            >
              <div style={{
                width: 28, height: 28, borderRadius: 6,
                background: cfg.bgIcone,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginTop: 1,
              }}>
                <Icone size={14} color={cfg.cor} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.08em', color: cfg.labelColor, marginBottom: 4 }}>{cfg.label}</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--ws-text-1)', marginBottom: 4 }}>
                  {insight.titulo}
                </div>
                <div style={{ fontSize: 11, color: 'var(--ws-text-2)', lineHeight: 1.5 }}>
                  {estaAberto ? insight.analiseCompleta : insight.mensagem}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {temMais && (
        <button
          type="button"
          onClick={() => setExpandido(e => !e)}
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
        >
          <ChevronDown size={13} style={{ transform: expandido ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }} />
          {expandido ? 'Recolher' : `Ver mais ${insights.length - LIMITE_PADRAO} insights`}
        </button>
      )}
    </div>
  )
}
