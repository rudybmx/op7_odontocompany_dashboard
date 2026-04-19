'use client'
import { useState } from 'react'
import { ChevronDown, Calendar as CalendarIcon, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { ptBR } from 'date-fns/locale'
import type { DateRange } from 'react-day-picker'
import { format } from 'date-fns'

type Periodo = '7d' | '30d' | '90d' | 'custom'

function GlassSelect({ options, value, onChange }: {
  options: { label: string; value: string }[]
  value: string
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const selected = options.find(o => o.value === value)

  return (
    <div style={{ position: 'relative', width: 200 }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', height: 32, padding: '0 10px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--ws-glass-bg)', border: '1px solid var(--ws-glass-border)',
          backdropFilter: 'blur(10px)', borderRadius: 'var(--ws-radius-md)',
          boxShadow: 'var(--ws-glass-shadow-sm)', fontSize: 12,
          color: 'var(--ws-text-1)', cursor: 'pointer',
          transition: 'var(--ws-transition)',
        }}
      >
        <span>{selected?.label}</span>
        <ChevronDown size={12} style={{ color: 'var(--ws-text-3)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, zIndex: 100,
          background: 'var(--ws-glass-bg-hover)',
          border: '1px solid var(--ws-glass-border)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 'var(--ws-radius-md)',
          boxShadow: 'var(--ws-glass-shadow-lg)',
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
              {o.value === value && <Check size={11} style={{ color: 'var(--ws-blue)' }} />}
              {o.value !== value && <div style={{ width: 11 }} />}
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ToggleGroup({ options, value, onChange }: {
  options: { label: string; value: string }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div style={{
      display: 'inline-flex',
      border: '1px solid var(--ws-glass-border)',
      borderRadius: 'var(--ws-radius-md)',
      overflow: 'hidden',
      background: 'var(--ws-glass-bg)',
      backdropFilter: 'blur(10px)',
    }}>
      {options.map(o => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          style={{
            height: 32, padding: '0 12px',
            fontSize: 12, fontWeight: o.value === value ? 500 : 400,
            background: o.value === value ? 'rgba(62,91,255,0.12)' : 'transparent',
            color: o.value === value ? 'var(--ws-blue)' : 'var(--ws-text-3)',
            border: 'none', cursor: 'pointer',
            borderRight: '1px solid var(--ws-divider)',
            transition: 'var(--ws-transition)',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => { if (o.value !== value) e.currentTarget.style.background = 'rgba(62,91,255,0.06)' }}
          onMouseLeave={e => { if (o.value !== value) e.currentTarget.style.background = 'transparent' }}
        >{o.label}</button>
      ))}
    </div>
  )
}

function DateRangePicker() {
  const [periodo, setPeriodo] = useState<Periodo>('30d')

  const atalhos: { label: string; value: Periodo }[] = [
    { label: 'Hoje', value: '7d' },
    { label: '7 dias', value: '7d' },
    { label: '30 dias', value: '30d' },
    { label: '90 dias', value: '90d' },
    { label: 'Personalizado', value: 'custom' },
  ]

  return (
    <div style={{
      background: 'var(--ws-glass-bg)', border: '1px solid var(--ws-glass-border)',
      backdropFilter: 'blur(16px)', borderRadius: 'var(--ws-radius-lg)',
      boxShadow: 'var(--ws-glass-shadow)', padding: 16,
      display: 'inline-flex', flexDirection: 'column', gap: 12,
    }}>
      {/* Atalhos */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {atalhos.map(a => (
          <button
            key={a.value + a.label}
            type="button"
            onClick={() => setPeriodo(a.value)}
            style={{
              height: 28, padding: '0 12px', borderRadius: 9999,
              fontSize: 11, fontWeight: 500,
              background: periodo === a.value ? 'rgba(62,91,255,0.12)' : 'transparent',
              border: `1px solid ${periodo === a.value ? 'rgba(62,91,255,0.30)' : 'var(--ws-glass-border)'}`,
              color: periodo === a.value ? 'var(--ws-blue)' : 'var(--ws-text-2)',
              cursor: 'pointer', transition: 'var(--ws-transition)',
            }}
          >{a.label}</button>
        ))}
      </div>

      {periodo === 'custom' && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <CalendarIcon size={12} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--ws-text-3)', pointerEvents: 'none' }} />
            <input type="date" style={{
              height: 32, paddingLeft: 26, paddingRight: 8,
              background: 'var(--ws-glass-bg)', border: '1px solid var(--ws-glass-border)',
              borderRadius: 8, fontSize: 11, color: 'var(--ws-text-1)', outline: 'none',
            }} />
          </div>
          <span style={{ fontSize: 11, color: 'var(--ws-text-3)' }}>até</span>
          <div style={{ position: 'relative' }}>
            <CalendarIcon size={12} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--ws-text-3)', pointerEvents: 'none' }} />
            <input type="date" style={{
              height: 32, paddingLeft: 26, paddingRight: 8,
              background: 'var(--ws-glass-bg)', border: '1px solid var(--ws-glass-border)',
              borderRadius: 8, fontSize: 11, color: 'var(--ws-text-1)', outline: 'none',
            }} />
          </div>
        </div>
      )}
    </div>
  )
}

export function DSDropdown() {
  const [select1, setSelect1] = useState('all')
  const [select2, setSelect2] = useState('leads')
  const [toggle1, setToggle1] = useState('leads')
  const [toggle2, setToggle2] = useState('semana')
  const [dsRange, setDsRange] = useState<DateRange | undefined>(undefined)

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ws-text-1)', marginBottom: 6 }}>Dropdowns & Filtros</h2>
        <p style={{ fontSize: 14, color: 'var(--ws-text-2)', lineHeight: 1.6 }}>
          Select glass, toggle group de métricas, e date range picker com atalhos.
        </p>
      </div>

      <div style={{
        background: 'var(--ws-glass-bg)', border: '1px solid var(--ws-glass-border)',
        borderRadius: 'var(--ws-radius-lg)', backdropFilter: 'blur(16px)',
        boxShadow: 'var(--ws-glass-shadow)', padding: 24,
        position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', gap: 28,
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)' }} />

        <div>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ws-text-3)', marginBottom: 12 }}>Select Glass</div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <GlassSelect
              value={select1}
              onChange={setSelect1}
              options={[
                { label: 'Todos os status', value: 'all' },
                { label: 'Ativo', value: 'active' },
                { label: 'Pausado', value: 'paused' },
                { label: 'Aprendendo', value: 'learning' },
              ]}
            />
            <GlassSelect
              value={select2}
              onChange={setSelect2}
              options={[
                { label: 'Leads', value: 'leads' },
                { label: 'CPL', value: 'cpl' },
                { label: 'Investimento', value: 'invest' },
                { label: 'ROAS', value: 'roas' },
              ]}
            />
          </div>
        </div>

        <div>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ws-text-3)', marginBottom: 12 }}>Toggle Group de Métrica</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <ToggleGroup
              value={toggle1}
              onChange={setToggle1}
              options={[
                { label: 'Leads', value: 'leads' },
                { label: 'CPL', value: 'cpl' },
                { label: 'Investimento', value: 'invest' },
                { label: 'CTR', value: 'ctr' },
              ]}
            />
            <ToggleGroup
              value={toggle2}
              onChange={setToggle2}
              options={[
                { label: 'Dia', value: 'dia' },
                { label: 'Semana', value: 'semana' },
                { label: 'Mês', value: 'mes' },
              ]}
            />
          </div>
        </div>

        <div>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ws-text-3)', marginBottom: 12 }}>Date Range com Atalhos</div>
          <DateRangePicker />
        </div>

        <div>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.08em', color: 'var(--ws-text-3)', marginBottom: 12 }}>
            Date Range Picker — Refinado
          </div>

          {/* Container do popover simulado */}
          <div style={{
            background: 'var(--ws-glass-bg)',
            border: '1px solid var(--ws-glass-border)',
            borderRadius: 'var(--ws-radius-lg)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: 'var(--ws-glass-shadow-lg)',
            padding: '16px 20px 20px',
            display: 'inline-flex',
            flexDirection: 'column',
            gap: 14,
            position: 'relative',
            overflow: 'hidden',
            maxWidth: 680,
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)' }} />

            {/* Inputs de data */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Início do período', val: dsRange?.from ? format(dsRange.from, 'dd/MM/yyyy') : '' },
                { label: 'Fim do período',    val: dsRange?.to   ? format(dsRange.to,   'dd/MM/yyyy') : '' },
              ].map(({ label, val }) => (
                <div key={label}>
                  <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--ws-text-3)',
                    letterSpacing: '0.04em', marginBottom: 6 }}>{label}</div>
                  <div style={{
                    height: 34,
                    background: 'rgba(14,20,42,0.03)',
                    border: '1px solid var(--ws-glass-border)',
                    borderRadius: 'var(--ws-radius-md)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 500, color: val ? 'var(--ws-text-1)' : 'var(--ws-text-3)',
                  }}>
                    {val || '– – / – – / – – – –'}
                  </div>
                </div>
              ))}
            </div>

            {/* Calendário + Atalhos */}
            <div style={{ display: 'grid', gridTemplateColumns: 'min-content 140px', gap: 20 }}>
              <div style={{ position: 'relative' }}>
                <Calendar
                  mode="range"
                  selected={dsRange}
                  onSelect={setDsRange}
                  numberOfMonths={2}
                  locale={ptBR}
                  className="p-0 border-none"
                  classNames={{
                    months: "flex flex-row gap-[20px]",
                    month: "flex flex-col gap-[8px]",
                    month_caption: "flex justify-center h-7 relative items-center",
                    caption_label: "text-[11px] font-semibold text-[var(--ws-text-1)] tracking-tight",
                    nav: "flex items-center gap-1",
                    button_previous: "absolute left-0 top-0 h-7 w-7 flex items-center justify-center bg-transparent p-0 text-[var(--ws-text-3)] hover:text-[var(--ws-text-1)] cursor-pointer transition-colors z-10 [&_svg]:pointer-events-none [&_svg]:w-4 [&_svg]:h-4",
                    button_next: "absolute right-0 top-0 h-7 w-7 flex items-center justify-center bg-transparent p-0 text-[var(--ws-text-3)] hover:text-[var(--ws-text-1)] cursor-pointer transition-colors z-10 [&_svg]:pointer-events-none [&_svg]:w-4 [&_svg]:h-4",
                  month_grid: "w-full border-collapse",
                  weekdays: "flex",
                  weekday: "text-[var(--ws-text-3)] w-[28px] font-normal text-[9px] mb-1 flex items-center justify-center capitalize opacity-70",
                  week: "flex w-full mt-[2px] justify-between",
                  day: "p-0 text-center flex items-center justify-center",
                  day_button: "h-[26px] w-[26px] p-0 font-normal text-[10px] text-[var(--ws-text-1)] transition-colors hover:bg-[rgba(62,91,255,0.08)] rounded-[5px] flex items-center justify-center cursor-pointer",
                  selected: "!bg-[#3E5BFF] !text-white !font-medium !rounded-[5px]",
                  today: "border border-[rgba(62,91,255,0.35)] text-[#3E5BFF] rounded-[5px]",
                  outside: "text-[rgba(14,20,42,0.20)] pointer-events-none",
                  range_middle: "!bg-[rgba(62,91,255,0.07)] !text-[#3E5BFF] !rounded-none",
                  range_start: "!bg-[#3E5BFF] !text-white !rounded-r-none !rounded-l-[5px]",
                  range_end: "!bg-[#3E5BFF] !text-white !rounded-l-none !rounded-r-[5px]",
                }}
              />
              </div>

              {/* Atalhos */}
              <div style={{
                display: 'flex', flexDirection: 'column', gap: 1,
                paddingLeft: 20,
                borderLeft: '1px solid var(--ws-divider)',
              }}>
                {[
                  { label: 'Ontem',             dias: 1 },
                  { label: 'Esta semana',       dias: 7 },
                  { label: 'Semana passada',    dias: 14 },
                  { label: 'Este mês',          dias: 30 },
                  { label: 'Mês passado',       dias: 60 },
                  { label: 'Período customizado', dias: 0 },
                ].map(({ label }) => (
                  <button
                    key={label}
                    type="button"
                    style={{
                      width: '100%', textAlign: 'left',
                      padding: '6px 10px', borderRadius: 'var(--ws-radius-md)',
                      border: 'none', cursor: 'pointer',
                      fontSize: 12, color: 'var(--ws-text-2)',
                      background: 'transparent',
                      transition: 'var(--ws-transition)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(62,91,255,0.07)'
                      e.currentTarget.style.color = 'var(--ws-blue)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = 'var(--ws-text-2)'
                    }}
                  >{label}</button>
                ))}
              </div>
            </div>

            {/* Botões */}
            <div style={{
              display: 'flex', justifyContent: 'flex-end', gap: 8,
              borderTop: '1px solid var(--ws-divider)', paddingTop: 14,
            }}>
              <button type="button" onClick={() => setDsRange(undefined)} style={{
                height: 32, padding: '0 16px',
                borderRadius: 'var(--ws-radius-md)',
                background: 'transparent',
                border: '1px solid var(--ws-glass-border)',
                fontSize: 12, color: 'var(--ws-text-2)', cursor: 'pointer',
                transition: 'var(--ws-transition)',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--ws-glass-border-strong)'; e.currentTarget.style.color = 'var(--ws-text-1)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--ws-glass-border)'; e.currentTarget.style.color = 'var(--ws-text-2)' }}
              >Cancelar</button>
              <button type="button" style={{
                height: 32, padding: '0 20px',
                borderRadius: 'var(--ws-radius-md)',
                background: 'linear-gradient(135deg, var(--ws-blue), var(--ws-purple))',
                border: 'none', color: 'white',
                fontSize: 12, fontWeight: 500, cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(62,91,255,0.35)',
                transition: 'var(--ws-transition)',
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(62,91,255,0.50)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(62,91,255,0.35)' }}
              >Filtrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
