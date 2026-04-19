import { useState } from 'react'
import { Search, ArrowUpDown, ChevronDown, Check } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { FiltrosCampanhasGoogle } from '@/types/google-ads'

function GlassSelect({ label, value, onChange, options, minWidth = 140 }: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { label: string; value: string }[]
  minWidth?: number
}) {
  const [open, setOpen] = useState(false)
  const selected = options.find(o => o.value === value)
  
  return (
    <div style={{ position: 'relative', minWidth }}>
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
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{selected?.label ?? label}</span>
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

interface Props {
  filtros: FiltrosCampanhasGoogle
  onChange: (f: FiltrosCampanhasGoogle) => void
}

export function FiltrosCampanhasGoogle({ filtros, onChange }: Props) {
  const set = (partial: Partial<FiltrosCampanhasGoogle>) =>
    onChange({ ...filtros, ...partial })

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 14 }}>
      <div style={{ position: 'relative' }}>
        <Search size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ws-text-3)', zIndex: 1 }} />
        <Input
          className="h-8 text-xs focus:ring-0 focus:border-transparent"
          style={{
            width: 220,
            paddingLeft: 30,
            background: 'var(--ws-glass-bg)',
            border: '1px solid var(--ws-glass-border)',
            borderRadius: 'var(--ws-radius-md)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: 'var(--ws-glass-shadow-sm)',
            color: 'var(--ws-text-1)',
            outline: 'none',
          }}
          placeholder="Buscar campanha..."
          value={filtros.busca}
          onChange={e => set({ busca: e.target.value })}
        />
      </div>

      <GlassSelect
        label="Todos os tipos"
        value={filtros.tipo}
        onChange={v => set({ tipo: v })}
        options={[
          { label: 'Todos os tipos', value: 'todos' },
          { label: 'Search', value: 'SEARCH' },
          { label: 'Performance Max', value: 'PERFORMANCE_MAX' },
          { label: 'Display', value: 'DISPLAY' },
          { label: 'Video', value: 'VIDEO' },
        ]}
      />

      <GlassSelect
        label="Status"
        value={filtros.status}
        onChange={v => set({ status: v })}
        minWidth={110}
        options={[
          { label: 'Todos', value: 'todos' },
          { label: 'Ativa', value: 'ENABLED' },
          { label: 'Pausada', value: 'PAUSED' },
        ]}
      />

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11, color: 'var(--ws-text-3)' }}>Ordenar por</span>
        <GlassSelect
          label="Ordenar"
          value={filtros.ordenarPor}
          onChange={v => set({ ordenarPor: v as FiltrosCampanhasGoogle['ordenarPor'] })}
          minWidth={130}
          options={[
            { label: 'Investimento', value: 'investimento' },
            { label: 'Conversões', value: 'conversoes' },
            { label: 'ROAS', value: 'roas' },
            { label: 'CTR', value: 'ctr' },
            { label: 'Quality Score', value: 'qualityScore' },
          ]}
        />
        <button
          onClick={() => set({ ordem: filtros.ordem === 'asc' ? 'desc' : 'asc' })}
          style={{
            height: 32,
            width: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--ws-glass-bg)',
            border: '1px solid var(--ws-glass-border)',
            borderRadius: 'var(--ws-radius-md)',
            cursor: 'pointer',
            color: 'var(--ws-text-3)',
            transition: 'var(--ws-transition)',
          }}
          title={filtros.ordem === 'asc' ? 'Crescente' : 'Decrescente'}
        >
          <ArrowUpDown size={14} />
        </button>
      </div>
    </div>
  )
}
