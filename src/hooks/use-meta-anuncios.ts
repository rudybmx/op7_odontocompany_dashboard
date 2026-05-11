'use client'

import useSWR from 'swr'
import api from '@/lib/api-client'
import { Anuncio, FiltrosAnuncios, TipoAnuncio, StatusAnuncio, PlataformaAnuncio } from '@/types/meta-ads-anuncios'

interface Workspace { id: string }

interface AnuncioRow {
  ad_id: string
  adset_id: string
  adset_name: string
  campaign_id: string
  nome: string
  status: string
  tipo_criativo: string
  thumbnail_url: string | null
  image_url_hq: string | null
  link_anuncio: string | null
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
  dias_ativo: number
}

function mapAnuncio(row: AnuncioRow): Anuncio {
  return {
    id:            row.ad_id,
    nome:          row.nome,
    campanhaNome:  row.campaign_id,
    conjuntoNome:  row.adset_name,
    tipo:          ((row.tipo_criativo || 'IMAGE') as TipoAnuncio),
    status:        ((row.status || 'ACTIVE') as StatusAnuncio),
    plataformas:   ['facebook'] as PlataformaAnuncio[],
    corFundo:      '#f0f0f0',
    thumbnailUrl:  row.image_url_hq ?? row.thumbnail_url ?? undefined,
    investimento:  row.spend,
    leads:         row.leads,
    leadsMensagem: 0,
    leadsCadastro: 0,
    cpl:           row.cpl,
    ctr:           row.ctr,
    cpc:           row.cpc,
    cpm:           row.cpm,
    alcance:       row.reach,
    impressoes:    row.impressions,
    frequencia:    row.frequencia,
    score:         row.score,
    tendencia:     'estavel',
    diasAtivo:     row.dias_ativo,
  }
}

export function useMetaAnuncios(
  filtros: FiltrosAnuncios,
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
    ? `/meta/insights/anuncios?workspace_id=${wsId}&data_inicio=${dataInicio}&data_fim=${dataFim}${contaIdsParam}`
    : null

  const { data: rows, isLoading, error } = useSWR(
    key,
    () => api.get<AnuncioRow[]>(key!),
    { revalidateOnFocus: false }
  )

  let resultado = (rows ?? []).map(mapAnuncio)

  if (filtros.campanha !== 'todas') {
    resultado = resultado.filter(a => a.campanhaNome.includes(filtros.campanha))
  }
  if (filtros.status !== 'todos') {
    resultado = resultado.filter(a => a.status === filtros.status)
  }
  if (filtros.tipo !== 'todos') {
    resultado = resultado.filter(a => a.tipo === filtros.tipo)
  }

  resultado.sort((a, b) => {
    switch (filtros.ordenarPor) {
      case 'leads':      return b.leads - a.leads
      case 'cpl':        return a.cpl - b.cpl
      case 'ctr':        return b.ctr - a.ctr
      case 'frequencia': return b.frequencia - a.frequencia
      default:           return b.score - a.score
    }
  })

  return { anuncios: resultado, total: resultado.length, isLoading, error: error ?? null }
}

export const campanhasDisponiveis: string[] = []
