'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { LembreteConfig } from '@/types/agenda'
import { MOCK_LEMBRETES } from '@/lib/mock-agenda'

export function useLembretes() {
  const [lembretes, setLembretes] = useState<LembreteConfig[]>(MOCK_LEMBRETES)
  const [loading, setLoading] = useState(false)

  const listarLembretes = useCallback((agendaId: string | null) => {
    // Se agendaId for null, busca os globais. Se for uma ID, busca os específicos daquela agenda + globais?
    // User disse: "Lembretes são configurados por agenda. Opção 'Padrão (todas)' para config global."
    // Então filtramos por agenda_id exato.
    return lembretes.filter(l => l.agenda_id === agendaId)
  }, [lembretes])

  const salvarLembrete = useCallback(async (lembrete: Partial<LembreteConfig>) => {
    setLoading(true)
    try {
      await new Promise(r => setTimeout(r, 500))
      
      if (lembrete.id) {
        // Editar
        setLembretes(prev => prev.map(l => l.id === lembrete.id ? { ...l, ...lembrete } as LembreteConfig : l))
        toast.success('Lembrete atualizado!')
      } else {
        // Criar
        const novo: LembreteConfig = {
          id: `lem-${Date.now()}`,
          ativo: true,
          canal: 'whatsapp',
          dias_antes: 1,
          mensagem_template: '',
          tem_midia: false,
          ordem: lembretes.length + 1,
          agenda_id: null,
          ...lembrete
        } as LembreteConfig
        setLembretes(prev => [...prev, novo])
        toast.success('Lembrete criado com sucesso!')
      }
      return true
    } catch (error) {
      toast.error('Erro ao salvar lembrete.')
      return false
    } finally {
      setLoading(false)
    }
  }, [lembretes])

  const excluirLembrete = useCallback(async (id: string) => {
    setLoading(true)
    try {
      await new Promise(r => setTimeout(r, 400))
      setLembretes(prev => prev.filter(l => l.id !== id))
      toast.success('Lembrete removido.')
      return true
    } catch (error) {
      toast.error('Erro ao excluir lembrete.')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const alternarStatus = useCallback(async (id: string) => {
    setLembretes(prev => prev.map(l => l.id === id ? { ...l, ativo: !l.ativo } : l))
    toast.info('Status do lembrete alterado.')
  }, [])

  return {
    lembretes,
    loading,
    listarLembretes,
    salvarLembrete,
    excluirLembrete,
    alternarStatus
  }
}
