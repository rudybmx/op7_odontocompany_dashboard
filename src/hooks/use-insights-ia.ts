'use client'

import useSWR from 'swr'
import { InsightIA, SeveridadeInsight } from '@/types/meta-ads-anuncios'
import { makeFetcher, SWR_OPTS } from '@/lib/swr'

interface AiInsightRow {
  id: string
  account_id: string
  insight_type: string
  title: string
  content: {
    mensagem?: string
    analise_completa?: string
    label_acao?: string
  }
  generated_at: string
}

const fetchInsights = makeFetcher<AiInsightRow[]>()

function mapSeveridade(insight_type: string): SeveridadeInsight {
  if (insight_type === 'anomaly')        return 'alerta'
  if (insight_type === 'recommendation') return 'oportunidade'
  return 'info'
}

function mapInsight(row: AiInsightRow): InsightIA {
  return {
    id:              row.id,
    anuncioId:       '', // account_id não mapeia para criativo real
    severidade:      mapSeveridade(row.insight_type),
    titulo:          row.title,
    // @ts-ignore
    mensagem:        row.title + (row.content?.referencia ? ` - Ref: ${row.content.referencia}` : ''),
    analiseCompleta: row.content?.analise_completa ?? '',
    labelAcao:       '', // Ocultar botão de abrir detalhe temporariamente
  }
}

export function useInsightsIA() {
  const { data: rows, isLoading, error } = useSWR(
    ['ai_insights', { order: 'generated_at.desc' }] as const,
    fetchInsights, SWR_OPTS
  )

  return {
    insights: (rows ?? []).map(mapInsight),
    isLoading,
    error: error ?? null,
  }
}
