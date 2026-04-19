'use client'

import React, { useEffect, useRef, useMemo } from 'react'
import {
  format,
  startOfWeek,
  addDays,
  startOfDay,
  addMinutes,
  differenceInMinutes,
  isSameDay,
  parseISO,
  isToday,
  addWeeks,
  subWeeks,
  isValid,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  ChevronLeft,
  ChevronRight,
  Bot,
  Code2,
  Check,
  Plus,
} from 'lucide-react'
import { Agendamento, Agenda, AgendamentoStatus } from '@/types/agenda'

interface CalendarioSemanaProps {
  agendamentos: Agendamento[]
  agendas: Agenda[]
  agendasVisiveis: string[]
  semanaAtual: Date
  onSemanaChange: (data: Date) => void
  onAgendamentoClick: (agendamento: Agendamento) => void
  onSlotClick: (data: string, hora: string, agendaId?: string) => void
}

const ROW_HEIGHT_30MIN = 48
const HOUR_HEIGHT = 96
const HOUR_WIDTH = 60

export function CalendarioSemana({
  agendamentos,
  agendas,
  agendasVisiveis,
  semanaAtual,
  onSemanaChange,
  onAgendamentoClick,
  onSlotClick,
}: CalendarioSemanaProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const diasDaSemana = useMemo(() => {
    const inicio = startOfWeek(semanaAtual, { weekStartsOn: 0 })
    return Array.from({ length: 7 }, (_, i) => addDays(inicio, i))
  }, [semanaAtual])

  const periodoLabel = useMemo(() => {
    const inicio = diasDaSemana[0]
    const fim = diasDaSemana[6]
    return `${format(inicio, "d 'de' MMM", { locale: ptBR })} — ${format(fim, "d 'de' MMM yyyy", { locale: ptBR })}`
  }, [diasDaSemana])

  const horasArr = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const h = i.toString().padStart(2, '0')
      return [`${h}:00`, `${h}:30`]
    }).flat()
  }, [])

  const agendamentosNoPeriodo = useMemo(() => {
    const inicioSemana = startOfDay(diasDaSemana[0])
    const fimSemana = startOfDay(addDays(diasDaSemana[6], 1))

    return agendamentos.filter((ag) => {
      const dataAg = parseISO(ag.data_hora_inicio)
      return (
        agendasVisiveis.includes(ag.agenda_id) &&
        dataAg >= inicioSemana &&
        dataAg < fimSemana
      )
    })
  }, [agendamentos, agendasVisiveis, diasDaSemana])

  // Helper para posicionamento
  const getTop = (isoString: string) => {
    const date = parseISO(isoString)
    if (!isValid(date)) return 0
    const minutes = date.getHours() * 60 + date.getMinutes()
    return (minutes * HOUR_HEIGHT) / 60
  }

  const getHeightValue = (start: string, end: string) => {
    const dStart = parseISO(start)
    const dEnd = parseISO(end)
    if (!isValid(dStart) || !isValid(dEnd)) return 40
    const dur = differenceInMinutes(dEnd, dStart)
    return Math.max(40, (dur * HOUR_HEIGHT) / 60)
  }

  // Lógica de colisão
  const calculateEventPositions = (dayAgendamentos: Agendamento[]) => {
    const sorted = [...dayAgendamentos].sort((a, b) => 
      new Date(a.data_hora_inicio).getTime() - new Date(b.data_hora_inicio).getTime()
    )

    const groups: Agendamento[][] = []
    sorted.forEach(evt => {
      const group = groups.find(g => 
        g.some(e => 
          (evt.data_hora_inicio < e.data_hora_fim && evt.data_hora_fim > e.data_hora_inicio)
        )
      )
      if (group) group.push(evt)
      else groups.push([evt])
    })

    const positionedEvents: (Agendamento & { style: React.CSSProperties })[] = []

    groups.forEach(group => {
      const columns: Agendamento[][] = []
      group.forEach(evt => {
        let placed = false
        for (const col of columns) {
          if (col.every(e => evt.data_hora_inicio >= e.data_hora_fim || evt.data_hora_fim <= e.data_hora_inicio)) {
            col.push(evt)
            placed = true
            break
          }
        }
        if (!placed) columns.push([evt])
      })

      const colCount = columns.length
      columns.forEach((col, colIdx) => {
        col.forEach(evt => {
          positionedEvents.push({
            ...evt,
            style: {
              width: `${100 / colCount}%`,
              left: `${(100 / colCount) * colIdx}%`,
            }
          })
        })
      })
    })

    return positionedEvents
  }

  const currentTimePos = useMemo(() => {
    const agora = new Date()
    const HORA_INICIO_GRID = 0
    const minutosDesdeInicio = (agora.getHours() - HORA_INICIO_GRID) * 60 + agora.getMinutes()
    return (minutosDesdeInicio / 60) * HOUR_HEIGHT
  }, [])

  useEffect(() => {
    if (scrollContainerRef.current) {
      const scrollTarget = currentTimePos - 200 // mostra 2h acima da hora atual
      scrollContainerRef.current.scrollTo({ top: Math.max(0, scrollTarget), behavior: 'smooth' })
    }
  }, [currentTimePos])

  function renderStatusBadge(status: AgendamentoStatus) {
    switch (status) {
      case 'confirmado':
        return <div className="p-0.5 bg-green-500/20 backdrop-blur-sm rounded-full"><Check size={8} className="text-green-300" strokeWidth={4} /></div>
      case 'compareceu':
        return <div className="p-0.5 bg-green-600 rounded-full shadow-lg"><Check size={8} className="text-white" strokeWidth={4} /></div>
      case 'falta':
        return <div className="px-1 py-0.5 bg-red-500/20 rounded-full text-[7px] font-black text-red-200 uppercase">FALTA</div>
      case 'agendado':
        return <div className="p-0.5 bg-blue-500/20 rounded-full w-2 h-2 border border-blue-400/50" />
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden select-none" style={{ minHeight: 600 }}>
      {/* HEADER GLASS */}
      <div 
        className="flex flex-col flex-shrink-0 z-30 relative"
        style={{ 
          background: 'var(--ws-glass-bg)', 
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid var(--ws-glass-border)',
          boxShadow: 'var(--ws-glass-shadow)'
        }}
      >
        {/* Nav Toolbar */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-black/5 dark:bg-white/5 rounded-lg border border-[var(--ws-divider)] p-1">
              <button 
                onClick={() => onSemanaChange(subWeeks(semanaAtual, 1))}
                className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-[var(--ws-text-2)]"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                onClick={() => onSemanaChange(addWeeks(semanaAtual, 1))}
                className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-[var(--ws-text-2)]"
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <span className="text-[var(--ws-text-1)] font-semibold text-sm tracking-wide">{periodoLabel}</span>
          </div>
          <button 
            onClick={() => onSemanaChange(new Date())}
            className="px-4 py-1.5 rounded-full bg-[rgba(201,168,76,0.12)] border border-[rgba(201,168,76,0.3)] text-[var(--ws-gold)] text-xs font-bold hover:bg-[rgba(201,168,76,0.2)] transition-all"
          >
            Hoje
          </button>
        </div>

        {/* Labels Dias */}
        <div className="flex">
          <div style={{ width: HOUR_WIDTH }} className="flex-shrink-0 border-r border-[var(--ws-divider)]" />
          <div className="flex flex-1">
            {diasDaSemana.map((dia, i) => {
              const hoje = isToday(dia)
              return (
                <div key={i} className="flex-1 flex flex-col items-center py-3 border-l border-[var(--ws-divider)]">
                  <span style={{ fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ws-text-3)', fontWeight: 500, marginBottom: 8 }}>
                    {format(dia, 'eee', { locale: ptBR })}
                  </span>
                  <div 
                    style={{
                      fontSize: 18, fontWeight: 500, width: 36, height: 36,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderRadius: '50%',
                      background: hoje ? 'var(--ws-blue)' : 'transparent',
                      color: hoje ? '#ffffff' : 'var(--ws-text-1)',
                      transition: 'all 0.2s',
                    }}
                  >
                    {format(dia, 'd')}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Dia Todo */}
        <div className="flex border-t border-[var(--ws-divider)] bg-black/[0.02] dark:bg-white/[0.02]">
          <div style={{ width: HOUR_WIDTH }} className="flex-shrink-0 flex items-center justify-center text-[8px] uppercase tracking-widest text-[var(--ws-text-3)] font-black border-r border-[var(--ws-divider)]">
            ALL DAY
          </div>
          <div className="flex flex-1 h-10">
            {diasDaSemana.map((dia, i) => (
              <div key={i} className="flex-1 border-l border-[var(--ws-divider)]" />
            ))}
          </div>
        </div>
        
        {/* Linha de brilho interior */}
        <div style={{ position:'absolute',top:0,left:0,right:0,height:1, background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)', pointerEvents:'none' }} />
      </div>

      {/* GRID CONTENT */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto relative scrollbar-hide bg-transparent"
      >
        <div className="flex relative" style={{ height: 24 * HOUR_HEIGHT }}>
          
          {/* Coluna Horas */}
          <div 
            style={{ width: HOUR_WIDTH }} 
            className="flex-shrink-0 bg-white/40 dark:bg-black/40 border-r border-[var(--ws-divider)] sticky left-0 z-20"
          >
            {Array.from({ length: 24 }, (_, i) => (
              <div 
                key={i} 
                style={{ height: HOUR_HEIGHT }} 
                className="relative flex justify-center pt-2"
              >
                <span className="text-[10px] text-[var(--ws-text-3)] font-bold tabular-nums">
                  {i.toString().padStart(2, '0')}:00
                </span>
              </div>
            ))}
          </div>

          {/* Grid de Dias */}
          <div className="flex flex-1 relative">
            {/* Grid Lines */}
            <div className="absolute inset-0 pointer-events-none z-0">
              {Array.from({ length: 24 * 2 }, (_, i) => (
                <div 
                  key={i} 
                  style={{ 
                    height: ROW_HEIGHT_30MIN,
                    borderBottom: i % 2 === 1 
                      ? '1px dashed rgba(14,20,42,0.05)' 
                      : '1px solid rgba(14,20,42,0.10)'
                  }} 
                  className="w-full"
                />
              ))}
            </div>

            {/* Colunas */}
            {diasDaSemana.map((dia, diaIdx) => {
              const dateKey = format(dia, 'yyyy-MM-dd')
              const agsRaw = agendamentosNoPeriodo.filter(a => isSameDay(parseISO(a.data_hora_inicio), dia))
              const ags = calculateEventPositions(agsRaw)
              const hoje = isToday(dia)

              return (
                <div key={diaIdx} className="flex-1 relative border-l border-[var(--ws-divider)] hover:bg-[var(--ws-blue-soft)] transition-colors group">
                  
                  {/* Slots clicáveis */}
                  {horasArr.map((hora, hIdx) => (
                    <div 
                      key={hIdx}
                      style={{ height: ROW_HEIGHT_30MIN }}
                      onClick={() => onSlotClick(dateKey, hora)}
                      className="w-full relative cursor-pointer group/slot"
                    >
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/slot:opacity-100 bg-[var(--ws-blue-soft)] transition-all">
                        <Plus size={16} className="text-[#3E5BFF]" />
                      </div>
                    </div>
                  ))}

                  {/* Agendamentos */}
                  <div className="absolute inset-0 pointer-events-none">
                    {ags.map((ag) => {
                      const agenda = agendas.find(a => a.id === ag.agenda_id)
                      const top = getTop(ag.data_hora_inicio)
                      const height = getHeightValue(ag.data_hora_inicio, ag.data_hora_fim)
                      const bgColor = agenda?.cor || '#3E5BFF'
                      const isCancelado = ag.status === 'cancelado'

                      return (
                        <div
                          key={ag.id}
                          onClick={(e) => {
                            e.stopPropagation()
                            onAgendamentoClick(ag)
                          }}
                          style={{
                            position: 'absolute',
                            top: top + 2,
                            height: height - 4,
                            background: `${bgColor}D9`,
                            borderLeft: `4px solid ${bgColor}`,
                            zIndex: 10,
                            ...ag.style,
                            pointerEvents: 'auto',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
                          }}
                          className={`rounded-r-md px-2 py-1 overflow-hidden transition-all hover:brightness-125 hover:z-20 active:scale-[0.97] group/card ${isCancelado ? 'opacity-50 grayscale' : ''}`}
                        >
                          <div className="flex justify-between items-start gap-1">
                            <span 
                              className={`text-[11px] font-bold text-white truncate leading-tight ${isCancelado ? 'line-through opacity-60' : ''}`}
                            >
                              {ag.cliente_nome}
                            </span>
                            <div className="flex gap-1 shrink-0">
                              {ag.origem === 'agente' && <Bot size={10} className="text-[var(--ws-gold)] drop-shadow-lg" />}
                              {ag.origem === 'api' && <Code2 size={10} className="text-[#00F5FF]" />}
                            </div>
                          </div>

                          {height > 44 && (
                            <div className="flex flex-col mt-0.5">
                              <span className="text-[9px] text-white/80 font-medium truncate uppercase tracking-tighter">{ag.servico}</span>
                              <span className="text-[8px] text-white/40 font-bold tabular-nums">
                                {format(parseISO(ag.data_hora_inicio), 'HH:mm')}
                              </span>
                            </div>
                          )}

                          <div className="absolute bottom-1 right-1">
                            {renderStatusBadge(ag.status)}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Linha do Tempo */}
                  {hoje && (
                    <div 
                      className="absolute left-0 right-0 z-30 flex items-center pointer-events-none"
                      style={{ top: currentTimePos }}
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500 -ml-1.25 shadow-[0_0_10px_rgba(239,68,68,1)] border border-white/20 dark:border-black/20" />
                      <div className="flex-1 h-[2px] bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
