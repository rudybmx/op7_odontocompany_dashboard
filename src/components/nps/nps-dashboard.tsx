'use client'

import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, ReferenceLine, Area, AreaChart, Cell,
} from 'recharts'
import { NpsMetrics, NpsEvolucaoPonto, NpsDistribuicao, NpsCategoria } from '@/types/nps'
import { TrendingUp, TrendingDown, Minus, Users, Smile, Frown, Star } from 'lucide-react'

// ─── Sub-types ────────────────────────────────────────────────────────────────
interface NpsDashboardProps {
  metrics: NpsMetrics
  evolucao: NpsEvolucaoPonto[]
  distribuicao: NpsDistribuicao[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function npsColor(score: number): string {
  if (score >= 75) return 'var(--ws-green)'
  if (score >= 50) return '#2d9e6b'
  if (score >= 0) return 'var(--ws-gold)'
  return 'var(--ws-coral)'
}

function npsLabel(score: number): string {
  if (score >= 75) return 'Excelente'
  if (score >= 50) return 'Bom'
  if (score >= 0) return 'Neutro'
  return 'Atenção'
}

function barColor(categoria: NpsCategoria): string {
  const MAP: Record<NpsCategoria, string> = {
    promotor: 'var(--ws-green)',
    neutro: 'var(--ws-gold)',
    detrator: 'var(--ws-coral)',
  }
  return MAP[categoria]
}

// ─── Tooltip customizado para evolução ───────────────────────────────────────
const EvolucaoTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload as NpsEvolucaoPonto
  return (
    <div style={{
      background: 'var(--ws-navy)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 10,
      padding: '10px 14px',
      minWidth: 160,
    }}>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginBottom: 6 }}>Semana de {label}</p>
      <p style={{ color: '#ffffff', fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
        NPS: <span style={{ color: npsColor(d.nps) }}>{d.nps > 0 ? '+' : ''}{d.nps}</span>
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, fontSize: 12 }}>
        <span style={{ color: 'var(--ws-green)' }}>😊 {d.promotores} promotores</span>
        <span style={{ color: 'var(--ws-gold)' }}>😐 {d.neutros} neutros</span>
        <span style={{ color: 'var(--ws-coral)' }}>😞 {d.detratores} detratores</span>
        <span style={{ color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{d.total} total</span>
      </div>
    </div>
  )
}

// ─── Tooltip customizado para distribuição ────────────────────────────────────
const DistribuicaoTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  const qtd = payload[0]?.value as number
  return (
    <div style={{
      background: 'var(--ws-navy)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 10,
      padding: '8px 12px',
    }}>
      <p style={{ color: '#ffffff', fontSize: 14, fontWeight: 700 }}>Nota {label}</p>
      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{qtd} resposta{qtd !== 1 ? 's' : ''}</p>
    </div>
  )
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
interface KpiCardProps {
  label: string
  value: string | number
  sub?: string
  icon: React.ReactNode
  iconBg: string
  accent?: string
  badge?: string
  badgeColor?: string
  thermometer?: {
    promotor: number
    neutro: number
    detrator: number
  }
  delta?: number
  onAction?: () => void
  actionLabel?: string
}

function KpiCard({ label, value, sub, icon, iconBg, accent, badge, badgeColor, thermometer, delta, onAction, actionLabel }: KpiCardProps) {
  return (
    <div style={{
      position: 'relative',
      background: 'var(--ws-glass-bg)',
      border: '1px solid var(--ws-glass-border)',
      borderRadius: 'var(--ws-radius-lg)',
      backdropFilter: 'blur(16px)',
      boxShadow: 'var(--ws-glass-shadow)',
      padding: '16px 18px',
      overflow: 'hidden',
      flex: 1,
      minWidth: 0,
    }}>
      {/* Brilho topo */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.8),transparent)', pointerEvents: 'none' }} />

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ws-text-3)' }}>
            {label}
          </span>
          {badge && (
            <span style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.06em',
              background: badgeColor || 'var(--ws-coral)',
              color: '#ffffff',
              borderRadius: 9999,
              padding: '2px 7px',
              animation: 'pulse 2s infinite',
            }}>{badge}</span>
          )}
        </div>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {icon}
        </div>
      </div>

      {/* Valor */}
      <div className="flex items-end gap-2 mb-1">
        <span style={{ fontSize: 28, fontWeight: 700, lineHeight: 1, color: accent || 'var(--ws-text-1)' }}>
          {value}
        </span>
        {delta !== undefined && (
          <span style={{ fontSize: 12, fontWeight: 600, marginBottom: 2, color: delta > 0 ? 'var(--ws-green)' : delta < 0 ? 'var(--ws-coral)' : 'var(--ws-text-3)', display: 'flex', alignItems: 'center', gap: 2 }}>
            {delta > 0 ? <TrendingUp size={13} /> : delta < 0 ? <TrendingDown size={13} /> : <Minus size={13} />}
            {delta > 0 ? '+' : ''}{delta} pts
          </span>
        )}
      </div>

      {sub && <p style={{ fontSize: 12, color: 'var(--ws-text-3)', marginTop: 2 }}>{sub}</p>}

      {/* Termômetro */}
      {thermometer && (
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', height: 6, borderRadius: 9999, overflow: 'hidden', gap: 1 }}>
            <div style={{ flex: thermometer.detrator, background: 'var(--ws-coral)', transition: 'flex 0.5s' }} />
            <div style={{ flex: thermometer.neutro, background: 'var(--ws-gold)', transition: 'flex 0.5s' }} />
            <div style={{ flex: thermometer.promotor, background: 'var(--ws-green)', transition: 'flex 0.5s' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, color: 'var(--ws-text-3)' }}>
            <span style={{ color: 'var(--ws-coral)' }}>{thermometer.detrator}% Detratores</span>
            <span style={{ color: 'var(--ws-gold)' }}>{thermometer.neutro}% Neutros</span>
            <span style={{ color: 'var(--ws-green)' }}>{thermometer.promotor}% Promotores</span>
          </div>
        </div>
      )}

      {onAction && (
        <button
          onClick={onAction}
          style={{
            marginTop: 10,
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--ws-coral)',
            background: 'rgba(255,92,141,0.1)',
            border: '0.5px solid rgba(255,92,141,0.3)',
            borderRadius: 6,
            padding: '5px 10px',
            cursor: 'pointer',
            width: '100%',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,92,141,0.2)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,92,141,0.1)')}
        >
          {actionLabel}
        </button>
      )}

      <style>{`@keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.6} }`}</style>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────
export function NpsDashboard({ metrics, evolucao, distribuicao, onVerDetratores }: NpsDashboardProps & { onVerDetratores: () => void }) {
  const scoreColor = npsColor(metrics.score_geral)
  const scorePrefix = metrics.score_geral > 0 ? '+' : ''

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        {/* NPS Score — card principal */}
        <KpiCard
          label="NPS Score"
          value={`${scorePrefix}${metrics.score_geral}`}
          sub={`${npsLabel(metrics.score_geral)} · ${metrics.total_respostas} avaliações`}
          icon={<Star size={18} color="var(--ws-gold)" />}
          iconBg="rgba(201,168,76,0.15)"
          accent={scoreColor}
          delta={metrics.evolucao_30d}
          thermometer={{
            detrator: metrics.pct_detrator,
            neutro: metrics.pct_neutro,
            promotor: metrics.pct_promotor,
          }}
        />

        {/* Respostas */}
        <KpiCard
          label="Respostas"
          value={metrics.total_respostas}
          sub={`${metrics.taxa_resposta}% taxa de resposta · ${metrics.total_enviados} enviados`}
          icon={<Users size={18} color="var(--ws-blue)" />}
          iconBg="rgba(62,91,255,0.15)"
          accent="var(--ws-blue)"
        />

        {/* Promotores */}
        <KpiCard
          label="Promotores"
          value={`${metrics.pct_promotor}%`}
          sub={`${metrics.promotores} clientes satisfeitos`}
          icon={<Smile size={18} color="var(--ws-green)" />}
          iconBg="rgba(15,168,86,0.15)"
          accent="var(--ws-green)"
        />

        {/* Detratores */}
        <KpiCard
          label="Detratores"
          value={`${metrics.pct_detrator}%`}
          sub={`${metrics.detratores} clientes insatisfeitos`}
          icon={<Frown size={18} color="var(--ws-coral)" />}
          iconBg="rgba(255,92,141,0.15)"
          accent="var(--ws-coral)"
          badge={metrics.detratores > 0 ? 'ATENÇÃO' : undefined}
          badgeColor="var(--ws-coral)"
          onAction={metrics.detratores > 0 ? onVerDetratores : undefined}
          actionLabel="Ver Detratores →"
        />
      </div>

      {/* Gráficos */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {/* Gráfico 1: Evolução NPS */}
        <div style={{
          position: 'relative',
          background: 'var(--ws-glass-bg)',
          border: '1px solid var(--ws-glass-border)',
          borderRadius: 'var(--ws-radius-lg)',
          backdropFilter: 'blur(16px)',
          boxShadow: 'var(--ws-glass-shadow)',
          padding: '20px',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.8),transparent)', pointerEvents: 'none' }} />
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--ws-text-1)' }}>Evolução do NPS</h3>
              <p style={{ fontSize: 12, color: 'var(--ws-text-3)' }}>Últimas 12 semanas</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={evolucao} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="npsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--ws-blue)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--ws-blue)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(14,20,42,0.06)" vertical={false} />
              <XAxis dataKey="semana" tick={{ fill: 'var(--ws-text-3)', fontSize: 11 }} axisLine={{ stroke: 'var(--ws-divider)' }} tickLine={false} />
              <YAxis domain={[-100, 100]} tick={{ fill: 'var(--ws-text-3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<EvolucaoTooltip />} />
              {/* Zonas de referência */}
              <ReferenceLine y={50} stroke="rgba(15,168,86,0.3)" strokeDasharray="4 4" />
              <ReferenceLine y={0} stroke="rgba(201,168,76,0.3)" strokeDasharray="4 4" />
              <Area type="monotone" dataKey="nps" stroke="var(--ws-blue)" strokeWidth={2} fill="url(#npsGrad)" dot={{ fill: 'var(--ws-blue)', r: 3 }} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
          {/* Legenda de zonas */}
          <div style={{ display: 'flex', gap: 12, marginTop: 8, justifyContent: 'center' }}>
            {[
              { color: 'var(--ws-green)', label: '≥ 50 Excelente' },
              { color: 'var(--ws-gold)', label: '0–50 Neutro' },
              { color: 'var(--ws-coral)', label: '< 0 Atenção' },
            ].map(z => (
              <div key={z.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 20, height: 2, background: z.color, borderRadius: 9999 }} />
                <span style={{ fontSize: 10, color: 'var(--ws-text-3)' }}>{z.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfico 2: Distribuição por score */}
        <div style={{
          position: 'relative',
          background: 'var(--ws-glass-bg)',
          border: '1px solid var(--ws-glass-border)',
          borderRadius: 'var(--ws-radius-lg)',
          backdropFilter: 'blur(16px)',
          boxShadow: 'var(--ws-glass-shadow)',
          padding: '20px',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.8),transparent)', pointerEvents: 'none' }} />
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--ws-text-1)' }}>Distribuição de Notas</h3>
              <p style={{ fontSize: 12, color: 'var(--ws-text-3)' }}>Scores de 0 a 10</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={distribuicao} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(14,20,42,0.06)" vertical={false} />
              <XAxis dataKey="nota" tick={{ fill: 'var(--ws-text-3)', fontSize: 11 }} axisLine={{ stroke: 'var(--ws-divider)' }} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fill: 'var(--ws-text-3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<DistribuicaoTooltip />} />
              <Bar dataKey="quantidade" radius={[4, 4, 0, 0]}>
                {distribuicao.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={barColor(entry.categoria)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {/* Legenda categorias */}
          <div style={{ display: 'flex', gap: 12, marginTop: 8, justifyContent: 'center' }}>
            {[
              { color: 'var(--ws-coral)', label: '0–6 Detrator' },
              { color: 'var(--ws-gold)', label: '7–8 Neutro' },
              { color: 'var(--ws-green)', label: '9–10 Promotor' },
            ].map(z => (
              <div key={z.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: z.color }} />
                <span style={{ fontSize: 10, color: 'var(--ws-text-3)' }}>{z.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
