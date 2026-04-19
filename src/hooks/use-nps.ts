'use client'

import { useState, useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import { NpsConfig, LembreteCanal, NpsTrigger } from '@/types/agenda'
import { MOCK_NPS_CONFIG, MOCK_AGENDAMENTOS } from '@/lib/mock-agenda'

// ─── Tipos de entrada ─────────────────────────────────────────────────────────
export interface AtualizarNpsConfigInput {
  ativo?: boolean
  trigger?: NpsTrigger
  horas_apos_atendimento?: number
  canal?: LembreteCanal
  mensagem_template?: string
}

export interface EnviarNpsManualInput {
  agendamento_id: string
  canal?: LembreteCanal
}

// ─── Resultado de uma resposta NPS ────────────────────────────────────────────
export interface RespostaNps {
  agendamento_id: string
  cliente_nome: string
  score: number
  categoria: 'promotor' | 'neutro' | 'detrator'
  data: string
  agenda_id: string
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useNps() {
  const [configs, setConfigs] = useState<NpsConfig[]>(MOCK_NPS_CONFIG)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ─── Dados derivados das respostas ─────────────────────────────────────────
  const respostas = useMemo((): RespostaNps[] => {
    return MOCK_AGENDAMENTOS
      .filter((a) => a.nps_score != null)
      .map((a) => {
        const score = a.nps_score as number
        const categoria: RespostaNps['categoria'] =
          score >= 9 ? 'promotor' : score >= 7 ? 'neutro' : 'detrator'
        return {
          agendamento_id: a.id,
          cliente_nome: a.cliente_nome,
          score,
          categoria,
          data: a.nps_enviado_em ?? a.updated_at,
          agenda_id: a.agenda_id,
        }
      })
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
  }, [])

  // ─── KPIs calculados ───────────────────────────────────────────────────────
  const kpis = useMemo(() => {
    const scores = respostas.map((r) => r.score)
    const total = scores.length

    if (total === 0) {
      return {
        npsScore: 0,
        scoreMedio: 0,
        promotores: 0,
        neutros: 0,
        detratores: 0,
        pctPromotor: 0,
        pctNeutro: 0,
        pctDetrator: 0,
        total: 0,
      }
    }

    const promotores = respostas.filter((r) => r.categoria === 'promotor').length
    const neutros    = respostas.filter((r) => r.categoria === 'neutro').length
    const detratores = respostas.filter((r) => r.categoria === 'detrator').length

    return {
      npsScore: Math.round(((promotores - detratores) / total) * 100),
      scoreMedio: parseFloat((scores.reduce((s, n) => s + n, 0) / total).toFixed(1)),
      promotores,
      neutros,
      detratores,
      pctPromotor: Math.round((promotores / total) * 100),
      pctNeutro: Math.round((neutros / total) * 100),
      pctDetrator: Math.round((detratores / total) * 100),
      total,
    }
  }, [respostas])

  // ─── Agendamentos com NPS pendente ─────────────────────────────────────────
  const pendentes = useMemo(() => {
    return MOCK_AGENDAMENTOS.filter(
      (a) => a.status === 'compareceu' && !a.nps_enviado
    )
  }, [])

  /**
   * Atualiza a configuração de NPS de uma agenda (ou global).
   * TODO: Substituir por: PATCH /nps_configs?id=eq.{id} (PostgREST)
   */
  const atualizarConfig = useCallback(
    async (id: string, input: AtualizarNpsConfigInput): Promise<boolean> => {
      setLoading(true)
      setError(null)
      try {
        await new Promise((r) => setTimeout(r, 300))
        setConfigs((prev) =>
          prev.map((c) =>
            c.id === id ? { ...c, ...input } : c
          )
        )
        toast.success('Configuração de NPS atualizada!')
        return true
      } catch (err) {
        const msg = 'Erro ao atualizar configuração de NPS.'
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
   * Envia NPS manualmente para um agendamento específico.
   * TODO: Substituir por: POST /nps/enviar (Edge Function ou webhook)
   */
  const enviarNpsManual = useCallback(
    async (input: EnviarNpsManualInput): Promise<boolean> => {
      setLoading(true)
      setError(null)
      try {
        await new Promise((r) => setTimeout(r, 600))
        // Simula marcação como enviado no mock
        toast.success('NPS enviado com sucesso!')
        return true
      } catch (err) {
        const msg = 'Erro ao enviar NPS.'
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
   * Distribui notas 0-10 para uso em gráfico de barras.
   * TODO: Pode ser calculado no backend via view: SELECT nps_score, COUNT(*) FROM agendamentos GROUP BY nps_score
   */
  const distribuicaoNotas = useMemo((): { nota: number; quantidade: number }[] => {
    return Array.from({ length: 11 }, (_, i) => ({
      nota: i,
      quantidade: respostas.filter((r) => r.score === i).length,
    }))
  }, [respostas])

  return {
    configs,
    respostas,
    pendentes,
    kpis,
    distribuicaoNotas,
    loading,
    error,
    atualizarConfig,
    enviarNpsManual,
  }
}
