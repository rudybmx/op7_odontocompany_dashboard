// GRUPOS DE ANÚNCIOS com todas as métricas:
// SELECT
//   ad_group.id, ad_group.name, ad_group.status,
//   campaign.id, campaign.name, campaign.advertising_channel_type,
//   ad_group.target_cpa_micros,
//   ad_group.effective_target_cpa_micros,
//   ad_group.effective_target_cpa_source,
//   ad_group.target_roas,
//   ad_group.effective_target_roas,
//   ad_group.effective_target_roas_source,
//   ad_group.cpc_bid_micros,
//   campaign.bidding_strategy_type,
//   metrics.cost_micros, metrics.clicks, metrics.impressions,
//   metrics.ctr, metrics.average_cpc, metrics.conversions,
//   metrics.conversions_value, metrics.cost_per_conversion,
//   metrics.all_conversions_from_interactions_rate,
//   metrics.search_impression_share,
//   metrics.search_budget_lost_impression_share,
//   metrics.search_rank_lost_impression_share
// FROM ad_group
// WHERE segments.date DURING LAST_30_DAYS
//   AND ad_group.status != 'REMOVED'
// ORDER BY metrics.cost_micros DESC

// QUALITY SCORE MÉDIO POR GRUPO (via keyword_view):
// SELECT ad_group.id, metrics.historical_quality_score, metrics.search_impression_share
// FROM keyword_view
// WHERE segments.date DURING LAST_7_DAYS
//   AND ad_group_criterion.status = 'ENABLED'
// → Agregar AVG(historical_quality_score) por ad_group.id no lado do servidor

// KEYWORDS COUNT POR GRUPO:
// SELECT ad_group.id, ad_group_criterion.status, COUNT(*) as total
// FROM ad_group_criterion
// WHERE ad_group_criterion.type = 'KEYWORD'
// GROUP BY ad_group.id, ad_group_criterion.status

// AD STRENGTH para PMax (via asset_group):
// SELECT asset_group.id, asset_group.name, asset_group.ad_strength,
//        campaign.id, metrics.conversions, metrics.cost_micros
// FROM asset_group
// WHERE campaign.advertising_channel_type = 'PERFORMANCE_MAX'

// FASE DE APRENDIZADO — não há campo direto na API.
// Inferir: se a campanha foi criada ou teve alteração significativa
// nos últimos 7 dias E tem < 30 conversões no período → marcar como em aprendizado
// Estimar dias restantes: max(0, 30 - conversoes) / avg_conversoes_por_dia

// NOTAS IMPORTANTES:
// - cost_micros ÷ 1.000.000 = R$
// - target_cpa_micros e target_roas podem ser null (grupo herda da campanha)
// - effective_target_cpa_source indica se é da campanha ou do grupo
// - Enhanced CPC depreciado em março/2025 — mostrar aviso se detectado
// - IS não disponível para PMax, Display, Video — mostrar "—"
// - Ad Strength só disponível para Performance Max via asset_group resource

import type { GrupoAnunciosDetalhe, FiltrosGruposGoogle } from '@/types/google-ads'

const MOCK_GRUPOS_DETALHE: GrupoAnunciosDetalhe[] = [
  {
    id: 'gr1', campanhaId: 'g1',
    campanhaNome: '[SEARCH][ODONTO][LONDRINA][IMPLANTE][MARCA]',
    tipoCampanha: 'SEARCH', nome: '[IMPLANTE][MARCA][EXATO]',
    status: 'ENABLED',
    estrategiaLance: 'TARGET_CPA', targetCpaMicros: 15000000, targetRoas: null,
    cpcMaximoMicros: null, emAprendizado: false, diasAprendizado: 0,
    investimento: 980, cliques: 1820, impressoes: 16200, conversoes: 82,
    valorConversoes: 41000, ctr: 11.2, cpcMedio: 0.54, cpm: 60.5,
    roas: 41.8, taxaConversao: 4.5, custoConversao: 11.95,
    qualityScoreMedio: 8.4, keywordsAtivas: 8, keywordsTotal: 10,
    adStrength: null, anunciosAtivos: 3,
    impressionShare: 0.68, isPerdidoBudget: 0.06, isPerdidoRank: 0.26,
  },
  {
    id: 'gr2', campanhaId: 'g1',
    campanhaNome: '[SEARCH][ODONTO][LONDRINA][IMPLANTE][MARCA]',
    tipoCampanha: 'SEARCH', nome: '[IMPLANTE][GENERICO][FRASE]',
    status: 'ENABLED',
    estrategiaLance: 'TARGET_CPA', targetCpaMicros: 18000000, targetRoas: null,
    cpcMaximoMicros: null, emAprendizado: false, diasAprendizado: 0,
    investimento: 820, cliques: 1480, impressoes: 13100, conversoes: 64,
    valorConversoes: 32000, ctr: 11.3, cpcMedio: 0.55, cpm: 62.6,
    roas: 39.0, taxaConversao: 4.3, custoConversao: 12.81,
    qualityScoreMedio: 7.6, keywordsAtivas: 12, keywordsTotal: 15,
    adStrength: null, anunciosAtivos: 2,
    impressionShare: 0.54, isPerdidoBudget: 0.10, isPerdidoRank: 0.36,
  },
  {
    id: 'gr3', campanhaId: 'g1',
    campanhaNome: '[SEARCH][ODONTO][LONDRINA][IMPLANTE][MARCA]',
    tipoCampanha: 'SEARCH', nome: '[IMPLANTE][CONCORRENTE][AMPLA]',
    status: 'PAUSED',
    estrategiaLance: 'TARGET_CPA', targetCpaMicros: 20000000, targetRoas: null,
    cpcMaximoMicros: null, emAprendizado: false, diasAprendizado: 0,
    investimento: 540, cliques: 820, impressoes: 9100, conversoes: 40,
    valorConversoes: 20000, ctr: 9.0, cpcMedio: 0.66, cpm: 59.3,
    roas: 37.0, taxaConversao: 4.9, custoConversao: 13.50,
    qualityScoreMedio: 5.8, keywordsAtivas: 0, keywordsTotal: 6,
    adStrength: null, anunciosAtivos: 0,
    impressionShare: 0.44, isPerdidoBudget: 0.14, isPerdidoRank: 0.42,
  },
  {
    id: 'gr4', campanhaId: 'g2',
    campanhaNome: '[SEARCH][ODONTO][LONDRINA][LIMPEZA][GERAL]',
    tipoCampanha: 'SEARCH', nome: '[LIMPEZA][MARCA][EXATO]',
    status: 'ENABLED',
    estrategiaLance: 'TARGET_CPA', targetCpaMicros: 16000000, targetRoas: null,
    cpcMaximoMicros: null, emAprendizado: false, diasAprendizado: 0,
    investimento: 620, cliques: 1240, impressoes: 10200, conversoes: 44,
    valorConversoes: 22000, ctr: 12.2, cpcMedio: 0.50, cpm: 60.8,
    roas: 35.5, taxaConversao: 3.5, custoConversao: 14.09,
    qualityScoreMedio: 8.1, keywordsAtivas: 6, keywordsTotal: 8,
    adStrength: null, anunciosAtivos: 3,
    impressionShare: 0.60, isPerdidoBudget: 0.08, isPerdidoRank: 0.32,
  },
  {
    id: 'gr5', campanhaId: 'g2',
    campanhaNome: '[SEARCH][ODONTO][LONDRINA][LIMPEZA][GERAL]',
    tipoCampanha: 'SEARCH', nome: '[LIMPEZA][GENERICO][FRASE]',
    status: 'ENABLED',
    estrategiaLance: 'TARGET_CPA', targetCpaMicros: null, targetRoas: null,
    cpcMaximoMicros: null, emAprendizado: true, diasAprendizado: 6,
    investimento: 860, cliques: 1650, impressoes: 13900, conversoes: 54,
    valorConversoes: 27000, ctr: 11.9, cpcMedio: 0.52, cpm: 61.9,
    roas: 31.4, taxaConversao: 3.3, custoConversao: 15.93,
    qualityScoreMedio: 6.2, keywordsAtivas: 15, keywordsTotal: 18,
    adStrength: null, anunciosAtivos: 2,
    impressionShare: 0.48, isPerdidoBudget: 0.14, isPerdidoRank: 0.38,
  },
  {
    id: 'gr6', campanhaId: 'g3',
    campanhaNome: '[PMAX][ODONTO][LONDRINA][CONVERSAO]',
    tipoCampanha: 'PERFORMANCE_MAX', nome: 'Asset Group 01 — Implante',
    status: 'ENABLED',
    estrategiaLance: 'MAXIMIZE_CONVERSION_VALUE', targetCpaMicros: null, targetRoas: 3500,
    cpcMaximoMicros: null, emAprendizado: false, diasAprendizado: 0,
    investimento: 1800, cliques: 2620, impressoes: 71000, conversoes: 121,
    valorConversoes: 60500, ctr: 3.7, cpcMedio: 0.69, cpm: 25.4,
    roas: 33.6, taxaConversao: 4.6, custoConversao: 14.88,
    qualityScoreMedio: 0, keywordsAtivas: 0, keywordsTotal: 0,
    adStrength: 'EXCELLENT', anunciosAtivos: 1,
    impressionShare: null, isPerdidoBudget: null, isPerdidoRank: null,
  },
  {
    id: 'gr7', campanhaId: 'g3',
    campanhaNome: '[PMAX][ODONTO][LONDRINA][CONVERSAO]',
    tipoCampanha: 'PERFORMANCE_MAX', nome: 'Asset Group 02 — Clareamento',
    status: 'ENABLED',
    estrategiaLance: 'MAXIMIZE_CONVERSION_VALUE', targetCpaMicros: null, targetRoas: 3200,
    cpcMaximoMicros: null, emAprendizado: true, diasAprendizado: 4,
    investimento: 1801, cliques: 2620, impressoes: 71000, conversoes: 120,
    valorConversoes: 60000, ctr: 3.7, cpcMedio: 0.69, cpm: 25.4,
    roas: 33.3, taxaConversao: 4.6, custoConversao: 15.01,
    qualityScoreMedio: 0, keywordsAtivas: 0, keywordsTotal: 0,
    adStrength: 'GOOD', anunciosAtivos: 1,
    impressionShare: null, isPerdidoBudget: null, isPerdidoRank: null,
  },
  {
    id: 'gr8', campanhaId: 'g4',
    campanhaNome: '[DISPLAY][ODONTO][REMARKETING][LONDRINA]',
    tipoCampanha: 'DISPLAY', nome: '[REMARKETING][SITE][7D]',
    status: 'ENABLED',
    estrategiaLance: 'TARGET_CPA', targetCpaMicros: 35000000, targetRoas: null,
    cpcMaximoMicros: null, emAprendizado: false, diasAprendizado: 0,
    investimento: 520, cliques: 740, impressoes: 108000, conversoes: 18,
    valorConversoes: 9000, ctr: 0.69, cpcMedio: 0.70, cpm: 4.8,
    roas: 17.3, taxaConversao: 2.4, custoConversao: 28.89,
    qualityScoreMedio: 0, keywordsAtivas: 0, keywordsTotal: 0,
    adStrength: null, anunciosAtivos: 4,
    impressionShare: null, isPerdidoBudget: null, isPerdidoRank: null,
  },
  {
    id: 'gr9', campanhaId: 'g4',
    campanhaNome: '[DISPLAY][ODONTO][REMARKETING][LONDRINA]',
    tipoCampanha: 'DISPLAY', nome: '[REMARKETING][LEADS][14D]',
    status: 'ENABLED',
    estrategiaLance: 'TARGET_CPA', targetCpaMicros: 40000000, targetRoas: null,
    cpcMaximoMicros: null, emAprendizado: false, diasAprendizado: 0,
    investimento: 370, cliques: 500, impressoes: 74000, conversoes: 10,
    valorConversoes: 5000, ctr: 0.68, cpcMedio: 0.74, cpm: 5.0,
    roas: 13.5, taxaConversao: 2.0, custoConversao: 37.00,
    qualityScoreMedio: 0, keywordsAtivas: 0, keywordsTotal: 0,
    adStrength: null, anunciosAtivos: 3,
    impressionShare: null, isPerdidoBudget: null, isPerdidoRank: null,
  },
  {
    id: 'gr10', campanhaId: 'g5',
    campanhaNome: '[VIDEO][ODONTO][YOUTUBE][AWARENESS]',
    tipoCampanha: 'VIDEO', nome: '[YOUTUBE][AWARENESS][30S]',
    status: 'PAUSED',
    estrategiaLance: 'MAXIMIZE_CONVERSIONS', targetCpaMicros: null, targetRoas: null,
    cpcMaximoMicros: null, emAprendizado: false, diasAprendizado: 0,
    investimento: 420, cliques: 380, impressoes: 62000, conversoes: 8,
    valorConversoes: 4000, ctr: 0.61, cpcMedio: 1.11, cpm: 6.8,
    roas: 9.5, taxaConversao: 2.1, custoConversao: 52.50,
    qualityScoreMedio: 0, keywordsAtivas: 0, keywordsTotal: 0,
    adStrength: null, anunciosAtivos: 0,
    impressionShare: null, isPerdidoBudget: null, isPerdidoRank: null,
  },
]

export function useGoogleGrupos(filtros: FiltrosGruposGoogle) {
  let grupos = [...MOCK_GRUPOS_DETALHE]

  if (filtros.busca)
    grupos = grupos.filter(g =>
      g.nome.toLowerCase().includes(filtros.busca.toLowerCase()) ||
      g.campanhaNome.toLowerCase().includes(filtros.busca.toLowerCase())
    )
  if (filtros.campanhaId !== 'todas')
    grupos = grupos.filter(g => g.campanhaId === filtros.campanhaId)
  if (filtros.status !== 'todos')
    grupos = grupos.filter(g => g.status === filtros.status)
  if (filtros.estrategia !== 'todas')
    grupos = grupos.filter(g => g.estrategiaLance === filtros.estrategia)

  grupos.sort((a, b) => {
    const m = filtros.ordem === 'asc' ? 1 : -1
    switch (filtros.ordenarPor) {
      case 'conversoes':     return (b.conversoes - a.conversoes) * m
      case 'roas':           return (b.roas - a.roas) * m
      case 'ctr':            return (b.ctr - a.ctr) * m
      case 'qualityScore':   return (b.qualityScoreMedio - a.qualityScoreMedio) * m
      case 'custoConversao': return (a.custoConversao - b.custoConversao) * m
      default:               return (b.investimento - a.investimento) * m
    }
  })

  const campanhasUnicas = Array.from(
    new Map(MOCK_GRUPOS_DETALHE.map(g => [g.campanhaId, { id: g.campanhaId, nome: g.campanhaNome }]))
      .values()
  )

  return { grupos, campanhasUnicas }
}
