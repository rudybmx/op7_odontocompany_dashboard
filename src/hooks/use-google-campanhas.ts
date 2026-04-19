// CAMPANHAS (L0):
// SELECT campaign.id, campaign.name, campaign.status,
//        campaign.advertising_channel_type,
//        campaign_budget.amount_micros,
//        metrics.cost_micros, metrics.clicks, metrics.impressions,
//        metrics.ctr, metrics.average_cpc, metrics.conversions,
//        metrics.conversions_value, metrics.cost_per_conversion,
//        metrics.all_conversions_from_interactions_rate,
//        metrics.search_impression_share,
//        metrics.search_budget_lost_impression_share,
//        metrics.search_rank_lost_impression_share,
//        metrics.search_absolute_top_impression_share
// FROM campaign
// WHERE segments.date DURING LAST_30_DAYS
//   AND campaign.status != 'REMOVED'
// ORDER BY metrics.cost_micros DESC

// GRUPOS DE ANÚNCIOS (L1):
// SELECT ad_group.id, ad_group.name, ad_group.status,
//        campaign.id, campaign.advertising_channel_type,
//        metrics.cost_micros, metrics.clicks, metrics.impressions,
//        metrics.ctr, metrics.average_cpc, metrics.conversions,
//        metrics.conversions_value, metrics.cost_per_conversion,
//        metrics.all_conversions_from_interactions_rate
// FROM ad_group
// WHERE segments.date DURING LAST_30_DAYS
//   AND ad_group.status != 'REMOVED'

// QUALITY SCORE MÉDIO POR GRUPO (do keyword_view):
// SELECT ad_group.id, AVG(metrics.historical_quality_score) as qs_medio,
//        COUNT(*) as total_keywords
// FROM keyword_view
// WHERE segments.date DURING LAST_7_DAYS
//   AND ad_group_criterion.status = 'ENABLED'
// → Fazer JOIN com grupos pelo ad_group.id
//
// NOTA: cost_micros ÷ 1.000.000 = R$
// NOTA: QS indisponível para PMax, Display, Video → mostrar "—"

import type { CampanhaGoogle, GrupoAnuncios, FiltrosCampanhasGoogle } from '@/types/google-ads'

const MOCK_CAMPANHAS: CampanhaGoogle[] = [
  {
    id: 'g1',
    nome: '[SEARCH][ODONTO][LONDRINA][IMPLANTE][MARCA]',
    tipo: 'SEARCH', status: 'ENABLED',
    orcamentoDiario: 80,
    investimento: 2340.80,
    cliques: 4120, impressoes: 38400, conversoes: 186,
    valorConversoes: 93000,
    ctr: 10.7, cpcMedio: 0.57, cpm: 60.9,
    roas: 39.7, taxaConversao: 4.5, custoConversao: 12.58,
    impressionShare: 0.62, isPeridoBudget: 0.08, isPerdidoRank: 0.30,
    absoluteTopIS: 0.41, qualityScoreMedio: 7.8,
  },
  {
    id: 'g2',
    nome: '[SEARCH][ODONTO][LONDRINA][LIMPEZA][GERAL]',
    tipo: 'SEARCH', status: 'ENABLED',
    orcamentoDiario: 50,
    investimento: 1480.20,
    cliques: 2890, impressoes: 24100, conversoes: 98,
    valorConversoes: 49000,
    ctr: 12.0, cpcMedio: 0.51, cpm: 61.4,
    roas: 33.1, taxaConversao: 3.4, custoConversao: 15.10,
    impressionShare: 0.54, isPeridoBudget: 0.12, isPerdidoRank: 0.34,
    absoluteTopIS: 0.31, qualityScoreMedio: 7.2,
  },
  {
    id: 'g3',
    nome: '[PMAX][ODONTO][LONDRINA][CONVERSAO]',
    tipo: 'PERFORMANCE_MAX', status: 'ENABLED',
    orcamentoDiario: 120,
    investimento: 3601.00,
    cliques: 5240, impressoes: 142000, conversoes: 241,
    valorConversoes: 120500,
    ctr: 3.7, cpcMedio: 0.69, cpm: 25.4,
    roas: 33.5, taxaConversao: 4.6, custoConversao: 14.94,
    impressionShare: 0.0, isPeridoBudget: 0.0, isPerdidoRank: 0.0,
    absoluteTopIS: 0.0, qualityScoreMedio: 0,
  },
  {
    id: 'g4',
    nome: '[DISPLAY][ODONTO][REMARKETING][LONDRINA]',
    tipo: 'DISPLAY', status: 'ENABLED',
    orcamentoDiario: 30,
    investimento: 890.50,
    cliques: 1240, impressoes: 182000, conversoes: 28,
    valorConversoes: 14000,
    ctr: 0.68, cpcMedio: 0.72, cpm: 4.9,
    roas: 15.7, taxaConversao: 2.3, custoConversao: 31.80,
    impressionShare: 0.0, isPeridoBudget: 0.0, isPerdidoRank: 0.0,
    absoluteTopIS: 0.0, qualityScoreMedio: 0,
  },
  {
    id: 'g5',
    nome: '[VIDEO][ODONTO][LONDRINA][YOUTUBE][AWARENESS]',
    tipo: 'VIDEO', status: 'PAUSED',
    orcamentoDiario: 25,
    investimento: 420.00,
    cliques: 380, impressoes: 62000, conversoes: 8,
    valorConversoes: 4000,
    ctr: 0.61, cpcMedio: 1.11, cpm: 6.8,
    roas: 9.5, taxaConversao: 2.1, custoConversao: 52.50,
    impressionShare: 0.0, isPeridoBudget: 0.0, isPerdidoRank: 0.0,
    absoluteTopIS: 0.0, qualityScoreMedio: 0,
  },
]

const MOCK_GRUPOS: GrupoAnuncios[] = [
  // Campanha g1 (SEARCH - Implante Marca)
  { id: 'gr1', campanhaId: 'g1', nome: '[IMPLANTE][MARCA][EXATO]',
    status: 'ENABLED', investimento: 980, cliques: 1820, impressoes: 16200,
    conversoes: 82, ctr: 11.2, cpcMedio: 0.54, roas: 41.8, taxaConversao: 4.5,
    custoConversao: 11.95, qualityScoreMedio: 8.4, keywordsAtivas: 8 },
  { id: 'gr2', campanhaId: 'g1', nome: '[IMPLANTE][GENERICO][FRASE]',
    status: 'ENABLED', investimento: 820, cliques: 1480, impressoes: 13100,
    conversoes: 64, ctr: 11.3, cpcMedio: 0.55, roas: 39.0, taxaConversao: 4.3,
    custoConversao: 12.81, qualityScoreMedio: 7.6, keywordsAtivas: 12 },
  { id: 'gr3', campanhaId: 'g1', nome: '[IMPLANTE][CONCORRENTE][AMPLA]',
    status: 'PAUSED', investimento: 540, cliques: 820, impressoes: 9100,
    conversoes: 40, ctr: 9.0, cpcMedio: 0.66, roas: 37.0, taxaConversao: 4.9,
    custoConversao: 13.50, qualityScoreMedio: 6.2, keywordsAtivas: 6 },

  // Campanha g2 (SEARCH - Limpeza Geral)
  { id: 'gr4', campanhaId: 'g2', nome: '[LIMPEZA][MARCA][EXATO]',
    status: 'ENABLED', investimento: 620, cliques: 1240, impressoes: 10200,
    conversoes: 44, ctr: 12.2, cpcMedio: 0.50, roas: 35.5, taxaConversao: 3.5,
    custoConversao: 14.09, qualityScoreMedio: 8.1, keywordsAtivas: 6 },
  { id: 'gr5', campanhaId: 'g2', nome: '[LIMPEZA][GENERICO][FRASE]',
    status: 'ENABLED', investimento: 860, cliques: 1650, impressoes: 13900,
    conversoes: 54, ctr: 11.9, cpcMedio: 0.52, roas: 31.4, taxaConversao: 3.3,
    custoConversao: 15.93, qualityScoreMedio: 6.8, keywordsAtivas: 15 },

  // Campanha g3 (PMAX)
  { id: 'gr6', campanhaId: 'g3', nome: 'Asset Group 01 — Implante',
    status: 'ENABLED', investimento: 1800, cliques: 2620, impressoes: 71000,
    conversoes: 121, ctr: 3.7, cpcMedio: 0.69, roas: 33.6, taxaConversao: 4.6,
    custoConversao: 14.88, qualityScoreMedio: 0, keywordsAtivas: 0 },
  { id: 'gr7', campanhaId: 'g3', nome: 'Asset Group 02 — Clareamento',
    status: 'ENABLED', investimento: 1801, cliques: 2620, impressoes: 71000,
    conversoes: 120, ctr: 3.7, cpcMedio: 0.69, roas: 33.4, taxaConversao: 4.6,
    custoConversao: 15.01, qualityScoreMedio: 0, keywordsAtivas: 0 },

  // Campanha g4 (DISPLAY)
  { id: 'gr8', campanhaId: 'g4', nome: '[REMARKETING][SITE][7D]',
    status: 'ENABLED', investimento: 520, cliques: 740, impressoes: 108000,
    conversoes: 18, ctr: 0.69, cpcMedio: 0.70, roas: 17.3, taxaConversao: 2.4,
    custoConversao: 28.89, qualityScoreMedio: 0, keywordsAtivas: 0 },
  { id: 'gr9', campanhaId: 'g4', nome: '[REMARKETING][LEADS][14D]',
    status: 'ENABLED', investimento: 370, cliques: 500, impressoes: 74000,
    conversoes: 10, ctr: 0.68, cpcMedio: 0.74, roas: 13.5, taxaConversao: 2.0,
    custoConversao: 37.00, qualityScoreMedio: 0, keywordsAtivas: 0 },

  // Campanha g5 (VIDEO - pausada)
  { id: 'gr10', campanhaId: 'g5', nome: '[YOUTUBE][AWARENESS][30S]',
    status: 'PAUSED', investimento: 420, cliques: 380, impressoes: 62000,
    conversoes: 8, ctr: 0.61, cpcMedio: 1.11, roas: 9.5, taxaConversao: 2.1,
    custoConversao: 52.50, qualityScoreMedio: 0, keywordsAtivas: 0 },
]

export function useGoogleCampanhas(filtros: FiltrosCampanhasGoogle) {
  let campanhas = [...MOCK_CAMPANHAS]

  if (filtros.busca)
    campanhas = campanhas.filter(c =>
      c.nome.toLowerCase().includes(filtros.busca.toLowerCase())
    )
  if (filtros.tipo !== 'todos')
    campanhas = campanhas.filter(c => c.tipo === filtros.tipo)
  if (filtros.status !== 'todos')
    campanhas = campanhas.filter(c => c.status === filtros.status)

  campanhas.sort((a, b) => {
    const mult = filtros.ordem === 'asc' ? 1 : -1
    switch (filtros.ordenarPor) {
      case 'conversoes':   return (b.conversoes - a.conversoes) * mult
      case 'roas':         return (b.roas - a.roas) * mult
      case 'ctr':          return (b.ctr - a.ctr) * mult
      case 'qualityScore': return (b.qualityScoreMedio - a.qualityScoreMedio) * mult
      default:             return (b.investimento - a.investimento) * mult
    }
  })

  const grupos = (campanhaId: string) =>
    MOCK_GRUPOS.filter(g => g.campanhaId === campanhaId)

  return { campanhas, grupos }
}
