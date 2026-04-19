'use client'

import React, { useMemo } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Bot, Code2 } from 'lucide-react'
import { Agendamento, Agenda } from '@/types/agenda'

interface CalendarioMesProps {
  agendamentos: Agendamento[]
  agendas: Agenda[]
  agendasVisiveis: string[]
  mesAtual: Date
  onMesChange: (data: Date) => void
  onDiaClick: (data: Date) => void
  onAgendamentoClick: (a: Agendamento) => void
}

export function CalendarioMes({
  agendamentos,
  agendas,
  agendasVisiveis,
  mesAtual,
  onMesChange,
  onDiaClick,
  onAgendamentoClick,
}: CalendarioMesProps) {
  // 1. Calcular intervalo de dias para o grid (Sun-Sat)
  const daysInGrid = useMemo(() => {
    const start = startOfWeek(startOfMonth(mesAtual), { weekStartsOn: 0 })
    const end = endOfWeek(endOfMonth(mesAtual), { weekStartsOn: 0 })
    return eachDayOfInterval({ start, end })
  }, [mesAtual])

  const periodoLabel = format(mesAtual, "MMMM yyyy", { locale: ptBR })

  // 2. Extrair iniciais do dia da semana
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden select-none">
      {/* TOOLBAR NAVEGAÇÃO */}
      <div 
        className="flex items-center justify-between px-4 py-3 bg-white/[0.02] border-b border-white/5"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-black/5 dark:bg-white/5 rounded-lg border border-[var(--ws-divider)] p-1">
            <button 
              onClick={() => onMesChange(subMonths(mesAtual, 1))}
              className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-[var(--ws-text-2)]"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={() => onMesChange(addMonths(mesAtual, 1))}
              className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-[var(--ws-text-2)]"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <span className="text-[var(--ws-text-1)] font-semibold text-sm tracking-wide capitalize">
            {periodoLabel}
          </span>
        </div>
        <button 
          onClick={() => onMesChange(new Date())}
          className="px-4 py-1.5 rounded-full bg-[rgba(201,168,76,0.12)] border border-[rgba(201,168,76,0.3)] text-[var(--ws-gold)] text-xs font-bold hover:bg-[rgba(201,168,76,0.2)] transition-all"
        >
          Hoje
        </button>
      </div>

      {/* HEADER DIAS DA SEMANA */}
      <div className="grid grid-cols-7 border-b border-[var(--ws-divider)]">
        {weekDays.map((day) => (
          <div key={day} className="py-2 text-center text-[10px] font-bold uppercase tracking-widest text-[var(--ws-text-3)]">
            {day}
          </div>
        ))}
      </div>

      {/* GRID DE DIAS */}
      <div className="grid grid-cols-7 flex-1 overflow-auto">
        {daysInGrid.map((day, idx) => {
          const isCurrentMonth = isSameMonth(day, mesAtual)
          const isHoje = isToday(day)
          const dateKey = format(day, 'yyyy-MM-dd')
          
          const agsDoDia = agendamentos.filter(ag => 
            isSameDay(parseISO(ag.data_hora_inicio), day) &&
            agendasVisiveis.includes(ag.agenda_id)
          )

          const moreCount = agsDoDia.length > 3 ? agsDoDia.length - 3 : 0
          const displayAgs = agsDoDia.slice(0, 3)

          return (
            <div 
              key={idx}
              className={`min-h-[120px] border-b border-r border-[var(--ws-divider)] p-1 flex flex-col transition-colors hover:bg-[var(--ws-blue-soft)] ${
                !isCurrentMonth ? 'opacity-25' : ''
              }`}
            >
              {/* NÚMERO DO DIA */}
              <div className="flex justify-end p-1">
                <button 
                  onClick={() => onDiaClick(day)}
                  className={`w-7 h-7 flex items-center justify-center text-xs font-bold rounded-full transition-all hover:scale-110 ${
                    isHoje 
                      ? 'bg-[#3E5BFF] text-white shadow-[0_0_10px_rgba(62,91,255,0.4)]' 
                      : 'text-[var(--ws-text-2)] hover:text-[var(--ws-text-1)] hover:bg-black/5 dark:hover:bg-white/10'
                  }`}
                >
                  {format(day, 'd')}
                </button>
              </div>

              {/* LISTA DE EVENTOS (PILLS) */}
              <div className="flex flex-col gap-1 mt-1 px-1">
                {displayAgs.map(ag => {
                  const agenda = agendas.find(a => a.id === ag.agenda_id)
                  const color = agenda?.cor || 'var(--ws-blue)'
                  const isCancelado = ag.status === 'cancelado'

                  return (
                    <button
                      key={ag.id}
                      onClick={() => onAgendamentoClick(ag)}
                      style={{ 
                        background: `${color}25`, // 15% opacity
                        borderLeft: `2px solid ${color}` 
                      }}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-[4px] text-left transition-all hover:brightness-125 hover:translate-x-0.5 pointer-events-auto ${
                        isCancelado ? 'grayscale opacity-50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-1 flex-1 min-w-0">
                        {ag.origem === 'agente' && <Bot size={10} className="text-[var(--ws-gold)] shrink-0" />}
                        {ag.origem === 'api' && <Code2 size={10} className="text-[#00F5FF] shrink-0" />}
                        <span className="text-[10px] font-bold text-white/90 truncate">
                          {ag.cliente_nome}
                        </span>
                      </div>
                      <span className="text-[9px] text-white/40 font-bold shrink-0">
                        {format(parseISO(ag.data_hora_inicio), 'H:mm')}
                      </span>
                    </button>
                  )
                })}

                {moreCount > 0 && (
                  <button 
                    onClick={() => onDiaClick(day)}
                    className="text-[10px] font-bold text-[var(--ws-gold)] mt-0.5 px-2 py-0.5 rounded hover:bg-[var(--ws-gold)]/10 transition-colors text-left"
                  >
                    + {moreCount} mais...
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
      
      {/* BRILHO TOPO */}
      <div style={{ position:'absolute',top:0,left:0,right:0,height:1, background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)', pointerEvents:'none' }} />
    </div>
  )
}
