'use client'

import React from 'react'
import { 
  Search, 
  ExternalLink, 
  MoreHorizontal, 
  Calendar,
  MessageSquare,
  Clock,
  ChevronRight
} from 'lucide-react'
import { RecorrenciaLead } from '@/types/followup'
import { format, formatDistanceToNow, parseISO, isAfter, differenceInDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from '@/components/ui/badge'

interface RecorrenciaListaProps {
  leads: RecorrenciaLead[]
  onLeadClick: (lead: RecorrenciaLead) => void
}

export function RecorrenciaLista({ leads, onLeadClick }: RecorrenciaListaProps) {
  return (
    <div style={{
      background: 'var(--ws-glass-bg)',
      border: '1px solid var(--ws-glass-border)',
      borderRadius: 'var(--ws-radius-lg)',
      backdropFilter: 'blur(16px)',
      boxShadow: 'var(--ws-glass-shadow)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Linha de brilho no topo */}
      <div style={{ position:'absolute',top:0,left:0,right:0,height:1,
        background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.8),transparent)',
        pointerEvents:'none' }} />

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--ws-glass-border)', background: 'rgba(255,255,255,0.02)' }}>
              <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Lead</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Serviço</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Agenda</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Compareceu em</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Início Recorrência</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold uppercase">Status</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold text-center">Tentativa</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Próx. Envio</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--ws-glass-border)]">
            {leads.map((lead) => {
              const dataComp = parseISO(lead.data_comparecimento)
              const dataTrigger = parseISO(lead.data_trigger_programada)
              const hoje = new Date()
              const ehFuturo = isAfter(dataTrigger, hoje)
              const diasPara = differenceInDays(dataTrigger, hoje)

              const maxTent = 5
              const tentAtual = lead.tentativa_atual || 0

              return (
                <tr 
                  key={lead.id} 
                  className="hover:bg-white/5 transition-colors group"
                >
                  {/* LEAD */}
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[var(--ws-text-1)]">{lead.nome || 'Sem nome'}</span>
                      <span className="text-xs text-[var(--ws-text-2)]">{lead.telefone}</span>
                    </div>
                  </td>

                  {/* SERVIÇO */}
                  <td className="px-4 py-4">
                    <span className="text-[13px] text-[var(--ws-text-1)] font-medium">
                      {lead.interesse}
                    </span>
                  </td>

                  {/* AGENDA */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: 'var(--ws-blue)' }} />
                      <span className="text-xs text-[var(--ws-text-2)]">{lead.agenda_nome}</span>
                    </div>
                  </td>

                  {/* COMPARECEU EM */}
                  <td className="px-4 py-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex flex-col cursor-help">
                            <span className="text-xs text-[var(--ws-text-1)]">{format(dataComp, 'dd/MM/yyyy')}</span>
                            <span className="text-[10px] text-[var(--ws-text-2)]">há {formatDistanceToNow(dataComp, { locale: ptBR })}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          Data exata do comparecimento
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </td>

                  {/* INÍCIO RECORRÊNCIA */}
                  <td className="px-4 py-4">
                    {ehFuturo ? (
                      <Badge variant="outline" style={{ 
                        borderRadius: '9999px', 
                        fontSize: '10px', 
                        fontWeight: 600,
                        borderColor: 'var(--gold)',
                        color: 'var(--gold)',
                        background: 'rgba(201, 168, 76, 0.1)'
                      }}>
                        Em {diasPara} dias
                      </Badge>
                    ) : (
                      <div className="flex flex-col">
                        <span className="text-xs text-[var(--ws-text-1)]">{format(dataTrigger, 'dd/MM/yyyy')}</span>
                        <span className="text-[10px] text-[var(--ws-green)] font-medium">Iniciado</span>
                      </div>
                    )}
                  </td>

                  {/* STATUS */}
                  <td className="px-4 py-4">
                    <StatusPill status={lead.status} />
                  </td>

                  {/* TENTATIVA */}
                  <td className="px-4 py-4">
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <div style={{ display: 'flex', gap: 3 }}>
                        {Array.from({ length: maxTent }).map((_, i) => (
                          <div
                            key={i}
                            style={{
                              width: 8, height: 8, borderRadius: '50%',
                              background: i < tentAtual
                                ? (i < 2 ? 'var(--ws-blue)' : i < 4 ? 'var(--ws-gold)' : 'var(--ws-coral)')
                                : 'rgba(14,20,42,0.12)',
                              border: i < tentAtual ? 'none' : '1px solid rgba(14,20,42,0.15)',
                            }}
                          />
                        ))}
                      </div>
                      <span style={{ fontSize: 10, color: 'var(--ws-text-3)' }}>
                        {tentAtual}/{maxTent}
                      </span>
                    </div>
                  </td>

                  {/* PRÓX. ENVIO */}
                  <td className="px-4 py-4">
                    {lead.proximo_envio ? (
                      <div className="flex items-center gap-1.5 text-xs text-[var(--ws-text-2)]">
                        <Clock size={12} className="text-[var(--gold)]" />
                        {format(parseISO(lead.proximo_envio), "dd/MM 'às' HH:mm")}
                      </div>
                    ) : (
                      <span className="text-xs text-[var(--ws-text-3)]">—</span>
                    )}
                  </td>

                  {/* AÇÕES */}
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onLeadClick(lead)
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--ws-text-3)',
                        padding: '4px 8px',
                        borderRadius: 'var(--ws-radius-sm)',
                        transition: 'all 0.18s ease',
                        display: 'flex', alignItems: 'center',
                        float: 'right'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(62,91,255,0.08)'
                        e.currentTarget.style.color = 'var(--ws-blue)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = 'var(--ws-text-3)'
                      }}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StatusPill({ status }: { status: RecorrenciaLead['status'] }) {
  const configs = {
    aguardando: {
      label: 'Aguardando',
      bg: 'rgba(201, 168, 76, 0.12)',
      color: 'var(--gold)',
      pulse: false
    },
    ativo: {
      label: 'Ativo',
      bg: 'var(--ws-green-soft)',
      color: 'var(--ws-green)',
      pulse: true
    },
    concluido: {
      label: 'Concluído',
      bg: 'var(--ws-blue-soft)',
      color: 'var(--ws-blue)',
      pulse: false
    },
    cancelado: {
      label: 'Cancelado',
      bg: 'rgba(120, 120, 120, 0.1)',
      color: '#888',
      pulse: false
    }
  }

  const cfg = configs[status]

  return (
    <div 
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      {cfg.pulse && (
        <span className="relative flex h-2 w-2 mr-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: cfg.color }} />
          <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: cfg.color }} />
        </span>
      )}
      {cfg.label}
    </div>
  )
}
