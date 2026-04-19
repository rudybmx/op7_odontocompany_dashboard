export type TipoAnuncio = 'IMAGE' | 'VIDEO' | 'CAROUSEL'
export type StatusAnuncio = 'ACTIVE' | 'PAUSED' | 'LEARNING' | 'ARCHIVED'
export type PlataformaAnuncio = 'facebook' | 'instagram' | 'whatsapp'

export type SeveridadeInsight = 'alerta' | 'oportunidade' | 'info'

export interface Anuncio {
  id: string
  nome: string
  campanhaNome: string
  conjuntoNome: string
  tipo: TipoAnuncio
  status: StatusAnuncio
  plataformas: PlataformaAnuncio[]
  corFundo: string
  thumbnailUrl?: string

  // métricas
  investimento: number
  leads: number
  leadsMensagem: number
  leadsCadastro: number
  cpl: number
  ctr: number
  cpc: number
  cpm: number
  alcance: number
  impressoes: number
  frequencia: number

  // calculados
  score: number
  tendencia: 'subindo' | 'estavel' | 'caindo'
  diasAtivo: number
}

export interface InsightIA {
  id: string
  anuncioId: string
  severidade: SeveridadeInsight
  titulo: string
  mensagem: string
  analiseCompleta: string
  labelAcao: string
}

export interface FiltrosAnuncios {
  campanha: string
  status: string
  tipo: string
  ordenarPor: 'score' | 'leads' | 'cpl' | 'ctr' | 'frequencia'
}
