'use client'

import { useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import type { FiltrosPublicos, MetricaPublicos } from '@/types/meta-ads-publicos'

interface Props {
  filtros: FiltrosPublicos
  onChange: (f: FiltrosPublicos) => void
}

const METRICAS: { valor: MetricaPublicos; label: string }[] = [
  { valor: 'leads', label: 'Leads' },
  { valor: 'cpl', label: 'CPL' },
  { valor: 'investimento', label: 'Investimento' },
  { valor: 'ctr', label: 'CTR' },
]

function GlassSelect({ label, value, onChange, options }: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { label: string; value: string }[]
}) {
  const [open, setOpen] = useState(false)
  const selected = options.find(o => o.value === value)
  return (
    <div style={{ position: 'relative', minWidth: 160 }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', height: 32, padding: '0 10px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6,
          background: 'var(--ws-glass-bg)', border: '1px solid var(--ws-glass-border)',
          backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
          borderRadius: 'var(--ws-radius-md)', boxShadow: 'var(--ws-glass-shadow-sm)',
          fontSize: 12, color: 'var(--ws-text-1)', cursor: 'pointer',
          transition: 'var(--ws-transition)', whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--ws-glass-bg-hover)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--ws-glass-bg)' }}
      >
        <span>{selected?.label ?? label}</span>
        <ChevronDown size={12} style={{ color: 'var(--ws-text-3)', flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, zIndex: 100,
          background: 'var(--ws-glass-bg-hover)', border: '1px solid var(--ws-glass-border)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 'var(--ws-radius-md)', boxShadow: 'var(--ws-glass-shadow-lg)',
          overflow: 'hidden',
        }}>
          {options.map(o => (
            <button
              key={o.value}
              type="button"
              onClick={() => { onChange(o.value); setOpen(false) }}
              style={{
                width: '100%', textAlign: 'left', padding: '8px 12px',
                fontSize: 12, color: o.value === value ? 'var(--ws-blue)' : 'var(--ws-text-1)',
                fontWeight: o.value === value ? 500 : 400,
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
                transition: 'var(--ws-transition)',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(62,91,255,0.06)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              {o.value === value
                ? <Check size={11} style={{ color: 'var(--ws-blue)', flexShrink: 0 }} />
                : <div style={{ width: 11 }} />}
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function FiltrosPublicos({ filtros, onChange }: Props) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <GlassSelect
        label="Todas as campanhas"
        value={filtros.campanha}
        onChange={v => onChange({ ...filtros, campanha: v })}
        options={[
          { label: 'Todas as campanhas', value: 'todas' },
          { label: 'Campanha Londrina', value: 'campanha-1' },
          { label: 'Campanha Cornélio', value: 'campanha-2' },
        ]}
      />
      <GlassSelect
        label="Todos os conjuntos"
        value={filtros.conjunto}
        onChange={v => onChange({ ...filtros, conjunto: v })}
        options={[
          { label: 'Todos os conjuntos', value: 'todos' },
          { label: 'Conjunto 25–34', value: 'conjunto-1' },
          { label: 'Conjunto Retargeting', value: 'conjunto-2' },
        ]}
      />
      <GlassSelect
        label="Período"
        value={filtros.periodo}
        onChange={v => onChange({ ...filtros, periodo: v as FiltrosPublicos['periodo'] })}
        options={[
          { label: '7 dias', value: '7d' },
          { label: '30 dias', value: '30d' },
          { label: '90 dias', value: '90d' },
        ]}
      />

      {/* Toggle group de métricas */}
      <div style={{ marginLeft: 'auto' }}>
        <div style={{
          display: 'inline-flex',
          border: '1px solid var(--ws-glass-border)',
          borderRadius: 'var(--ws-radius-md)',
          overflow: 'hidden',
          background: 'var(--ws-glass-bg)',
          backdropFilter: 'blur(10px)',
        }}>
          {METRICAS.map((m, i) => (
            <button
              key={m.valor}
              type="button"
              onClick={() => onChange({ ...filtros, metrica: m.valor })}
              style={{
                height: 32, padding: '0 12px',
                fontSize: 12, fontWeight: filtros.metrica === m.valor ? 500 : 400,
                background: filtros.metrica === m.valor ? 'rgba(62,91,255,0.12)' : 'transparent',
                color: filtros.metrica === m.valor ? 'var(--ws-blue)' : 'var(--ws-text-3)',
                border: 'none', cursor: 'pointer',
                borderRight: i < METRICAS.length - 1 ? '1px solid var(--ws-divider)' : 'none',
                transition: 'var(--ws-transition)', whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { if (filtros.metrica !== m.valor) e.currentTarget.style.background = 'rgba(62,91,255,0.06)' }}
              onMouseLeave={e => { if (filtros.metrica !== m.valor) e.currentTarget.style.background = 'transparent' }}
            >{m.label}</button>
          ))}
        </div>
      </div>
    </div>
  )
}

