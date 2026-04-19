'use client'

import React, { useState, useEffect } from 'react'
import { X, Trash2, CheckCircle2, HelpCircle, Loader2 } from 'lucide-react'
import { Agenda, AgendaCor, AgendaTipo } from '@/types/agenda'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface ModalAgendaProps {
  aberto: boolean
  onFechar: () => void
  agendaInicial?: Agenda | null
  onSalvar: (agenda: Partial<Agenda>) => void
  onDeletar?: (id: string) => void
}

const CORES_DISPONIVEIS: { hex: AgendaCor; nome: string }[] = [
  { hex: '#3E5BFF', nome: 'Azul' },
  { hex: '#0fa856', nome: 'Verde' },
  { hex: '#FF5C8D', nome: 'Coral' },
  { hex: '#7A5AF8', nome: 'Roxo' },
  { hex: '#00b8c8', nome: 'Cyan' },
  { hex: 'var(--ws-gold)', nome: 'Dourado' },
  { hex: '#FF8C00', nome: 'Laranja' },
  { hex: '#6B7280', nome: 'Cinza' },
]

const FUSOS_HORARIOS = [
  { value: 'America/Sao_Paulo', label: 'Horário de Brasília (GMT-3)' },
  { value: 'America/Rio_Branco', label: 'Horário do Acre (GMT-5)' },
  { value: 'America/Noronha', label: 'Horário de Fernando de Noronha (GMT-2)' },
  { value: 'America/Manaus', label: 'Horário de Manaus (GMT-4)' },
]

export function ModalAgenda({
  aberto,
  onFechar,
  agendaInicial,
  onSalvar,
  onDeletar,
}: ModalAgendaProps) {
  const [nome, setNome] = useState('')
  const [tipo, setTipo] = useState<AgendaTipo>('profissional')
  const [cor, setCor] = useState<AgendaCor>('#3E5BFF')
  const [capacidade, setCapacidade] = useState(1)
  const [fuso, setFuso] = useState('America/Sao_Paulo')
  const [webhook, setWebhook] = useState('')
  const [ativo, setAtivo] = useState(true)
  const [confirmandoDelecao, setConfirmandoDelecao] = useState(false)
  const [salvando, setSalvando] = useState(false)

  // Sincronizar campos quando o modal abre ou a agenda inicial muda
  useEffect(() => {
    if (aberto) {
      if (agendaInicial) {
        setNome(agendaInicial.nome)
        setTipo(agendaInicial.tipo)
        setCor(agendaInicial.cor)
        setCapacidade(agendaInicial.capacidade_simultanea)
        setFuso(agendaInicial.fuso_horario)
        setWebhook(agendaInicial.webhook_url || '')
        setAtivo(agendaInicial.ativo)
      } else {
        // Reset para nova agenda
        setNome('')
        setTipo('profissional')
        setCor('#3E5BFF')
        setCapacidade(1)
        setFuso('America/Sao_Paulo')
        setWebhook('')
        setAtivo(true)
      }
      setConfirmandoDelecao(false)
    }
  }, [aberto, agendaInicial])

  if (!aberto) return null

  const handleSalvar = async () => {
    if (!nome) {
      toast.error('O nome da agenda é obrigatório')
      return
    }

    setSalvando(true)
    try {
      await onSalvar({
        nome,
        tipo,
        cor,
        capacidade_simultanea: capacidade,
        fuso_horario: fuso,
        webhook_url: webhook || undefined,
        ativo,
      })
      toast.success(agendaInicial ? 'Agenda atualizada!' : 'Agenda criada com sucesso!')
      onFechar()
    } catch (error) {
      toast.error('Erro ao salvar agenda')
    } finally {
      setSalvando(false)
    }
  }

  const handleDeletar = () => {
    if (confirmandoDelecao && agendaInicial?.id && onDeletar) {
      onDeletar(agendaInicial.id)
      onFechar()
    } else {
      setConfirmandoDelecao(true)
    }
  }

  const webhookValido = webhook.startsWith('http://') || webhook.startsWith('https://')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onFechar}
      />

      {/* Modal Container */}
      <div 
        className="relative w-full max-w-[520px] max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200"
        style={{
          background: 'var(--ws-glass-bg)',
          border: '1px solid var(--ws-glass-border)',
          borderRadius: 'var(--ws-radius-xl)',
          backdropFilter: 'blur(16px)',
          boxShadow: 'var(--ws-glass-shadow)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Linha de brilho no topo */}
        <div style={{ position:'absolute',top:0,left:0,right:0,height:1, background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.8),transparent)', pointerEvents:'none' }} />

        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-white/5">
          <div>
            <h2 className="text-xl font-semibold text-white tracking-tight">
              {agendaInicial ? 'Editar Agenda' : 'Nova Agenda'}
            </h2>
            <p className="text-xs text-white/50 mt-1">
              {agendaInicial ? 'Ajuste as configurações desta agenda' : 'Configure uma nova agenda para agendamentos'}
            </p>
          </div>
          <button 
            onClick={onFechar}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* Nome da Agenda */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
              Nome da Agenda <span className="text-red-400">*</span>
            </label>
            <Input 
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Dr. Rafael, Sala 01"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11"
            />
            <p className="text-[10px] text-white/40">Nome visível no calendário. Ex: Dr. Rafael, Sala 01</p>
          </div>

          {/* Tipo de Agenda */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
              Tipo <span className="text-red-400">*</span>
            </label>
            <Select value={tipo} onValueChange={(v: any) => setTipo(v)}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white h-11">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent className="bg-[#0E142A] border-white/10 text-white">
                <SelectItem value="profissional">Profissional</SelectItem>
                <SelectItem value="sala">Sala</SelectItem>
                <SelectItem value="equipamento">Equipamento</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Cor da Agenda */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
              Cor da Agenda <span className="text-red-400">*</span>
            </label>
            <div className="flex flex-wrap gap-3">
              {CORES_DISPONIVEIS.map((item) => (
                <button
                  key={item.hex}
                  onClick={() => setCor(item.hex)}
                  title={item.nome}
                  className={`w-8 h-8 rounded-full transition-all duration-200 relative ${
                    cor === item.hex ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-[#0E142A]' : 'hover:scale-105 opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: item.hex }}
                >
                  {cor === item.hex && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full shadow-lg" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-white/40">Cor usada para identificar esta agenda no calendário</p>
          </div>

          {/* Capacidade e Fuso Horário em Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Capacidade <span className="text-red-400">*</span>
              </label>
              <Input 
                type="number"
                min={1}
                max={10}
                value={capacidade}
                onChange={(e) => setCapacidade(parseInt(e.target.value) || 1)}
                className="bg-white/5 border-white/10 text-white h-11"
              />
              <p className="text-[10px] text-white/40">Agendamentos simultâneos</p>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Fuso Horário
              </label>
              <Select value={fuso} onValueChange={setFuso}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white h-11">
                  <SelectValue placeholder="Selecione o fuso" />
                </SelectTrigger>
                <SelectContent className="bg-[#0E142A] border-white/10 text-white">
                  {FUSOS_HORARIOS.map((f) => (
                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Webhook */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Webhook de Agendamento
              </label>
              {webhookValido && (
                <Badge className="bg-emerald-500/20 text-emerald-400 border-none px-2 py-0 h-5 text-[9px] flex items-center gap-1">
                  <CheckCircle2 size={10} /> Webhook configurado
                </Badge>
              )}
            </div>
            <Input 
              value={webhook}
              onChange={(e) => setWebhook(e.target.value)}
              placeholder="https://sua-url-de-callback.com/webhook"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11"
            />
            <p className="text-[10px] text-white/40">
              Enviamos os dados automaticamente para esta URL quando um agendamento for criado ou alterado.
            </p>
          </div>

          {/* Status Ativo */}
          <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${ativo ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-white/20'}`} />
              <div>
                <p className="text-sm font-medium text-white">Status da Agenda</p>
                <p className="text-[10px] text-white/40">Disponível para novos agendamentos</p>
              </div>
            </div>
            
            {/* Custom Switch Implementation */}
            <button
              onClick={() => setAtivo(!ativo)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 outline-none ${
                ativo ? 'bg-indigo-600' : 'bg-white/20'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  ativo ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-white/5 flex items-center justify-between gap-3">
          <div>
            {agendaInicial && onDeletar && (
              <button
                onClick={handleDeletar}
                className={`flex items-center gap-2 text-xs font-medium transition-all ${
                  confirmandoDelecao ? 'text-white bg-red-500 px-3 py-1.5 rounded-lg' : 'text-red-400 hover:text-red-300'
                }`}
              >
                {confirmandoDelecao ? (
                  <>Confirmar Exclusão?</>
                ) : (
                  <>
                    <Trash2 size={14} />
                    Excluir Agenda
                  </>
                )}
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={onFechar}
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSalvar}
              disabled={salvando}
              className="px-8 font-semibold text-white shadow-lg shadow-indigo-500/20"
              style={{
                background: 'linear-gradient(135deg, var(--ws-blue), var(--ws-purple))',
                border: 'none',
                borderRadius: 'var(--ws-radius-md)'
              }}
            >
              {salvando ? (
                <div className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Salvando...
                </div>
              ) : (
                'Salvar Alterações'
              )}
            </Button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  )
}
