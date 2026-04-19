'use client'

import React, { useState, useEffect } from 'react'
import { 
  Check, 
  ChevronDown, 
  HelpCircle, 
  Info, 
  Save, 
  Clock, 
  Coffee,
  Globe
} from 'lucide-react'
import { Agenda, HorarioAgenda, DiaSemana, DIAS_SEMANA_LABELS } from '@/types/agenda'
import { useAgendas } from '@/hooks/use-agendas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

const DURACAO_OPTIONS = [
  { value: '15', label: '15 min' },
  { value: '30', label: '30 min' },
  { value: '45', label: '45 min' },
  { value: '60', label: '1h' },
  { value: '90', label: '1h 30min' },
  { value: '120', label: '2h' },
]

export function ConfigHorarios() {
  const { agendas, getHorariosAgenda, salvarHorarios, editarAgenda } = useAgendas()
  
  const [selectedAgendaId, setSelectedAgendaId] = useState<string>('')
  const [horariosLocal, setHorariosLocal] = useState<HorarioAgenda[]>([])
  const [webhookUrl, setWebhookUrl] = useState('')
  const [capacidade, setCapacidade] = useState(1)
  const [isSaving, setIsSaving] = useState(false)

  // Inicializar com a primeira agenda
  useEffect(() => {
    if (agendas.length > 0 && !selectedAgendaId) {
      const first = agendas[0]
      setSelectedAgendaId(first.id)
      setWebhookUrl(first.webhook_url || '')
      setCapacidade(first.capacidade_simultanea || 1)
    }
  }, [agendas, selectedAgendaId])

  // Carregar horários quando a agenda muda
  useEffect(() => {
    if (selectedAgendaId) {
      const h = getHorariosAgenda(selectedAgendaId)
      setHorariosLocal(h)
      
      const agenda = agendas.find(a => a.id === selectedAgendaId)
      if (agenda) {
        setWebhookUrl(agenda.webhook_url || '')
        setCapacidade(agenda.capacidade_simultanea || 1)
      }
    }
  }, [selectedAgendaId, getHorariosAgenda, agendas])

  const handleToggleDia = (dia: DiaSemana) => {
    setHorariosLocal(prev => prev.map(h => 
      h.dia_semana === dia ? { ...h, ativo: !h.ativo } : h
    ))
  }

  const handleUpdateHorario = (dia: DiaSemana, updates: Partial<HorarioAgenda>) => {
    setHorariosLocal(prev => prev.map(h => 
      h.dia_semana === dia ? { ...h, ...updates } : h
    ))
  }

  const handleSave = async () => {
    setIsSaving(true)
    // 1. Salvar horários
    await salvarHorarios(selectedAgendaId, horariosLocal)
    // 2. Salvar configurações da agenda (webhook, capacidade)
    await editarAgenda(selectedAgendaId, {
      webhook_url: webhookUrl,
      capacidade_simultanea: capacidade
    })
    setIsSaving(false)
  }

  const currentAgenda = agendas.find(a => a.id === selectedAgendaId)

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Top Bar: Selector & Save */}
      <div 
        className="flex items-center justify-between p-4 relative overflow-hidden"
        style={{
          background: 'var(--ws-glass-bg)',
          border: '1px solid var(--ws-glass-border)',
          borderRadius: 'var(--ws-radius-lg)',
          backdropFilter: 'blur(16px)',
          boxShadow: 'var(--ws-glass-shadow)'
        }}
      >
        <div style={{ position:'absolute',top:0,left:0,right:0,height:1, background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.8),transparent)', pointerEvents:'none' }} />
        
        <div className="flex items-center gap-4">
          <Select value={selectedAgendaId} onValueChange={setSelectedAgendaId}>
            <SelectTrigger className="w-[300px] bg-navy-900/40 border-white/10">
              <SelectValue placeholder="Selecione uma agenda" />
            </SelectTrigger>
            <SelectContent className="bg-[#0E142A] border-white/10 text-white">
              {agendas.map(a => (
                <SelectItem key={a.id} value={a.id} className="focus:bg-white/10 focus:text-white">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: a.cor }} />
                    <span>{a.nome}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="gap-2 px-6"
          style={{ 
            background: 'linear-gradient(135deg, var(--ws-blue), var(--ws-purple))',
            borderRadius: 'var(--ws-radius-md)',
            border: 'none'
          }}
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={18} />
          )}
          Salvar Alterações
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Lista de dias */}
        {(['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'] as DiaSemana[]).map((dia) => {
          const config = horariosLocal.find(h => h.dia_semana === dia) || {
            dia_semana: dia,
            ativo: false,
            hora_inicio: '08:00',
            hora_fim: '18:00',
            duracao_slot_minutos: 60,
            tem_almoco: false
          } as HorarioAgenda

          return (
            <div 
              key={dia}
              className={`relative p-4 transition-all duration-300 ${!config.ativo ? 'opacity-50' : ''}`}
              style={{
                background: 'var(--ws-glass-bg)',
                border: '1px solid var(--ws-glass-border)',
                borderRadius: 'var(--ws-radius-lg)',
                backdropFilter: 'blur(16px)',
                boxShadow: 'var(--ws-glass-shadow)'
              }}
            >
               <div style={{ position:'absolute',top:0,left:0,right:0,height:1, background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)', pointerEvents:'none' }} />
               
               <div className="flex flex-wrap items-center gap-6">
                 {/* Switch Manual */}
                 <div 
                   onClick={() => handleToggleDia(dia)}
                   className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-colors duration-200 ${config.ativo ? 'bg-[#0fa856]' : 'bg-white/10'}`}
                 >
                   <div className={`w-3 h-3 bg-white rounded-full transition-transform duration-200 ${config.ativo ? 'translate-x-5' : 'translate-x-0'}`} />
                 </div>

                 <div className="w-24">
                   <span className="text-sm font-semibold text-white uppercase tracking-wider">
                     {DIAS_SEMANA_LABELS[dia]}
                   </span>
                 </div>

                 {!config.ativo ? (
                   <span className="text-xs text-white/40 font-medium uppercase tracking-widest">Fechado</span>
                 ) : (
                   <>
                    <div className="flex items-center gap-3">
                      <Input 
                        type="time" 
                        value={config.hora_inicio} 
                        onChange={e => handleUpdateHorario(dia, { hora_inicio: e.target.value })}
                        className="w-24 h-9 bg-black/20 border-white/10 text-white"
                      />
                      <span className="text-xs text-white/40">até</span>
                      <Input 
                        type="time" 
                        value={config.hora_fim} 
                        onChange={e => handleUpdateHorario(dia, { hora_fim: e.target.value })}
                        className="w-24 h-9 bg-black/20 border-white/10 text-white"
                      />
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <span className="text-[10px] text-white/40 uppercase font-bold tracking-tighter">Duração:</span>
                      <Select 
                        value={String(config.duracao_slot_minutos)} 
                        onValueChange={val => handleUpdateHorario(dia, { duracao_slot_minutos: Number(val) })}
                      >
                        <SelectTrigger className="w-28 h-9 bg-black/20 border-white/10 text-white text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0E142A] border-white/10 text-white">
                          {DURACAO_OPTIONS.map(opt => (
                            <SelectItem key={opt.value} value={opt.value} className="focus:bg-white/10 focus:text-white">
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-3 ml-auto">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-white/40 uppercase font-bold">Almoço</span>
                        <div 
                          onClick={() => handleUpdateHorario(dia, { tem_almoco: !config.tem_almoco })}
                          className={`w-8 h-4 rounded-full p-0.5 cursor-pointer transition-colors duration-200 ${config.tem_almoco ? 'bg-[var(--ws-gold)]' : 'bg-white/10'}`}
                        >
                          <div className={`w-3 h-3 bg-white rounded-full transition-transform duration-200 ${config.tem_almoco ? 'translate-x-4' : 'translate-x-0'}`} />
                        </div>
                      </div>

                      {config.tem_almoco && (
                        <div className="flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
                          <Input 
                            type="time" 
                            value={config.almoco_inicio} 
                            onChange={e => handleUpdateHorario(dia, { almoco_inicio: e.target.value })}
                            className="w-20 h-8 bg-black/20 border-white/5 text-white text-[11px]"
                          />
                          <span className="text-[10px] text-white/20">—</span>
                          <Input 
                            type="time" 
                            value={config.almoco_fim} 
                            onChange={e => handleUpdateHorario(dia, { almoco_fim: e.target.value })}
                            className="w-20 h-8 bg-black/20 border-white/5 text-white text-[11px]"
                          />
                        </div>
                      )}
                    </div>
                   </>
                 )}
               </div>
            </div>
          )
        })}
      </div>

      {/* Capacidade e Webhook */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Capacidade */}
        <div 
          className="relative p-6"
          style={{
            background: 'var(--ws-glass-bg)',
            border: '1px solid var(--ws-glass-border)',
            borderRadius: 'var(--ws-radius-lg)',
            backdropFilter: 'blur(16px)',
            boxShadow: 'var(--ws-glass-shadow)'
          }}
        >
          <div style={{ position:'absolute',top:0,left:0,right:0,height:1, background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)', pointerEvents:'none' }} />
          
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              Capacidade de Atendimento Simultâneo
              <Info size={14} className="text-white/40 cursor-help" />
            </h3>
            <Badge className="bg-[var(--ws-gold)]/10 text-[var(--ws-gold)] border-[var(--ws-gold)]/20 text-[10px]">
              POR HORÁRIO
            </Badge>
          </div>

          <Select value={String(capacidade)} onValueChange={val => setCapacidade(Number(val))}>
            <SelectTrigger className="w-full bg-black/20 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#0E142A] border-white/10 text-white">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                <SelectItem key={n} value={String(n)} className="focus:bg-white/10 focus:text-white">
                  {n} {n === 1 ? 'cliente' : 'clientes'} simultâneos
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <p className="mt-3 text-[11px] text-white/40 leading-relaxed italic">
            Define quantos agendamentos podem ocorrer no mesmo slot de tempo para esta agenda.
          </p>
        </div>

        {/* Webhook */}
        <div 
          className="relative p-6"
          style={{
            background: 'var(--ws-glass-bg)',
            border: '1px solid var(--ws-glass-border)',
            borderRadius: 'var(--ws-radius-lg)',
            backdropFilter: 'blur(16px)',
            boxShadow: 'var(--ws-glass-shadow)'
          }}
        >
          <div style={{ position:'absolute',top:0,left:0,right:0,height:1, background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)', pointerEvents:'none' }} />
          
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              Webhook de Agendamento
              <Globe size={14} className="text-white/40" />
            </h3>
            {webhookUrl && (
              <Badge className="bg-[#0fa856]/10 text-[#0fa856] border-[#0fa856]/20 text-[10px] animate-pulse">
                CONFIGURADO
              </Badge>
            )}
          </div>

          <Input 
            placeholder="https://sua-api.com/agendamento"
            value={webhookUrl}
            onChange={e => setWebhookUrl(e.target.value)}
            className="w-full bg-black/20 border-white/10 text-white placeholder:text-white/20"
          />
          
          <p className="mt-3 text-[11px] text-white/40 leading-relaxed">
            Disparado automaticamente a cada novo agendamento ou atualização.
          </p>
          
          {webhookUrl && (
             <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#0fa856] font-medium">
               <Check size={12} />
               Será disparado em novos agendamentos
             </div>
          )}
        </div>
      </div>
    </div>
  )
}
