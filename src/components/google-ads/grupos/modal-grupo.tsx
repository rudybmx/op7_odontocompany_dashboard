'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import type { GrupoAnunciosDetalhe } from '@/types/google-ads'
import { BadgeTipoCampanha } from '../campanhas/badge-tipo-campanha'
import { BadgeStatusGoogle } from '../campanhas/badge-status-google'
import { BadgeEstrategia } from './badge-estrategia'
import { BadgeAdStrength } from './badge-ad-strength'
import { BadgeLearning } from './badge-learning'

interface Props {
  grupo: GrupoAnunciosDetalhe | null
  aberto: boolean
  onFechar: () => void
}

function corCtr(v: number) { return v >= 5 ? '#3b6d11' : v >= 2 ? '#854f0b' : '#a32d2d' }
function corCpc(v: number) { return v <= 1 ? '#3b6d11' : v <= 3 ? '#854f0b' : '#a32d2d' }
function corRoas(v: number) { return v > 30 ? '#3b6d11' : v >= 10 ? '#854f0b' : '#a32d2d' }
function corTaxaConv(v: number) { return v >= 4 ? '#3b6d11' : v >= 2 ? '#854f0b' : '#a32d2d' }
function corCustoConv(v: number) { return v <= 20 ? '#3b6d11' : v <= 50 ? '#854f0b' : '#a32d2d' }
function corQs(v: number) { return v >= 7 ? '#3b6d11' : v >= 4 ? '#854f0b' : '#a32d2d' }

function fmtMoeda(v: number) {
  return `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function gerarAnaliseGrupo(g: GrupoAnunciosDetalhe): string {
  const partes: string[] = []
  if (g.emAprendizado) partes.push(`Em fase de aprendizado (~${g.diasAprendizado} dias restantes). Evitar alterações.`)
  if (g.qualityScoreMedio > 0) {
    if (g.qualityScoreMedio >= 7)
      partes.push(`QS ${g.qualityScoreMedio.toFixed(1)} — boa relevância entre keywords, anúncios e landing page.`)
    else
      partes.push(`QS ${g.qualityScoreMedio.toFixed(1)} — há espaço para melhorar relevância dos anúncios e landing page.`)
  }
  if (g.targetCpaMicros) {
    const target = g.targetCpaMicros / 1_000_000
    const diff = ((g.custoConversao / target - 1) * 100).toFixed(0)
    partes.push(`Target CPA R$${target.toFixed(2).replace('.', ',')} — realizando R$${g.custoConversao.toFixed(2).replace('.', ',')} (${+diff > 0 ? '+' : ''}${diff}% do target).`)
  }
  if (g.roas > 30) partes.push(`ROAS ${g.roas.toFixed(1)}× excelente para a vertical.`)
  return partes.join(' ') || 'Grupo com performance estável no período analisado.'
}

interface KpiItem {
  label: string
  valor: string
  cor?: string
}

function KpiCard({ label, valor, cor }: KpiItem) {
  return (
    <div style={{
      background: 'var(--ws-glass-bg)',
      border: '1px solid var(--ws-glass-border)',
      borderRadius: 'var(--ws-radius-md)',
      padding: '10px 12px',
    }}>
      <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ws-text-3)', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 16, fontWeight: 500, color: cor }}>
        {valor}
      </div>
    </div>
  )
}

export function ModalGrupo({ grupo, aberto, onFechar }: Props) {
  useEffect(() => {
    if (!aberto) return
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onFechar() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [aberto, onFechar])

  if (!aberto || !grupo) return null

  const isSearch = grupo.tipoCampanha === 'SEARCH'
  const isPmax = grupo.tipoCampanha === 'PERFORMANCE_MAX'

  const kpis: KpiItem[] = [
    { label: 'Investimento', valor: fmtMoeda(grupo.investimento) },
    { label: 'Cliques', valor: grupo.cliques.toLocaleString('pt-BR'), cor: 'var(--ws-gold)' },
    { label: 'Conversões', valor: grupo.conversoes.toLocaleString('pt-BR'), cor: 'var(--ws-gold)' },
    { label: 'CTR', valor: `${grupo.ctr.toFixed(1).replace('.', ',')}%`, cor: corCtr(grupo.ctr) },
    { label: 'CPC médio', valor: fmtMoeda(grupo.cpcMedio), cor: corCpc(grupo.cpcMedio) },
    { label: 'ROAS', valor: `${grupo.roas.toFixed(1).replace('.', ',')}×`, cor: corRoas(grupo.roas) },
    { label: 'Taxa Conv.', valor: `${grupo.taxaConversao.toFixed(1).replace('.', ',')}%`, cor: corTaxaConv(grupo.taxaConversao) },
    { label: 'Custo/Conv.', valor: fmtMoeda(grupo.custoConversao), cor: corCustoConv(grupo.custoConversao) },
    isSearch && grupo.qualityScoreMedio > 0
      ? { label: 'Quality Score', valor: `${grupo.qualityScoreMedio.toFixed(1)}/10`, cor: corQs(grupo.qualityScoreMedio) }
      : isPmax && grupo.adStrength
        ? { label: 'Ad Strength', valor: grupo.adStrength }
        : { label: 'Impressões', valor: grupo.impressoes.toLocaleString('pt-BR'), cor: 'var(--ws-text-2)' },
  ]

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
      onClick={e => { if (e.target === e.currentTarget) onFechar() }}
    >
      <div style={{
        background: 'var(--ws-glass-bg)',
        border: '1px solid var(--ws-glass-border)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: 'var(--ws-glass-shadow-lg)',
        borderRadius: 'var(--ws-radius-xl)',
        maxWidth: 720,
        width: '95vw',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)' }} />

        {/* Header */}
        <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid var(--ws-divider)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--ws-text-1)' }}>{grupo.nome}</span>
                {grupo.emAprendizado && <BadgeLearning diasAprendizado={grupo.diasAprendizado} />}
                {grupo.adStrength && <BadgeAdStrength strength={grupo.adStrength} />}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <BadgeTipoCampanha tipo={grupo.tipoCampanha} />
                <span style={{ fontSize: 11, color: 'var(--ws-text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 320 }}>
                  {grupo.campanhaNome}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                <BadgeEstrategia estrategia={grupo.estrategiaLance} />
                <BadgeStatusGoogle status={grupo.status} />
                {grupo.targetCpaMicros && (
                  <span style={{ fontSize: 10, color: 'var(--ws-text-2)' }}>
                    Target CPA: R${(grupo.targetCpaMicros / 1_000_000).toFixed(2).replace('.', ',')}
                  </span>
                )}
                {grupo.targetRoas && (
                  <span style={{ fontSize: 10, color: 'var(--ws-text-2)' }}>
                    Target ROAS: {(grupo.targetRoas / 100).toFixed(0)}%
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onFechar}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ws-text-2)', padding: 4, flexShrink: 0 }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '18px 20px' }}>
          {/* Seção 1: KPI grid */}
          <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--ws-text-2)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Performance
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 18 }}>
            {kpis.map(k => <KpiCard key={k.label} {...k} />)}
          </div>

          {/* Seção 2: Métricas exclusivas */}
          <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--ws-text-2)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Detalhes do grupo
          </div>
          <div style={{ border: '1px solid var(--ws-glass-border)', borderRadius: 'var(--ws-radius-md)', overflow: 'hidden', marginBottom: 18 }}>
            {isSearch && grupo.impressionShare !== null && (
              <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--ws-divider)' }}>
                <div style={{ fontSize: 10, color: 'var(--ws-text-2)', marginBottom: 6 }}>Impression Share</div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: 'var(--ws-blue)', fontWeight: 500 }}>
                    ■ Capturado {(grupo.impressionShare * 100).toFixed(0)}%
                  </span>
                  <span style={{ fontSize: 11, color: '#ef9f27', fontWeight: 500 }}>
                    ■ Budget {((grupo.isPerdidoBudget ?? 0) * 100).toFixed(0)}%
                  </span>
                  <span style={{ fontSize: 11, color: '#a32d2d', fontWeight: 500 }}>
                    ■ Rank {((grupo.isPerdidoRank ?? 0) * 100).toFixed(0)}%
                  </span>
                </div>
                <div style={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', background: 'rgba(14,20,42,0.08)' }}>
                  <div style={{ width: `${grupo.impressionShare * 100}%`, background: '#3E5BFF' }} />
                  <div style={{ width: `${(grupo.isPerdidoBudget ?? 0) * 100}%`, background: '#ef9f27' }} />
                  <div style={{ width: `${(grupo.isPerdidoRank ?? 0) * 100}%`, background: '#a32d2d' }} />
                </div>
              </div>
            )}
            {isSearch && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '10px 14px', gap: 8 }}>
                <div>
                  <span style={{ fontSize: 10, color: 'var(--ws-text-2)' }}>Keywords ativas</span>
                  <div style={{ fontSize: 13, fontWeight: 500, marginTop: 2, color: 'var(--ws-text-1)' }}>
                    {grupo.keywordsAtivas} ativas / {grupo.keywordsTotal} total
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: 10, color: 'var(--ws-text-2)' }}>Anúncios ativos</span>
                  <div style={{ fontSize: 13, fontWeight: 500, marginTop: 2, color: 'var(--ws-text-1)' }}>{grupo.anunciosAtivos}</div>
                </div>
              </div>
            )}
            {isPmax && grupo.adStrength && (
              <div style={{ padding: '10px 14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div>
                    <span style={{ fontSize: 10, color: 'var(--ws-text-2)' }}>Ad Strength</span>
                    <div style={{ marginTop: 4 }}><BadgeAdStrength strength={grupo.adStrength} /></div>
                  </div>
                  <div>
                    <span style={{ fontSize: 10, color: 'var(--ws-text-2)' }}>Anúncios ativos</span>
                    <div style={{ fontSize: 13, fontWeight: 500, marginTop: 2, color: 'var(--ws-text-1)' }}>{grupo.anunciosAtivos} asset{grupo.anunciosAtivos !== 1 ? 's' : ''} configurado{grupo.anunciosAtivos !== 1 ? 's' : ''}</div>
                  </div>
                </div>
              </div>
            )}
            {!isSearch && !isPmax && (
              <div style={{ padding: '10px 14px' }}>
                <span style={{ fontSize: 10, color: 'var(--ws-text-2)' }}>Anúncios ativos</span>
                <div style={{ fontSize: 13, fontWeight: 500, marginTop: 2, color: 'var(--ws-text-1)' }}>{grupo.anunciosAtivos}</div>
              </div>
            )}
          </div>

          {/* Seção 3: Análise IA */}
          <div style={{ background: 'var(--ws-blue-soft)', border: '1px solid rgba(62,91,255,0.15)', borderRadius: 'var(--ws-radius-md)', borderLeft: '3px solid var(--ws-blue)', padding: '14px 16px' }}>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ws-blue)', marginBottom: 8 }}>
              Análise IA
            </div>
            <p style={{ fontSize: 12, lineHeight: 1.7, color: 'var(--ws-text-1)', margin: 0 }}>
              {gerarAnaliseGrupo(grupo)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
