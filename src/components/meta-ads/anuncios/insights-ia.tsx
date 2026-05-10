'use client'

import { useState } from 'react'
import { AlertTriangle, TrendingUp, Info, ChevronRight, RefreshCw } from 'lucide-react'
import { InsightIA, SeveridadeInsight } from '@/types/meta-ads-anuncios'

interface Props {
  insights: InsightIA[]
  onAbrirAnuncio: (anuncioId: string) => void
}

const CONFIG: Record<SeveridadeInsight, {
  cor: string
  bgIcone: string
  corIcone: string
  label: string
  Icone: React.ElementType
  labelColor: string
}> = {
  alerta: {
    cor: '#FF5C8D',
    bgIcone: 'rgba(255, 92, 141, 0.12)',
    corIcone: '#FF5C8D',
    label: 'ALERTA',
    Icone: AlertTriangle,
    labelColor: '#c2004f',
  },
  oportunidade: {
    cor: '#0fa856',
    bgIcone: 'rgba(15, 168, 86, 0.12)',
    corIcone: '#0fa856',
    label: 'OPORTUNIDADE',
    Icone: TrendingUp,
    labelColor: '#007a40',
  },
  info: {
    cor: '#3E5BFF',
    bgIcone: 'rgba(62, 91, 255, 0.12)',
    corIcone: '#3E5BFF',
    label: 'INFO',
    Icone: Info,
    labelColor: '#2340c4',
  },
}

const LIMITE_PADRAO = 2

export function InsightsIA({ insights, onAbrirAnuncio }: Props) {
  const [expandido, setExpandido] = useState(false)

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
      marginBottom: 20,
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ws-text-1)' }}>Insights IA</span>
          <div style={{
            fontSize: 9, fontWeight: 600,
            background: 'var(--ws-purple-soft)',
            border: '1px solid rgba(122,90,248,0.20)',
            borderRadius: 9999, padding: '2px 8px',
            color: 'var(--ws-purple)'
          }}>
            {insights.length} insights
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '10px',
          color: 'var(--ws-text-3)',
        }}>
          <RefreshCw size={10} />
          Atualizado agora
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {visiveis.map(insight => {
          const cfg = CONFIG[insight.severidade] ?? CONFIG.info
          const { Icone } = cfg
          return (
            <div
              key={insight.id}
              onClick={() => insight.anuncioId ? onAbrirAnuncio(insight.anuncioId) : undefined}
              onMouseEnter={e => {
                if (insight.anuncioId) e.currentTarget.style.background = 'var(--ws-glass-bg-hover)'
              }}
              onMouseLeave={e => {
                if (insight.anuncioId) e.currentTarget.style.background = 'var(--ws-glass-bg)'
              }}
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
                cursor: insight.anuncioId ? 'pointer' : 'default',
                transition: 'var(--ws-transition)',
              }}
            >
              <div style={{
                width: 28,
                height: 28,
                borderRadius: '6px',
                background: cfg.bgIcone,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icone size={14} style={{ color: cfg.corIcone }} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ 
                  fontSize: '9px', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.06em', 
                  color: cfg.labelColor, 
                  fontWeight: 600, 
                  marginBottom: '2px' 
                }}>
                  {cfg.label}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--ws-text-1)', lineHeight: 1.4, marginBottom: '2px' }}>
                  {insight.mensagem}
                </div>
                {insight.labelAcao && (
                  <div style={{ fontSize: '10px', color: 'var(--ws-text-2)', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 500, marginTop: '4px' }}>
                    {insight.labelAcao}
                    <ChevronRight size={10} />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {temMais && (
        <div
          onClick={() => setExpandido(v => !v)}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--ws-glass-bg-hover)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'var(--ws-glass-bg)'
          }}
          style={{
            marginTop: 12, width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            padding: '8px',
            borderRadius: 'var(--ws-radius-md)',
            background: 'var(--ws-glass-bg)',
            border: '1px solid var(--ws-glass-border)',
            cursor: 'pointer', fontSize: 11, fontWeight: 500,
            color: 'var(--ws-blue)',
            transition: 'var(--ws-transition)',
          }}
        >
          {expandido ? 'Recolher' : `Ver mais ${insights.length - LIMITE_PADRAO} insights`}
        </div>
      )}
    </div>
  )
}
