'use client'

import useSWR from 'swr'
import type {
  DadosDemograficos,
  DadosPlacement,
  DadosDispositivo,
  DadosSO,
  DadosCidade,
  DadosHora,
  KpiPublicos,
  FiltrosPublicos,
} from '@/types/meta-ads-publicos'
import { makeFetcher, SWR_OPTS } from '@/lib/swr'

interface DemographicsRow {
  age: string
  gender: string
  leads: number
  investimento: string | number
  cpl: string | number
  ctr: string | number
  alcance: number
  impressoes: number
}

interface GeoRow {
  region: string
  leads: number
  investimento: string | number
  cpl: string | number
}

interface AccountSummaryRow {
  alcance: number
  frequencia_media: string | number
}

const fetchDemo    = makeFetcher<DemographicsRow[]>()
const fetchGeo     = makeFetcher<GeoRow[]>()
const fetchAccount = makeFetcher<AccountSummaryRow[]>()

// ─── Static fallbacks for unavailable data ────────────────────────────────────

const PLACEMENTS_VAZIO: DadosPlacement[] = []

const DISPOSITIVOS_FIXO: DadosDispositivo[] = [
  { tipo: 'mobile',  percentual: 85, leads: 0, cpl: 0 },
  { tipo: 'desktop', percentual: 12, leads: 0, cpl: 0 },
  { tipo: 'tablet',  percentual: 3,  leads: 0, cpl: 0 },
]

const SO_FIXO: DadosSO[] = [
  { nome: 'Android', percentual: 68, cpl: 0 },
  { nome: 'iOS',     percentual: 29, cpl: 0 },
  { nome: 'Windows', percentual: 3,  cpl: 0 },
]

const HEATMAP_VAZIO: DadosHora[] = []

const KPI_VAZIO: KpiPublicos = {
  alcanceTotal: 0, frequenciaMedia: 0,
  melhorFaixaCpl: 'N/D', melhorFaixaValor: 0,
  melhorPlacement: 'N/D', melhorPlacementCpl: 0,
  melhorHorario: 'N/D', melhorDia: 'N/D',
  melhorCidade: 'N/D', melhorCidadeLeads: 0,
}

// ─── Mappers ──────────────────────────────────────────────────────────────────

function mapDemografico(row: DemographicsRow): DadosDemograficos {
  return {
    faixa:        row.age.replace('-', '–'),
    genero:       row.gender === 'male' ? 'masc' : 'fem',
    leads:        row.leads,
    investimento: Number(row.investimento),
    cpl:          Number(row.cpl),
    ctr:          Number(row.ctr),
    alcance:      row.alcance,
    impressoes:   row.impressoes,
  }
}

function mapCidades(rows: GeoRow[]): DadosCidade[] {
  const totalLeads = rows.reduce((s, r) => s + r.leads, 0)
  return rows.map(row => ({
    nome:            row.region,
    leads:           row.leads,
    investimento:    Number(row.investimento),
    cpl:             Number(row.cpl),
    percentualLeads: totalLeads > 0 ? (row.leads / totalLeads) * 100 : 0,
  }))
}

function computeKpi(
  demograficos: DadosDemograficos[],
  cidades: DadosCidade[],
  accountRows: AccountSummaryRow[]
): KpiPublicos {
  const alcanceTotal    = accountRows.reduce((s, r) => s + r.alcance, 0)
  const frequenciaMedia = accountRows.length > 0 ? Number(accountRows[0].frequencia_media) : 0

  const comLeads   = demograficos.filter(d => d.leads > 0)
  const melhorDemo = comLeads.length > 0
    ? comLeads.reduce((best, d) => d.cpl < best.cpl ? d : best)
    : null

  const melhorCidade = cidades.length > 0
    ? cidades.reduce((best, c) => c.leads > best.leads ? c : best)
    : null

  return {
    alcanceTotal,
    frequenciaMedia,
    melhorFaixaCpl:     melhorDemo
      ? `${melhorDemo.faixa} ${melhorDemo.genero === 'masc' ? '(M)' : '(F)'}`
      : 'N/D',
    melhorFaixaValor:   melhorDemo?.cpl ?? 0,
    melhorPlacement:    'N/D',
    melhorPlacementCpl: 0,
    melhorHorario:      'N/D',
    melhorDia:          'N/D',
    melhorCidade:       melhorCidade?.nome ?? 'N/D',
    melhorCidadeLeads:  melhorCidade?.leads ?? 0,
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useMetaPublicos(_filtros: FiltrosPublicos, dataInicio: string, dataFim: string) {
  const r1 = useSWR(['rpc/get_demograficos_periodo', { p_inicio: dataInicio, p_fim: dataFim }] as const, fetchDemo, SWR_OPTS)
  const r2 = useSWR(['rpc/get_geo_periodo', { p_inicio: dataInicio, p_fim: dataFim }] as const, fetchGeo, SWR_OPTS)
  const r3 = useSWR(
    ['vw_meta_account_summary', { select: 'alcance,frequencia_media' }] as const,
    fetchAccount, SWR_OPTS
  )

  const isLoading = r1.isLoading || r2.isLoading || r3.isLoading
  const error     = r1.error ?? r2.error ?? r3.error ?? null

  const demograficos = (r1.data ?? []).map(mapDemografico)
  const cidades      = mapCidades(r2.data ?? [])
  const kpi          = (r1.data && r2.data && r3.data)
    ? computeKpi(demograficos, cidades, r3.data)
    : KPI_VAZIO

  return {
    demograficos,
    placements:         PLACEMENTS_VAZIO,
    dispositivos:       DISPOSITIVOS_FIXO,
    sistemaOperacional: SO_FIXO,
    heatmapHoras:       HEATMAP_VAZIO,
    cidades,
    kpi,
    isLoading,
    error,
  }
}
