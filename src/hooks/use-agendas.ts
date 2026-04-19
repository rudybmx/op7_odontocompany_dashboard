'use client'

import { useState, useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import { 
  Agenda, 
  AgendaCor, 
  AgendaTipo, 
  HorarioAgenda, 
  Bloqueio,
  DiaSemana 
} from '@/types/agenda'
import { MOCK_AGENDAS, MOCK_HORARIOS, MOCK_BLOQUEIOS } from '@/lib/mock-agenda'

// ─── Tipos de entrada ─────────────────────────────────────────────────────────
export interface CriarAgendaInput {
  nome: string
  tipo: AgendaTipo
  cor: AgendaCor
  capacidade_simultanea: number
  fuso_horario: string
  webhook_url?: string
}

export interface EditarAgendaInput extends Partial<CriarAgendaInput> {
  ativo?: boolean
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAgendas() {
  const [agendas, setAgendas] = useState<Agenda[]>(MOCK_AGENDAS)
  const [horarios, setHorarios] = useState<HorarioAgenda[]>(MOCK_HORARIOS)
  const [bloqueios, setBloqueios] = useState<Bloqueio[]>(MOCK_BLOQUEIOS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Lista todas as agendas ativas.
   */
  const listarAgendas = useCallback(
    (apenasAtivas = false): Agenda[] => {
      return apenasAtivas ? agendas.filter((a) => a.ativo) : agendas
    },
    [agendas]
  )

  /**
   * Cria uma nova agenda.
   */
  const criarAgenda = useCallback(async (input: CriarAgendaInput): Promise<Agenda | null> => {
    setLoading(true)
    setError(null)
    try {
      await new Promise((r) => setTimeout(r, 400))

      const nova: Agenda = {
        id: `ag-${Date.now()}`,
        ...input,
        ativo: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      setAgendas((prev) => [...prev, nova])
      toast.success(`Agenda "${nova.nome}" criada com sucesso!`)
      return nova
    } catch (err) {
      const msg = 'Erro ao criar agenda. Tente novamente.'
      setError(msg)
      toast.error(msg)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Edita uma agenda existente.
   */
  const editarAgenda = useCallback(
    async (id: string, input: EditarAgendaInput): Promise<Agenda | null> => {
      setLoading(true)
      setError(null)
      try {
        await new Promise((r) => setTimeout(r, 400))

        let updated: Agenda | null = null
        setAgendas((prev) =>
          prev.map((a) => {
            if (a.id !== id) return a
            updated = { ...a, ...input, updated_at: new Date().toISOString() }
            return updated
          })
        )

        if (updated) {
          toast.success(`Agenda atualizada com sucesso!`)
        }
        return updated
      } catch (err) {
        const msg = 'Erro ao editar agenda. Tente novamente.'
        setError(msg)
        toast.error(msg)
        return null
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const deletarAgenda = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      await new Promise((r) => setTimeout(r, 400))

      setAgendas((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, ativo: false, updated_at: new Date().toISOString() } : a
        )
      )
      toast.success('Agenda desativada.')
      return true
    } catch (err) {
      const msg = 'Erro ao desativar agenda.'
      setError(msg)
      toast.error(msg)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const getAgenda = useCallback(
    (id: string): Agenda | undefined => {
      return agendas.find((a) => a.id === id)
    },
    [agendas]
  )

  // ─── Horários ───────────────────────────────────────────────────────────────
  
  const getHorariosAgenda = useCallback((agendaId: string) => {
    return horarios.filter(h => h.agenda_id === agendaId)
  }, [horarios])

  const salvarHorarios = useCallback(async (agendaId: string, novosHorarios: HorarioAgenda[]) => {
    setLoading(true)
    try {
      await new Promise(r => setTimeout(r, 600))
      setHorarios(prev => {
        const filtrados = prev.filter(h => h.agenda_id !== agendaId)
        return [...filtrados, ...novosHorarios]
      })
      toast.success('Configurações de horários salvas!')
      return true
    } catch (err) {
      toast.error('Erro ao salvar horários.')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  // ─── Bloqueios ──────────────────────────────────────────────────────────────
  
  const listarBloqueios = useCallback((busca?: string) => {
    if (!busca) return bloqueios
    const q = busca.toLowerCase()
    return bloqueios.filter(b => b.motivo.toLowerCase().includes(q))
  }, [bloqueios])

  const adicionarBloqueio = useCallback(async (bloqueio: Omit<Bloqueio, 'id' | 'created_at'>) => {
    setLoading(true)
    try {
      await new Promise(r => setTimeout(r, 400))
      const novo: Bloqueio = {
        id: `bl-${Date.now()}`,
        created_at: new Date().toISOString(),
        ...bloqueio
      }
      setBloqueios(prev => [novo, ...prev])
      toast.success('Bloqueio adicionado com sucesso!')
      return novo
    } catch (err) {
      toast.error('Erro ao adicionar bloqueio.')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const removerBloqueio = useCallback(async (id: string) => {
    setLoading(true)
    try {
      await new Promise(r => setTimeout(r, 300))
      setBloqueios(prev => prev.filter(b => b.id !== id))
      toast.success('Bloqueio removido.')
      return true
    } catch (err) {
      toast.error('Erro ao remover bloqueio.')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    agendas,
    horarios,
    bloqueios,
    loading,
    error,
    listarAgendas,
    criarAgenda,
    editarAgenda,
    deletarAgenda,
    getAgenda,
    // horarios
    getHorariosAgenda,
    salvarHorarios,
    // bloqueios
    listarBloqueios,
    adicionarBloqueio,
    removerBloqueio
  }
}

