'use client'

import { useState } from 'react'
import { AlertTriangle, TrendingUp, Info, ChevronRight, RefreshCw, ChevronDown } from 'lucide-react'
import { InsightCriativo, SeveridadeInsight } from '@/types/meta-ads-criativos'

interface Props {
  insights: InsightCriativo[]
  onAbrirDetalhe: (criativoId: string) => void
}

const CONFIG: Record<SeveridadeInsight, {
  cor: string
  bgIcone: string
  corIcone: string
  label: string
  Icone: React.ElementType
}> = {
  alerta: { cor: '#a32d2d', bgIcone: '#fcebeb', corIcone: '#a32d2d', label: 'ALERTA', Icone: AlertTriangle },
  oportunidade: { cor: '#3b6d11', bgIcone: '#eaf3de', corIcone: '#3b6d11', label: 'OPORTUNIDADE', Icone: TrendingUp },
  info: { cor: '#854f0b', bgIcone: '#faeeda', corIcone: '#854f0b', label: 'INFO', Icone: Info },
}

const LIMITE_PADRAO = 2

export function InsightsCriativos({ insights, onAbrirDetalhe }: Props) {
  const [expandido, setExpandido] = useState(false)

  if (insights.length === 0) return null

  const visiveis = expandido ? insights : insights.slice(0, LIMITE_PADRAO)
  const temMais = insights.length > LIMITE_PADRAO

  const agora = new Date()
  const hhmm = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  return (
    <div style={{ marginBottom: 20 }}>
      {/* WRAPPER GLASS EXTERNO */}
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
        {/* LINHA BRILHO TOPO */}
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
              borderRadius: 9999, padding: '2px 8px',
              color: 'var(--ws-purple)',
            }}>{insights.length} insights</span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 10, color: 'var(--ws-text-3)',
          }}>
            <RefreshCw size={10} />
            Atualizado às {hhmm}
          </div>
        </div>

        {/* LISTA DE CARDS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {visiveis.map(insight => {
            const cfg = CONFIG[insight.severidade] ?? CONFIG.info
            const { Icone } = cfg
            return (
              <div
                key={insight.id}
                onClick={() => onAbrirDetalhe(insight.criativoId)}
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
                  <div style={{
                    fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.08em', color: cfg.cor, marginBottom: 4,
                  }}>{cfg.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--ws-text-2)', lineHeight: 1.5, marginBottom: 6 }}>
                    {insight.mensagem}
                  </div>
                  <button type="button" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 3,
                    fontSize: 10, fontWeight: 700, color: cfg.cor,
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  }}>
                    {insight.labelAcao} <ChevronRight size={10} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* BOTÃO VER MAIS */}
        {temMais && (
          <button
            type="button"
            onClick={() => setExpandido(v => !v)}
            style={{
              marginTop: 12, width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              padding: '8px', borderRadius: 'var(--ws-radius-md)',
              background: 'var(--ws-glass-bg)',
              border: '1px solid var(--ws-glass-border)',
              cursor: 'pointer', fontSize: 11, fontWeight: 500,
              color: 'var(--ws-blue)',
              transition: 'var(--ws-transition)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--ws-glass-bg-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--ws-glass-bg)')}
          >
            <ChevronDown size={13} />
            {expandido ? 'Recolher' : `Ver mais ${insights.length - LIMITE_PADRAO} insights`}
          </button>
        )}
      </div>
    </div>
  )
}
