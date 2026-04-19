'use client'

import { useState, useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import {
  isWithinInterval,
  parseISO,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  isSameDay,
} from 'date-fns'
import {
  Agendamento,
  AgendamentoStatus,
  AgendamentoOrigem,
  FiltrosAgendamento,
} from '@/types/agenda'
import { MOCK_AGENDAMENTOS } from '@/lib/mock-agenda'

// ─── Tipos de entrada ─────────────────────────────────────────────────────────
export interface CriarAgendamentoInput {
  agenda_id: string
  cliente_nome: string
  cliente_telefone: string
  cliente_email?: string
  data_hora_inicio: string
  data_hora_fim: string
  servico?: string
  observacoes?: string
  origem: AgendamentoOrigem
  criado_por?: string
}

export interface EditarAgendamentoInput extends Partial<CriarAgendamentoInput> {}

// ─── Filtros padrão ───────────────────────────────────────────────────────────
export const FILTROS_PADRAO: FiltrosAgendamento = {
  agenda_ids: [],
  status: [],
  origem: [],
  data_inicio: '',
  data_fim: '',
  busca: '',
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAgendamentos() {
  const [todos, setTodos] = useState<Agendamento[]>(MOCK_AGENDAMENTOS)
  const [filtros, setFiltros] = useState<FiltrosAgendamento>(FILTROS_PADRAO)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ─── Aplicar filtros reativamente ────────────────────────────────────────────
  const agendamentos = useMemo(() => {
    let resultado = [...todos]

    if (filtros.agenda_ids.length > 0) {
      resultado = resultado.filter((a) => filtros.agenda_ids.includes(a.agenda_id))
    }

    if (filtros.status.length > 0) {
      resultado = resultado.filter((a) => filtros.status.includes(a.status))
    }

    if (filtros.origem.length > 0) {
      resultado = resultado.filter((a) => filtros.origem.includes(a.origem))
    }

    if (filtros.data_inicio) {
      const inicio = parseISO(filtros.data_inicio)
      resultado = resultado.filter(
        (a) => parseISO(a.data_hora_inicio) >= inicio
      )
    }

    if (filtros.data_fim) {
      const fim = parseISO(filtros.data_fim)
      resultado = resultado.filter(
        (a) => parseISO(a.data_hora_inicio) <= fim
      )
    }

    if (filtros.busca.trim()) {
      const q = filtros.busca.toLowerCase()
      resultado = resultado.filter(
        (a) =>
          a.cliente_nome.toLowerCase().includes(q) ||
          a.cliente_telefone.includes(q) ||
          (a.servico ?? '').toLowerCase().includes(q)
      )
    }

    // Ordenar por data/hora crescente
    return resultado.sort(
      (a, b) =>
        new Date(a.data_hora_inicio).getTime() - new Date(b.data_hora_inicio).getTime()
    )
  }, [todos, filtros])

  // ─── Getters derivados ────────────────────────────────────────────────────────
  /**
   * Retorna agendamentos de um dia específico.
   * TODO: Substituir por: GET /agendamentos?data_hora_inicio=gte.{dia}T00:00&data_hora_inicio=lt.{dia+1}T00:00
   */
  const getAgendamentosDoDia = useCallback(
    (data: string, agenda_id?: string): Agendamento[] => {
      const dia = parseISO(data)
      return todos.filter((a) => {
        const mesmodia = isSameDay(parseISO(a.data_hora_inicio), dia)
        if (agenda_id) return mesmodia && a.agenda_id === agenda_id
        return mesmodia
      })
    },
    [todos]
  )

  /**
   * Retorna agendamentos de uma semana, filtrados por agenda_ids.
   * TODO: Substituir por: GET /agendamentos?data_hora_inicio=gte.{inicio}&data_hora_inicio=lte.{fim}&agenda_id=in.({ids})
   */
  const getAgendamentosDaSemana = useCallback(
    (inicio: string, fim: string, agenda_ids: string[] = []): Agendamento[] => {
      const start = parseISO(inicio)
      const end = parseISO(fim)
      return todos.filter((a) => {
        const dt = parseISO(a.data_hora_inicio)
        const dentroIntervalo = isWithinInterval(dt, { start, end })
        if (agenda_ids.length === 0) return dentroIntervalo
        return dentroIntervalo && agenda_ids.includes(a.agenda_id)
      })
    },
    [todos]
  )

  // ─── KPIs utilitários ─────────────────────────────────────────────────────────
  const getKpisHoje = useCallback(() => {
    const hoje = new Date()
    const dodiaHoje = todos.filter((a) =>
      isSameDay(parseISO(a.data_hora_inicio), hoje)
    )
    const confirmados = dodiaHoje.filter((a) =>
      ['confirmado', 'compareceu', 'em_atendimento'].includes(a.status)
    ).length
    const faltasSemana = todos.filter(
      (a) =>
        a.status === 'falta' &&
        isWithinInterval(parseISO(a.data_hora_inicio), {
          start: startOfWeek(hoje, { weekStartsOn: 1 }),
          end: endOfWeek(hoje, { weekStartsOn: 1 }),
        })
    ).length
    const atendidosSemana = todos.filter(
      (a) =>
        a.status === 'compareceu' &&
        isWithinInterval(parseISO(a.data_hora_inicio), {
          start: startOfWeek(hoje, { weekStartsOn: 1 }),
          end: endOfWeek(hoje, { weekStartsOn: 1 }),
        })
    ).length
    const totalSemana = atendidosSemana + faltasSemana
    const taxaComparecimento = totalSemana > 0 ? Math.round((atendidosSemana / totalSemana) * 100) : 0

    return {
      agendamentosHoje: dodiaHoje.length,
      confirmadosHoje: confirmados,
      faltasSemana,
      taxaComparecimento,
    }
  }, [todos])

  // ─── Mutações ─────────────────────────────────────────────────────────────────
  /**
   * Cria um novo agendamento.
   * TODO: Substituir por: POST /agendamentos (PostgREST)
   */
  const criarAgendamento = useCallback(
    async (input: CriarAgendamentoInput): Promise<Agendamento | null> => {
      setLoading(true)
      setError(null)
      try {
        await new Promise((r) => setTimeout(r, 400))

        const novo: Agendamento = {
          id: `ag-${Date.now()}`,
          ...input,
          status: 'agendado',
          nps_enviado: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        setTodos((prev) => [...prev, novo])
        toast.success(`Agendamento criado para ${input.cliente_nome}!`)
        return novo
      } catch (err) {
        const msg = 'Erro ao criar agendamento.'
        setError(msg)
        toast.error(msg)
        return null
      } finally {
        setLoading(false)
      }
    },
    []
  )

  /**
   * Edita um agendamento existente.
   * TODO: Substituir por: PATCH /agendamentos?id=eq.{id} (PostgREST)
   */
  const editarAgendamento = useCallback(
    async (id: string, input: EditarAgendamentoInput): Promise<Agendamento | null> => {
      setLoading(true)
      setError(null)
      try {
        await new Promise((r) => setTimeout(r, 400))

        let updated: Agendamento | null = null
        setTodos((prev) =>
          prev.map((a) => {
            if (a.id !== id) return a
            updated = { ...a, ...input, updated_at: new Date().toISOString() }
            return updated
          })
        )

        if (updated) toast.success('Agendamento atualizado!')
        return updated
      } catch (err) {
        const msg = 'Erro ao editar agendamento.'
        setError(msg)
        toast.error(msg)
        return null
      } finally {
        setLoading(false)
      }
    },
    []
  )

  /**
   * Atualiza apenas o status de um agendamento.
   * TODO: Substituir por: PATCH /agendamentos?id=eq.{id} com body { status }
   */
  const atualizarStatus = useCallback(
    async (
      id: string,
      status: AgendamentoStatus,
      extras?: {
        cancelamento_motivo?: string
        cancelado_por?: string
        reagendado_de?: string
      }
    ): Promise<boolean> => {
      setLoading(true)
      setError(null)
      try {
        await new Promise((r) => setTimeout(r, 300))

        setTodos((prev) =>
          prev.map((a) => {
            if (a.id !== id) return a
            return {
              ...a,
              status,
              ...extras,
              cancelado_em:
                status === 'cancelado' ? new Date().toISOString() : a.cancelado_em,
              updated_at: new Date().toISOString(),
            }
          })
        )

        const MSG: Partial<Record<AgendamentoStatus, string>> = {
          confirmado: 'Agendamento confirmado!',
          compareceu: 'Marcado como compareceu ✓',
          falta: 'Marcado como falta.',
          cancelado: 'Agendamento cancelado.',
          em_atendimento: 'Em atendimento.',
        }
        toast.success(MSG[status] ?? 'Status atualizado.')
        return true
      } catch (err) {
        const msg = 'Erro ao atualizar status.'
        setError(msg)
        toast.error(msg)
        return false
      } finally {
        setLoading(false)
      }
    },
    []
  )

  /**
   * Remove (soft delete) um agendamento.
   * TODO: Substituir por: PATCH /agendamentos?id=eq.{id} com body { status: 'cancelado' }
   */
  const deletarAgendamento = useCallback(async (id: string): Promise<boolean> => {
    return atualizarStatus(id, 'cancelado')
  }, [atualizarStatus])

  return {
    agendamentos,
    todos,
    filtros,
    setFiltros,
    loading,
    error,
    // getters
    getAgendamentosDoDia,
    getAgendamentosDaSemana,
    getKpisHoje,
    // mutações
    criarAgendamento,
    editarAgendamento,
    atualizarStatus,
    deletarAgendamento,
  }
}
