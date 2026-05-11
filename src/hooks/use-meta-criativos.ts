'use client'

import useSWR from 'swr'
import api from '@/lib/api-client'
import { Criativo, FiltrosCriativos, TipoCriativo, StatusCriativo } from '@/types/meta-ads-criativos'

interface Workspace { id: string }

interface CriativoRow {
  creative_id: string
  tipo_criativo: string
  thumbnail_url: string | null
  image_url_hq: string | null
  link_anuncio: string | null
  status: string | null
  total_anuncios: number
  total_campanhas: number
  dias_ativo: number
  spend: number
  leads: number
  impressions: number
  reach: number
  clicks: number
  ctr: number
  cpc: number
  cpm: number
  cpl: number
  frequencia: number
  score: number
}

function mapCriativo(row: CriativoRow): Criativo {
  return {
    id:            row.creative_id,
    nome:          row.creative_id,
    tipo:          ((row.tipo_criativo || 'IMAGE') as TipoCriativo),
    status:        ((row.status || 'novo') as StatusCriativo),
    corFundo:      '#f0f0f0',
    thumbnailUrl:  row.image_url_hq ?? row.thumbnail_url ?? undefined,
    diasAtivo:     row.dias_ativo,
    campanhas:     row.total_campanhas,
    campanhasDetalhe: [],
    leads:         row.leads,
    investimento:  row.spend,
    cpl:           row.cpl,
    ctr:           row.ctr,
    cpc:           row.cpc,
    cpm:           row.cpm,
    alcance:       row.reach,
    impressoes:    row.impressions,
    frequencia:    row.frequencia,
    hookRate:      null,
    holdRate:      null,
    videoViews3s:  null,
    videoViews15s: null,
    videoThruPlays: null,
    score:         row.score,
  }
}

export function useMetaCriativos(
  filtros: FiltrosCriativos,
  dataInicio: string,
  dataFim: string,
  contaIds: string[] = [],
) {
  const { data: workspaces } = useSWR<Workspace[]>(
    '/workspaces',
    () => api.get<Workspace[]>('/workspaces'),
    { revalidateOnFocus: false }
  )
  const wsId = workspaces?.[0]?.id

  const contaIdsParam = contaIds.length
    ? `&conta_ids=${contaIds.join(',')}`
    : ''

  const key = wsId
    ? `/meta/insights/criativos?workspace_id=${wsId}&data_inicio=${dataInicio}&data_fim=${dataFim}${contaIdsParam}`
    : null

  const { data: rows, isLoading, error } = useSWR(
    key,
    () => api.get<CriativoRow[]>(key!),
    { revalidateOnFocus: false }
  )

  let resultado = (rows ?? []).map(mapCriativo)

  if (filtros.tipo !== 'todos') {
    resultado = resultado.filter(c => c.tipo === filtros.tipo)
  }
  if (filtros.status !== 'todos') {
    resultado = resultado.filter(c => c.status === filtros.status)
  }

  resultado.sort((a, b) => {
    switch (filtros.ordenarPor) {
      case 'leads':    return b.leads - a.leads
      case 'cpl':      return a.cpl - b.cpl
      case 'hookRate':
        if (a.hookRate === null) return 1
        if (b.hookRate === null) return -1
        return b.hookRate - a.hookRate
      case 'holdRate':
        if (a.holdRate === null) return 1
        if (b.holdRate === null) return -1
        return b.holdRate - a.holdRate
      case 'diasAtivo': return b.diasAtivo - a.diasAtivo
      default:          return b.score - a.score
    }
  })

  return { criativos: resultado, total: resultado.length, isLoading, error: error ?? null }
}
