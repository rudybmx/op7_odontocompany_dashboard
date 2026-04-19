'use client'

import { useState, useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import { subWeeks, isAfter, parseISO, startOfWeek, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  NpsResposta,
  NpsCategoria,
  NpsMetrics,
  NpsEvolucaoPonto,
  NpsDistribuicao,
  NpsConfigCompleta,
  calcularCategoria,
} from '@/types/nps'
import { MOCK_NPS_RESPOSTAS, MOCK_NPS_CONFIG_FULL } from '@/lib/mock-nps'

// ─── Filtros ──────────────────────────────────────────────────────────────────
export type NpsPeriodo = '7d' | '30d' | '60d' | '90d'
export type NpsFiltroCategoria = 'todos' | NpsCategoria

export interface NpsFiltros {
  periodo: NpsPeriodo
  agenda_id: string | null
  categoria: NpsFiltroCategoria
  busca: string
}

function periodoCutoff(p: NpsPeriodo): Date {
  const dias: Record<NpsPeriodo, number> = { '7d': 7, '30d': 30, '60d': 60, '90d': 90 }
  const d = new Date()
  d.setDate(d.getDate() - dias[p])
  return d
}

// ─── Hook principal ───────────────────────────────────────────────────────────
export function useNpsCompleto() {
  const [respostas, setRespostas] = useState<NpsResposta[]>(MOCK_NPS_RESPOSTAS)
  const [configs, setConfigs] = useState<NpsConfigCompleta[]>(MOCK_NPS_CONFIG_FULL)
  const [filtros, setFiltros] = useState<NpsFiltros>({
    periodo: '60d',
    agenda_id: null,
    categoria: 'todos',
    busca: '',
  })
  const [loading, setLoading] = useState(false)

  // ─── Respostas filtradas ────────────────────────────────────────────────────
  const respostasFiltradas = useMemo(() => {
    const cutoff = periodoCutoff(filtros.periodo)
    return respostas.filter((r) => {
      if (isAfter(cutoff, parseISO(r.enviado_em))) return false
      if (filtros.agenda_id && r.agenda_id !== filtros.agenda_id) return false
      if (filtros.categoria !== 'todos' && r.categoria !== filtros.categoria) return false
      if (filtros.busca) {
        const q = filtros.busca.toLowerCase()
        if (
          !r.cliente_nome.toLowerCase().includes(q) &&
          !r.feedback_texto?.toLowerCase().includes(q)
        ) return false
      }
      return true
    })
  }, [respostas, filtros])

  // ─── Métricas ──────────────────────────────────────────────────────────────
  const metrics = useMemo((): NpsMetrics => {
    const total = respostasFiltradas.length
    if (total === 0) {
      return {
        score_geral: 0, total_respostas: 0, total_enviados: total,
        taxa_resposta: 0, promotores: 0, neutros: 0, detratores: 0,
        media_scores: 0, evolucao_30d: 0, pct_promotor: 0, pct_neutro: 0, pct_detrator: 0,
      }
    }
    const promotores = respostasFiltradas.filter(r => r.categoria === 'promotor').length
    const neutros    = respostasFiltradas.filter(r => r.categoria === 'neutro').length
    const detratores = respostasFiltradas.filter(r => r.categoria === 'detrator').length
    const nps = Math.round(((promotores - detratores) / total) * 100)
    const media = parseFloat(
      (respostasFiltradas.reduce((s, r) => s + r.score, 0) / total).toFixed(1)
    )
    // Evolução: compara últimos 30d vs anteriores 30d
    const now = new Date()
    const cutoff30 = new Date(); cutoff30.setDate(now.getDate() - 30)
    const cutoff60 = new Date(); cutoff60.setDate(now.getDate() - 60)
    const ult30 = respostas.filter(r => isAfter(parseISO(r.enviado_em), cutoff30))
    const ant30 = respostas.filter(r =>
      isAfter(parseISO(r.enviado_em), cutoff60) && !isAfter(parseISO(r.enviado_em), cutoff30)
    )
    const calcNps = (arr: NpsResposta[]) => {
      if (!arr.length) return 0
      const p = arr.filter(r => r.categoria === 'promotor').length
      const d = arr.filter(r => r.categoria === 'detrator').length
      return Math.round(((p - d) / arr.length) * 100)
    }
    const evolucao = calcNps(ult30) - calcNps(ant30)

    return {
      score_geral: nps,
      total_respostas: total,
      total_enviados: Math.round(total / 0.73), // simula taxa de resposta 73%
      taxa_resposta: 73,
      promotores,
      neutros,
      detratores,
      media_scores: media,
      evolucao_30d: evolucao,
      pct_promotor: Math.round((promotores / total) * 100),
      pct_neutro: Math.round((neutros / total) * 100),
      pct_detrator: Math.round((detratores / total) * 100),
    }
  }, [respostasFiltradas, respostas])

  // ─── Evolução NPS (últimas 12 semanas) ─────────────────────────────────────
  const evolucao = useMemo((): NpsEvolucaoPonto[] => {
    const semanas: NpsEvolucaoPonto[] = []
    const numSemanas = 12
    for (let i = numSemanas - 1; i >= 0; i--) {
      const inicioSem = startOfWeek(subWeeks(new Date(), i), { weekStartsOn: 1 })
      const fimSem = new Date(inicioSem); fimSem.setDate(fimSem.getDate() + 7)
      const do_semana = respostas.filter(r => {
        const d = parseISO(r.enviado_em)
        return d >= inicioSem && d < fimSem
      })
      const total = do_semana.length
      const p = do_semana.filter(r => r.categoria === 'promotor').length
      const n = do_semana.filter(r => r.categoria === 'neutro').length
      const d = do_semana.filter(r => r.categoria === 'detrator').length
      semanas.push({
        semana: format(inicioSem, 'dd/MM', { locale: ptBR }),
        nps: total ? Math.round(((p - d) / total) * 100) : 0,
        promotores: p,
        neutros: n,
        detratores: d,
        total,
      })
    }
    return semanas
  }, [respostas])

  // ─── Distribuição por nota ──────────────────────────────────────────────────
  const distribuicao = useMemo((): NpsDistribuicao[] => {
    return Array.from({ length: 11 }, (_, nota) => ({
      nota,
      quantidade: respostasFiltradas.filter(r => r.score === nota).length,
      categoria: calcularCategoria(nota),
    }))
  }, [respostasFiltradas])

  // ─── Detratores sem ação ────────────────────────────────────────────────────
  const detratoresSemAcao = useMemo(() =>
    respostasFiltradas.filter(r => r.categoria === 'detrator' && !r.acao_tomada),
    [respostasFiltradas]
  )

  // ─── Ações ─────────────────────────────────────────────────────────────────

  /** Registra ação para uma resposta de detrator. TODO: PATCH /nps_respostas?id=eq.{id} */
  const registrarAcao = useCallback(async (id: string, acao: string): Promise<boolean> => {
    setLoading(true)
    try {
      await new Promise(r => setTimeout(r, 400))
      setRespostas(prev => prev.map(r =>
        r.id === id
          ? { ...r, acao_tomada: acao, acao_tomada_em: new Date().toISOString(), acao_tomada_por: 'usr-gestor' }
          : r
      ))
      toast.success('Ação registrada com sucesso!')
      return true
    } catch {
      toast.error('Erro ao registrar ação.')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  /** Atualiza config NPS. TODO: PATCH /nps_config?id=eq.{id} */
  const atualizarConfig = useCallback(async (id: string, data: Partial<NpsConfigCompleta>): Promise<boolean> => {
    setLoading(true)
    try {
      await new Promise(r => setTimeout(r, 300))
      setConfigs(prev => prev.map(c => c.id === id ? { ...c, ...data } : c))
      toast.success('Configuração de NPS salva!')
      return true
    } catch {
      toast.error('Erro ao salvar configuração.')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  /** Envio manual de NPS. TODO: POST /functions/v1/enviar-nps */
  const enviarNpsManual = useCallback(async (agendamento_id: string): Promise<boolean> => {
    setLoading(true)
    try {
      await new Promise(r => setTimeout(r, 600))
      toast.success('NPS enviado com sucesso via WhatsApp!')
      return true
    } catch {
      toast.error('Erro ao enviar NPS.')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    respostas: respostasFiltradas,
    respostasTotal: respostas,
    metrics,
    evolucao,
    distribuicao,
    detratoresSemAcao,
    configs,
    filtros,
    setFiltros,
    loading,
    registrarAcao,
    atualizarConfig,
    enviarNpsManual,
  }
}
