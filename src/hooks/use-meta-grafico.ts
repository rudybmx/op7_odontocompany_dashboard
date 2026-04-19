import useSWR from 'swr'
import { apiGet } from '@/lib/api'

interface MetaInsightAPI {
  date_start: string
  spend: number
  leads: number
  impressions: number
  clicks: number
}

interface MetaGraficoData {
  data: string
  investimento: number
  leads: number
  impressoes: number
  cliques: number
}

interface UseMetaGraficoReturn {
  dados: MetaGraficoData[]
  isLoading: boolean
  error: any
}

/**
 * Hook to fetch daily insights for the current month.
 * Formats data for use in charts.
 */
export function useMetaGrafico(): UseMetaGraficoReturn {
  // Date calculations
  const now = new Date()
  
  // First day of current month: YYYY-MM-01
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)
  
  // Today: YYYY-MM-DD
  const today = now.toISOString().slice(0, 10)

  // Constructing PostgREST query key
  // select, order, filtering by date range, and limit
  const query = `/meta_ads_insights?select=date_start,spend,leads,impressions,clicks&order=date_start.asc&date_start=gte.${firstDay}&date_start=lte.${today}&limit=31`

  const { data, error, isLoading } = useSWR<MetaInsightAPI[]>(query, apiGet)

  // Agrupar por data e somar (meta_ads_insights tem 1 linha por anúncio por dia)
  const agrupado = (data || []).reduce<Record<string, MetaInsightAPI>>((acc, item) => {
    const key = item.date_start
    if (!acc[key]) {
      acc[key] = { date_start: key, spend: 0, leads: 0, impressions: 0, clicks: 0 }
    }
    acc[key].spend      += Number(item.spend)      || 0
    acc[key].leads      += Number(item.leads)      || 0
    acc[key].impressions += Number(item.impressions) || 0
    acc[key].clicks     += Number(item.clicks)     || 0
    return acc
  }, {})

  const dados: MetaGraficoData[] = Object.values(agrupado)
    .sort((a, b) => a.date_start.localeCompare(b.date_start))
    .map(item => ({
      data: item.date_start,
      investimento: item.spend,
      leads: item.leads,
      impressoes: item.impressions,
      cliques: item.clicks,
    }))

  return {
    dados,
    isLoading,
    error
  }
}
