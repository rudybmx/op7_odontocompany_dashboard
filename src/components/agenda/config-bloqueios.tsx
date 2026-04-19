'use client'

import React, { useState, useMemo } from 'react'
import { 
  Search, 
  Plus, 
  X, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  Trash2, 
  Pencil,
  Info 
} from 'lucide-react'
import { Bloqueio, Agenda, STATUS_COLORS } from '@/types/agenda'
import { useAgendas } from '@/hooks/use-agendas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function ConfigBloqueios() {
  const { 
    agendas, 
    bloqueios, 
    adicionarBloqueio, 
    removerBloqueio, 
    loading 
  } = useAgendas()
  
  const [busca, setBusca] = useState('')
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  
  // Estado do Form
  const [form, setForm] = useState({
    agenda_id: 'global',
    inicio: '',
    fim: '',
    tipo: 'reuniao' as Bloqueio['tipo'],
    motivo: '',
    observacoes: ''
  })

  const filteredBloqueios = useMemo(() => {
    if (!busca) return bloqueios
    const q = busca.toLowerCase()
    return bloqueios.filter(b => b.motivo.toLowerCase().includes(q))
  }, [bloqueios, busca])

  const handleAdd = async () => {
    if (!form.inicio || !form.fim || !form.motivo) return
    
    await adicionarBloqueio({
      agenda_id: form.agenda_id === 'global' ? null : form.agenda_id,
      inicio: new Date(form.inicio).toISOString(),
      fim: new Date(form.fim).toISOString(),
      tipo: form.tipo,
      motivo: form.motivo
    })
    
    setIsPanelOpen(false)
    setForm({
      agenda_id: 'global',
      inicio: '',
      fim: '',
      tipo: 'reuniao',
      motivo: '',
      observacoes: ''
    })
  }

  const getAgendaColor = (id: string | null) => {
    if (!id) return '#6B7280'
    return agendas.find(a => a.id === id)?.cor || '#6B7280'
  }

  const getAgendaNome = (id: string | null) => {
    if (!id) return 'Global da Clínica'
    return agendas.find(a => a.id === id)?.nome || 'Agenda Removida'
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 relative min-h-[600px]">
      {/* Search & Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
          <Input 
            placeholder="Buscar por motivo..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/20"
          />
        </div>
        
        <Button 
          onClick={() => setIsPanelOpen(true)}
          className="gap-2"
          style={{ 
            background: 'linear-gradient(135deg, var(--ws-blue), var(--ws-purple))',
            borderRadius: 'var(--ws-radius-md)',
            border: 'none'
          }}
        >
          <Plus size={18} />
          Novo Bloqueio
        </Button>
      </div>

      {/* Table */}
      <div 
        className="relative overflow-hidden"
        style={{
          background: 'var(--ws-glass-bg)',
          border: '1px solid var(--ws-glass-border)',
          borderRadius: 'var(--ws-radius-lg)',
          backdropFilter: 'blur(16px)',
          boxShadow: 'var(--ws-glass-shadow)'
        }}
      >
        <div style={{ position:'absolute',top:0,left:0,right:0,height:1, background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)', pointerEvents:'none' }} />
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">Intervalo</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">Agenda</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">Motivo</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest text-center">Criado em</th>
                <th className="px-6 py-4 text-[10px] font-bold text-white/40 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredBloqueios.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-white/20 italic">
                    Nenhum bloqueio encontrado.
                  </td>
                </tr>
              ) : (
                filteredBloqueios.map((b) => (
                  <tr key={b.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-white">
                          {format(parseISO(b.inicio), "dd/MM/yyyy HH:mm")}
                        </span>
                        <span className="text-[11px] text-white/40">
                          até {format(parseISO(b.fim), "dd/MM/yyyy HH:mm")}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge 
                        variant="outline" 
                        className="text-[10px] font-semibold border-white/10 px-2 py-0.5 whitespace-nowrap"
                        style={{ 
                          color: getAgendaColor(b.agenda_id),
                          backgroundColor: `${getAgendaColor(b.agenda_id)}15`
                        }}
                      >
                        {getAgendaNome(b.agenda_id)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-white/80">{b.motivo}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-[11px] text-white/40">
                        {format(parseISO(b.created_at), "dd/MM/yy")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 h-8 w-8 rounded-md bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all">
                          <Pencil size={14} />
                        </button>
                        <button 
                          onClick={() => removerBloqueio(b.id)}
                          className="p-2 h-8 w-8 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pane Lateral (Sliding Panel) */}
      {isPanelOpen && (
        <div className="absolute inset-0 z-50">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsPanelOpen(false)}
          />
          
          {/* Panel content */}
          <div 
            className="absolute top-0 left-0 bottom-0 w-[480px] bg-[#0E142A] border-r border-white/10 shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-navy-900/40">
              <div>
                <h2 className="text-xl font-bold text-white">Novo Bloqueio</h2>
                <p className="text-xs text-white/40 mt-1 uppercase tracking-widest">Impedir agendamentos em um período</p>
              </div>
              <button 
                onClick={() => setIsPanelOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form content (Glass Card pattern) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
              <div 
                className="relative p-6 space-y-6"
                style={{
                  background: 'var(--ws-glass-bg)',
                  border: '1px solid var(--ws-glass-border)',
                  borderRadius: 'var(--ws-radius-lg)',
                  backdropFilter: 'blur(16px)',
                  boxShadow: 'var(--ws-glass-shadow)'
                }}
              >
                <div style={{ position:'absolute',top:0,left:0,right:0,height:1, background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)', pointerEvents:'none' }} />
                
                {/* Agenda */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Agenda</label>
                  <Select value={form.agenda_id} onValueChange={val => setForm({...form, agenda_id: val})}>
                    <SelectTrigger className="bg-black/20 border-white/10 text-white">
                      <SelectValue placeholder="Selecione a agenda" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0E142A] border-white/10 text-white">
                      <SelectItem value="global" className="focus:bg-white/10 focus:text-white">Global da Clínica</SelectItem>
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

                {/* Intervalo */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                      <Calendar size={10} /> Data/Hora Início *
                    </label>
                    <Input 
                      type="datetime-local" 
                      value={form.inicio}
                      onChange={e => setForm({...form, inicio: e.target.value})}
                      className="bg-black/20 border-white/10 text-white [color-scheme:dark]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                      <Clock size={10} /> Data/Hora Fim *
                    </label>
                    <Input 
                      type="datetime-local" 
                      value={form.fim}
                      onChange={e => setForm({...form, fim: e.target.value})}
                      className="bg-black/20 border-white/10 text-white [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* Motivo */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Motivo Principal *</label>
                  <Select value={form.tipo} onValueChange={(val: Bloqueio['tipo']) => setForm({...form, tipo: val})}>
                    <SelectTrigger className="bg-black/20 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0E142A] border-white/10 text-white">
                      <SelectItem value="reuniao">Reunião</SelectItem>
                      <SelectItem value="feriado">Feriado</SelectItem>
                      <SelectItem value="agenda_cheia">Agenda Cheia</SelectItem>
                      <SelectItem value="manutencao">Manutenção</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Descrição do Motivo */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Descrição detalhada</label>
                  <Input 
                    placeholder="Ex: Reunião mensal de alinhamento..."
                    value={form.motivo}
                    onChange={e => setForm({...form, motivo: e.target.value})}
                    className="bg-black/20 border-white/10 text-white placeholder:text-white/20"
                  />
                </div>

                {/* Observações */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Observações adicionais</label>
                  <textarea 
                    rows={4}
                    value={form.observacoes}
                    onChange={e => setForm({...form, observacoes: e.target.value})}
                    placeholder="Notas internas..."
                    className="w-full rounded-md bg-black/20 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-white/20"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-navy-900/40">
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setIsPanelOpen(false)}
                  className="flex-1 bg-transparent border-white/10 text-white hover:bg-white/5"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleAdd}
                  className="flex-1 font-bold shadow-lg"
                  style={{ 
                    background: 'linear-gradient(135deg, var(--ws-blue), var(--ws-purple))',
                    borderRadius: 'var(--ws-radius-md)',
                    border: 'none'
                  }}
                >
                  Confirmar Bloqueio
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
