import type { CampanhaGoogle, DadosDiarios, BreakdownTipo, DistribuicaoQS, KpiGoogleVisaoGeral, FiltrosGoogle } from '@/types/google-ads'

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
    nome: '[VIDEO][ODONTO][YOUTUBE][AWARENESS]',
    tipo: 'VIDEO', status: 'PAUSED',
    orcamentoDiario: 0,
    investimento: 420.00,
    cliques: 380, impressoes: 62000, conversoes: 8,
    valorConversoes: 4000,
    ctr: 0.61, cpcMedio: 1.11, cpm: 6.8,
    roas: 9.5, taxaConversao: 2.1, custoConversao: 52.50,
    impressionShare: 0.0, isPeridoBudget: 0.0, isPerdidoRank: 0.0,
    absoluteTopIS: 0.0, qualityScoreMedio: 0,
  },
]

const DADOS_DIARIOS: DadosDiarios[] = [
  { data:'01/04', cliques:1240, impressoes:14800, conversoes:52, custo:780, ctr:8.4 },
  { data:'02/04', cliques:1380, impressoes:16200, conversoes:61, custo:890, ctr:8.5 },
  { data:'03/04', cliques:1120, impressoes:13400, conversoes:44, custo:710, ctr:8.4 },
  { data:'04/04', cliques:1560, impressoes:18100, conversoes:74, custo:980, ctr:8.6 },
  { data:'05/04', cliques:1480, impressoes:17400, conversoes:68, custo:920, ctr:8.5 },
  { data:'06/04', cliques:1640, impressoes:19200, conversoes:80, custo:1040, ctr:8.5 },
  { data:'07/04', cliques:1450, impressoes:16900, conversoes:66, custo:912, ctr:8.6 },
]

export function useGoogleVisaoGeral(filtros: FiltrosGoogle) {
  let campanhas = MOCK_CAMPANHAS

  if (filtros.tipoCampanha !== 'todas')
    campanhas = campanhas.filter(c => c.tipo === filtros.tipoCampanha)
  if (filtros.status !== 'todos')
    campanhas = campanhas.filter(c => c.status === filtros.status)

  const len = campanhas.length || 1

  const kpi: KpiGoogleVisaoGeral = {
    investimentoTotal: campanhas.reduce((s, c) => s + c.investimento, 0),
    cliquesTotal: campanhas.reduce((s, c) => s + c.cliques, 0),
    conversoesTotal: campanhas.reduce((s, c) => s + c.conversoes, 0),
    ctrMedio: campanhas.reduce((s, c) => s + c.ctr, 0) / len,
    cpcMedio: campanhas.reduce((s, c) => s + c.cpcMedio, 0) / len,
    roasMedio: campanhas.reduce((s, c) => s + c.roas * c.investimento, 0) /
               Math.max(1, campanhas.reduce((s, c) => s + c.investimento, 0)),
    impressionShareMedio: campanhas
      .filter(c => c.impressionShare > 0)
      .reduce((s, c) => s + c.impressionShare, 0) /
      Math.max(1, campanhas.filter(c => c.impressionShare > 0).length),
    qualityScoreMedio: campanhas
      .filter(c => c.qualityScoreMedio > 0)
      .reduce((s, c) => s + c.qualityScoreMedio, 0) /
      Math.max(1, campanhas.filter(c => c.qualityScoreMedio > 0).length),
    deltaInvestimento: 14.2,
    deltaCliques: 8.6,
    deltaConversoes: 22.1,
    deltaCtr: 0.4,
    deltaCpc: -6.2,
    deltaRoas: 18.3,
  }

  const breakdownTipos: BreakdownTipo[] = [
    { tipo:'SEARCH',          label:'Search',          investimento:3821, cliques:7010, conversoes:284, ctr:11.3, roas:36.8, cor:'#0f2744' },
    { tipo:'PERFORMANCE_MAX', label:'Performance Max', investimento:3601, cliques:5240, conversoes:241, ctr:3.7,  roas:33.5, cor:'var(--ws-gold)' },
    { tipo:'DISPLAY',         label:'Display',         investimento:890,  cliques:1240, conversoes:28,  ctr:0.68, roas:15.7, cor:'#185fa5' },
    { tipo:'VIDEO',           label:'Video',           investimento:420,  cliques:380,  conversoes:8,   ctr:0.61, roas:9.5,  cor:'#854f0b' },
  ]

  const distribuicaoQS: DistribuicaoQS[] = [
    { faixa:'1–3 (Ruim)',    quantidade: 4,  cor:'#a32d2d' },
    { faixa:'4–6 (Regular)', quantidade: 12, cor:'#854f0b' },
    { faixa:'7–10 (Bom)',    quantidade: 28, cor:'#3b6d11' },
  ]

  return { campanhas, kpi, dadosDiarios: DADOS_DIARIOS, breakdownTipos, distribuicaoQS }
}
