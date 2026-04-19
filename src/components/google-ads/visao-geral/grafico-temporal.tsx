'use client'

import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { InfoTooltip } from '@/components/ui/info-tooltip'
import type { DadosDiarios } from '@/types/google-ads'

interface Props {
  dados: DadosDiarios[]
}

const GRAFICO_TEMPORAL_DIAGRAM = `
  <div style="font-size:10px;color:#666;display:flex;flex-direction:column;gap:4px">
    <div style="display:flex;align-items:center;gap:6px">
      <div style="width:28px;height:10px;background:#3E5BFF;border-radius:2px"></div>
      <span>Cliques (eixo esquerdo)</span>
    </div>
    <div style="display:flex;align-items:center;gap:6px">
      <div style="width:28px;height:2px;background:#0fa856"></div>
      <span>Conversões (eixo esquerdo)</span>
    </div>
    <div style="display:flex;align-items:center;gap:6px">
      <div style="width:28px;height:0;border-top:2px dashed #F5A623"></div>
      <span>Custo R$ (eixo direito)</span>
    </div>
  </div>
`

function isDark() {
  if (typeof window === 'undefined') return false
  return document.documentElement.classList.contains('dark')
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; name: string }>; label?: string }) {
  if (!active || !payload || payload.length === 0) return null
  return (
    <div style={{ background: 'rgba(14,20,42,0.92)', borderRadius: 6, padding: '8px 12px', fontSize: 11, color: '#fff' }}>
      <div style={{ fontWeight: 500, marginBottom: 4 }}>{label}</div>
      {payload.map(e => (
        <div key={e.dataKey} style={{ display: 'flex', gap: 8 }}>
          <span style={{ color: 'rgba(255,255,255,0.7)' }}>{e.name}:</span>
          <span style={{ fontWeight: 500 }}>{e.dataKey === 'custo' ? `R$ ${e.value.toLocaleString('pt-BR')}` : e.value.toLocaleString('pt-BR')}</span>
        </div>
      ))}
    </div>
  )
}

export function GraficoTemporalGoogle({ dados }: Props) {
  const dark = isDark()
  const gridColor = dark ? 'rgba(255,255,255,0.06)' : 'rgba(15,39,68,0.06)'
  const tickColor = dark ? '#6b6b6b' : '#9b9a97'

  return (
    <div style={{
      background: 'var(--ws-glass-bg)',
      border: '1px solid var(--ws-glass-border)',
      borderRadius: 'var(--ws-radius-lg)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      boxShadow: 'var(--ws-glass-shadow)',
      padding: '16px 20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)' }} />
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500 }}>Evolução temporal</div>
          <div style={{ fontSize: 11, color: 'var(--ws-text-2)' }}>Cliques, conversões e custo diário no período selecionado</div>
        </div>
        <InfoTooltip
          title="Evolução temporal"
          description="Barras = cliques diários. Linha verde = conversões. Linha tracejada dourada = custo. Dois eixos Y independentes."
          diagram={GRAFICO_TEMPORAL_DIAGRAM}
        />
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: '#3E5BFF', display: 'inline-block' }} />
          <span style={{ fontSize: 11, color: 'var(--ws-text-3)' }}>Cliques</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 10, height: 3, background: '#0fa856', display: 'inline-block', borderRadius: 1 }} />
          <span style={{ fontSize: 11, color: 'var(--ws-text-3)' }}>Conversões</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 16, height: 2, background: '#F5A623', display: 'inline-block', borderRadius: 1, borderTop: '2px dashed #F5A623' }} />
          <span style={{ fontSize: 11, color: 'var(--ws-text-3)' }}>Custo</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={dados} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="data" tick={{ fontSize: 11, fill: tickColor }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="left" tick={{ fontSize: 10, fill: tickColor }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: tickColor }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `R$${v}`} />
          <Tooltip content={<CustomTooltip />} />
          <Bar yAxisId="left" dataKey="cliques" fill="#3E5BFF" radius={[2, 2, 0, 0]} name="Cliques" opacity={0.85} />
          <Line yAxisId="left" dataKey="conversoes" stroke="#0fa856" strokeWidth={2} dot={{ r: 3, fill: '#0fa856' }} name="Conversões" type="monotone" />
          <Line yAxisId="right" dataKey="custo" stroke="#F5A623" strokeWidth={2} dot={{ r: 3, fill: '#F5A623' }} name="Custo (R$)" type="monotone" strokeDasharray="4 4" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
