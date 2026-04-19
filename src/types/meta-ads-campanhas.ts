export type StatusCampanha = 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED' | 'LEARNING'
export type ObjetivoCampanha = 'LEAD_GENERATION' | 'CONVERSIONS' | 'BRAND_AWARENESS' | 'TRAFFIC' | 'REACH' | 'VIDEO_VIEWS'
export type TipoCriativo = 'IMAGE' | 'VIDEO' | 'CAROUSEL'
export type Plataforma = 'facebook' | 'instagram' | 'whatsapp' | 'audience_network'

export interface Criativo {
  id: string
  tipo: TipoCriativo
  thumbnailUrl?: string
  corFundo: string
}

export interface Anuncio {
  id: string
  nome: string
  status: StatusCampanha
  plataformas: Plataforma[]
  criativo: Criativo
  permalinkUrl?: string       // Meta Ads Library URL for the ad (always set as fallback)
  instagramPermalink?: string // Real Instagram post URL (only when ad was created from existing post)
  investimento: number
  leads: number
  cliques: number
  impressoes: number
  alcance: number
  cpl: number
  ctr: number
  cpc: number
  cpm: number
  frequencia: number
  indiceDesempenho: number
  dataAtualizacao?: string
}

export interface ConjuntoAnuncios {
  id: string
  nome: string
  status: StatusCampanha
  plataformas: Plataforma[]
  orcamentoDiario?: number
  investimento: number
  leads: number
  cpl: number
  ctr: number
  cpc: number
  cpm: number
  alcance: number
  impressoes: number
  frequencia: number
  indiceDesempenho: number
  dataAtualizacao?: string  // ISO date — from Meta API field: updated_time
  anuncios: Anuncio[]
}

export interface Campanha {
  id: string
  nome: string
  nomeAbreviado: string
  objetivo: ObjetivoCampanha
  status: StatusCampanha
  plataformas: Plataforma[]
  orcamentoDiario?: number
  investimento: number
  leads: number
  cpl: number
  ctr: number
  cpc: number
  cpm: number
  alcance: number
  impressoes: number
  frequencia: number
  indiceDesempenho: number
  dataAtualizacao?: string  // ISO date — from Meta API field: updated_time
  conjuntos: ConjuntoAnuncios[]
}

export interface ResumoCampanhas {
  totalCampanhas: number
  campanhasAtivas: number
  investimentoTotal: number
  leadsTotal: number
  cplMedio: number
  ctrMedio: number
  melhorCpl: number
  melhorCplNome: string
}

export interface FiltrosCampanhas {
  busca: string
  objetivo: string
  status: string
  plataformas: Plataforma[]
}
