import { useMemo } from 'react'
import { FiltrosCampanhas, CampanhaMetrics } from '@/types/campanhas'
import { MOCK_CAMPANHA_METRICS, MOCK_FOLLOWUP_LEADS } from '@/lib/mock-followup'

export function useCampanhasConversao() {
  const listarCampanhas = (filtros: FiltrosCampanhas) => {
    return MOCK_CAMPANHA_METRICS.filter(c => {
      const matchPlataforma = filtros.plataforma === 'todas' || c.plataforma === filtros.plataforma
      const matchBusca = !filtros.busca || c.campanha_nome.toLowerCase().includes(filtros.busca.toLowerCase())
      return matchPlataforma && matchBusca
    })
  }

  const metricasGerais = useMemo(() => {
    const totalLeads = MOCK_CAMPANHA_METRICS.reduce((acc, c) => acc + c.total_leads, 0)
    const totalInvestido = MOCK_CAMPANHA_METRICS.reduce((acc, c) => acc + (c.custo_total || 0), 0)
    const totalGanhos = MOCK_CAMPANHA_METRICS.reduce((acc, c) => acc + c.leads_ganhos, 0)
    
    return {
      totalLeads,
      totalInvestido,
      mediaConversao: totalLeads > 0 ? (totalGanhos / totalLeads) * 100 : 0,
      custoPorFechamento: totalGanhos > 0 ? totalInvestido / totalGanhos : 0
    }
  }, [])

  const getLeadsDaCampanha = (campanha_nome: string) => {
    // No mock, filtramos pelo nome da campanha ou utm_campaign
    return MOCK_FOLLOWUP_LEADS.filter(l => 
      l.utm_campaign && campanha_nome.includes(l.utm_campaign)
    )
  }

  return {
    listarCampanhas,
    metricasGerais,
    getLeadsDaCampanha
  }
}
