export type Prioridade = 'baixa' | 'media' | 'alta' | 'urgente'
export type TipoCampo = 'texto' | 'numero' | 'data' | 'select' | 'usuario' | 'checkbox' | 'url'

export interface CampoCustom {
  id: string
  nome: string
  tipo: TipoCampo
  opcoes?: string[] // para tipo select
  valor?: string | number | boolean
}

export interface Comentario {
  id: string
  autor: string
  avatarInitials: string
  texto: string
  criadoEm: string
}

export interface KanbanCard {
  id: string
  titulo: string
  descricao?: string
  status: string // id da coluna
  responsavel?: string
  responsavelInitials?: string
  prioridade?: Prioridade
  dataVencimento?: string
  tags?: string[]
  comentarios?: Comentario[]
  camposCustom?: CampoCustom[]
  criadoEm: string
  atualizadoEm: string
  ordem: number
}

export interface KanbanColuna {
  id: string
  nome: string
  cor: string
  limite?: number // WIP limit
  ordem: number
}

export interface KanbanBoard {
  id: string
  nome: string
  colunas: KanbanColuna[]
  cards: KanbanCard[]
}
