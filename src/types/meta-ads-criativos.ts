export type TipoCriativo = 'IMAGE' | 'VIDEO' | 'CAROUSEL'
export type StatusCriativo = 'evergreen' | 'novo' | 'atencao' | 'fadiga'
export type SeveridadeInsight = 'alerta' | 'oportunidade' | 'info'

export interface CampanhaUsando {
  id: string
  nome: string
  leads: number
  cpl: number
}

export interface Criativo {
  id: string
  nome: string
  tipo: TipoCriativo
  status: StatusCriativo
  corFundo: string
  thumbnailUrl?: string
  diasAtivo: number
  campanhas: number
  campanhasDetalhe: CampanhaUsando[]

  leads: number
  investimento: number
  cpl: number
  ctr: number
  cpc: number
  cpm: number
  alcance: number
  impressoes: number
  frequencia: number

  hookRate: number | null
  holdRate: number | null
  videoViews3s: number | null
  videoViews15s: number | null
  videoThruPlays: number | null

  score: number
}

export interface FiltrosCriativos {
  tipo: string
  status: string
  ordenarPor: 'score' | 'leads' | 'cpl' | 'hookRate' | 'holdRate' | 'diasAtivo'
  colunas: number
}

export interface InsightCriativo {
  id: string
  criativoId: string
  severidade: SeveridadeInsight
  titulo: string
  mensagem: string
  analiseCompleta: string
  labelAcao: string
}
