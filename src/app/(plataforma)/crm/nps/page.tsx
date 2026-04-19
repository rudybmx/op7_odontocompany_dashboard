'use client'

import React, { useState } from 'react'
import { tabAtiva, tabInativa } from '@/lib/utils'
import { useNpsCompleto, NpsFiltros, NpsPeriodo, NpsFiltroCategoria } from '@/hooks/use-nps-completo'
import { NpsDashboard } from '@/components/nps/nps-dashboard'
import { NpsListaRespostas } from '@/components/nps/nps-lista-respostas'
import { NpsConfig as NpsConfigComponent } from '@/components/nps/nps-config'
import { NpsAlertaDetrator } from '@/components/nps/nps-alerta-detrator'
import { MOCK_AGENDAS } from '@/lib/mock-agenda'
import { BarChart2, Settings, Search, ChevronDown, Star, Smile, Frown, Meh } from 'lucide-react'

// ─── Tabs ─────────────────────────────────────────────────────────────────────
type TabId = 'visao-geral' | 'configuracao'

const PAGE_TABS = [
  { id: 'visao-geral', label: 'Visão Geral', icon: BarChart2 },
  { id: 'configuracao', label: 'Configuração', icon: Settings },
] as const

const CATEGORIA_TABS: { id: NpsFiltroCategoria; label: string; emoji: string }[] = [
  { id: 'todos',    label: 'Todas',       emoji: '📊' },
  { id: 'promotor', label: 'Promotores',  emoji: '😊' },
  { id: 'neutro',   label: 'Neutros',     emoji: '😐' },
  { id: 'detrator', label: 'Detratores',  emoji: '😞' },
]

const PERIODOS: { id: NpsPeriodo; label: string }[] = [
  { id: '7d',  label: 'Últimos 7 dias' },
  { id: '30d', label: 'Últimos 30 dias' },
  { id: '60d', label: 'Últimos 60 dias' },
  { id: '90d', label: 'Últimos 90 dias' },
]

// ─── Página ───────────────────────────────────────────────────────────────────
export default function NpsPage() {
  const {
    respostas, metrics, evolucao, distribuicao,
    detratoresSemAcao, configs, filtros, setFiltros,
    loading, registrarAcao, atualizarConfig,
  } = useNpsCompleto()

  const [pageTab, setPageTab] = useState<TabId>('visao-geral')
  const [categoriaTab, setCategoriaTab] = useState<NpsFiltroCategoria>('todos')

  // Quando muda a tab de categoria, atualiza filtros
  function handleCategoriaTab(cat: NpsFiltroCategoria) {
    setCategoriaTab(cat)
    setFiltros(prev => ({ ...prev, categoria: cat }))
  }

  // Ir para detratores
  function irParaDetratores() {
    handleCategoriaTab('detrator')
    setPageTab('visao-geral')
    setTimeout(() => {
      document.getElementById('nps-lista')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const scorePrefix = metrics.score_geral > 0 ? '+' : ''

  return (
    <div style={{ background: 'var(--ws-page-bg)', minHeight: '100%', padding: '24px' }}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ─── Header ─────────────────────────────────────────────────────────── */}
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 600, color: 'var(--ws-text-1)' }}>
                NPS — Satisfação dos Clientes
              </h1>
              <p style={{ fontSize: 13, color: 'var(--ws-text-2)', marginTop: 4 }}>
                Monitore a qualidade dos atendimentos em tempo real
              </p>
            </div>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'var(--ws-glass-bg)',
            border: '1px solid var(--ws-glass-border)',
            borderRadius: 'var(--ws-radius-lg)',
            backdropFilter: 'blur(16px)',
            boxShadow: 'var(--ws-glass-shadow)',
            padding: '12px 20px',
            position: 'relative',
          }}>
            <div style={{ position:'absolute',top:0,left:0,right:0,height:1, background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.8),transparent)', pointerEvents:'none' }} />
            <span style={{ fontSize: 12, color: 'var(--ws-text-3)', fontWeight: 600 }}>Score Atual</span>
            <span style={{
              fontSize: 24, fontWeight: 800,
              color: metrics.score_geral >= 75 ? 'var(--ws-green)'
                : metrics.score_geral >= 50 ? '#2d9e6b'
                : metrics.score_geral >= 0  ? 'var(--ws-gold)'
                : 'var(--ws-coral)'
            }}>
              {scorePrefix}{metrics.score_geral}
            </span>
            <span style={{ fontSize: 11, color: 'var(--ws-text-3)' }}>
              {metrics.evolucao_30d > 0 ? '↑' : metrics.evolucao_30d < 0 ? '↓' : '→'}
              {metrics.evolucao_30d > 0 ? '+' : ''}{metrics.evolucao_30d} pts/mês
            </span>
          </div>
        </div>

        {/* ─── Tabs de página ──────────────────────────────────────────────────── */}
        <div className="flex items-center gap-8 border-b" style={{ borderColor: 'var(--ws-divider)' }}>
          {PAGE_TABS.map(tab => {
            const isActive = pageTab === tab.id
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setPageTab(tab.id as TabId)}
                style={{
                  ...(isActive ? tabAtiva : tabInativa),
                  display: 'flex', alignItems: 'center', gap: 8,
                  paddingBottom: 16, paddingInline: 4,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                }}
              >
                <Icon size={16} style={{ color: isActive ? 'var(--ws-gold)' : 'var(--ws-text-3)' }} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* ─── Aba: Visão Geral ─────────────────────────────────────────────────── */}
        {pageTab === 'visao-geral' && (
          <div className="space-y-6">

            {/* Filtros */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Período */}
              <div style={{ position: 'relative' }}>
                <select
                  value={filtros.periodo}
                  onChange={e => setFiltros(prev => ({ ...prev, periodo: e.target.value as NpsPeriodo }))}
                  style={{
                    background: 'var(--ws-glass-bg)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid var(--ws-glass-border)',
                    borderRadius: 8, padding: '8px 32px 8px 12px',
                    color: 'var(--ws-text-1)', fontSize: 13, fontWeight: 600,
                    outline: 'none', cursor: 'pointer', appearance: 'none',
                  }}
                >
                  {PERIODOS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
                <ChevronDown size={12} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ws-text-3)', pointerEvents: 'none' }} />
              </div>

              {/* Agenda */}
              <div style={{ position: 'relative' }}>
                <select
                  value={filtros.agenda_id ?? ''}
                  onChange={e => setFiltros(prev => ({ ...prev, agenda_id: e.target.value || null }))}
                  style={{
                    background: 'var(--ws-glass-bg)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid var(--ws-glass-border)',
                    borderRadius: 8, padding: '8px 32px 8px 12px',
                    color: 'var(--ws-text-1)', fontSize: 13, fontWeight: 600,
                    outline: 'none', cursor: 'pointer', appearance: 'none',
                  }}
                >
                  <option value="">Todas as agendas</option>
                  {MOCK_AGENDAS.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
                </select>
                <ChevronDown size={12} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ws-text-3)', pointerEvents: 'none' }} />
              </div>

              {/* Busca */}
              <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--ws-text-3)', pointerEvents: 'none' }} />
                <input
                  type="text"
                  value={filtros.busca}
                  onChange={e => setFiltros(prev => ({ ...prev, busca: e.target.value }))}
                  placeholder="Buscar cliente ou feedback..."
                  style={{
                    width: '100%',
                    paddingLeft: 36, paddingRight: 12, paddingBlock: 8,
                    background: 'var(--ws-glass-bg)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid var(--ws-glass-border)',
                    borderRadius: 8, color: 'var(--ws-text-1)',
                    fontSize: 13, outline: 'none',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'var(--ws-blue)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--ws-glass-border)')}
                />
              </div>
            </div>

            {/* Dashboard (KPIs + Gráficos) */}
            <NpsDashboard
              metrics={metrics}
              evolucao={evolucao}
              distribuicao={distribuicao}
              onVerDetratores={irParaDetratores}
            />

            {/* Banner de alertas de detratores */}
            <NpsAlertaDetrator
              detratores={detratoresSemAcao}
              onVerDetratores={irParaDetratores}
            />

            {/* Tabs de categoria */}
            <div id="nps-lista">
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'wrap', marginBottom: 16, borderBottom: '1px solid var(--ws-divider)' }}>
                {[
                  { id: 'todos' as const, emoji: '📊', label: 'Todas', count: respostas.length },
                  { id: 'promotor' as const, emoji: '😊', label: 'Promotores', count: respostas.filter(r => r.categoria === 'promotor').length },
                  { id: 'neutro' as const, emoji: '😐', label: 'Neutros', count: respostas.filter(r => r.categoria === 'neutro').length },
                  { id: 'detrator' as const, emoji: '😞', label: 'Detratores', count: respostas.filter(r => r.categoria === 'detrator').length },
                ].map(tab => {
                  const isActive = categoriaTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleCategoriaTab(tab.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '10px 20px',
                        background: isActive ? 'rgba(201,168,76,0.10)' : 'transparent',
                        border: 'none',
                        borderBottom: isActive
                          ? '2px solid var(--ws-gold)'
                          : '2px solid transparent',
                        color: isActive ? 'var(--ws-gold)' : 'var(--ws-text-2)',
                        fontWeight: isActive ? 600 : 400,
                        fontSize: 13,
                        cursor: 'pointer',
                        transition: 'all 0.18s ease',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <span>{tab.emoji}</span>
                      {tab.label}
                      <span style={{
                        fontSize: 11, fontWeight: 700,
                        background: isActive ? 'rgba(201,168,76,0.2)' : 'rgba(14,20,42,0.08)',
                        borderRadius: 9999, padding: '1px 7px',
                      }}>
                        {tab.count}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Tabela de respostas */}
              <NpsListaRespostas
                respostas={respostas}
                loading={loading}
                onRegistrarAcao={registrarAcao}
              />
            </div>
          </div>
        )}

        {/* ─── Aba: Configuração ────────────────────────────────────────────────── */}
        {pageTab === 'configuracao' && (
          <NpsConfigComponent configs={configs} onAtualizar={atualizarConfig} />
        )}

      </div>
    </div>
  )
}
