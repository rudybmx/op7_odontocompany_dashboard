import { Agendamento, Agenda, LembreteCanal } from '@/types/agenda'

// ─── Categorias NPS ───────────────────────────────────────────────────────────
export type NpsCategoria = 'promotor' | 'neutro' | 'detrator'

export function calcularCategoria(score: number): NpsCategoria {
  if (score >= 9) return 'promotor'
  if (score >= 7) return 'neutro'
  return 'detrator'
}

// ─── Resposta NPS ─────────────────────────────────────────────────────────────
export interface NpsResposta {
  id: string
  agendamento_id: string
  agendamento?: Agendamento
  cliente_nome: string
  cliente_telefone: string
  agenda_id: string
  agenda?: Agenda
  // Scores
  score: number         // 0–10
  categoria: NpsCategoria
  // Feedback
  feedback_texto?: string
  // Controle
  enviado_em: string    // ISO
  respondido_em?: string
  canal: LembreteCanal
  enviado_automaticamente: boolean
  // Ação para detratores
  acao_tomada?: string
  acao_tomada_em?: string
  acao_tomada_por?: string
}

// ─── Métricas NPS ─────────────────────────────────────────────────────────────
export interface NpsMetrics {
  score_geral: number       // NPS = %promotores - %detratores (escala -100 a +100)
  total_respostas: number
  total_enviados: number
  taxa_resposta: number     // %
  promotores: number
  neutros: number
  detratores: number
  media_scores: number
  evolucao_30d: number      // diferença vs mês anterior
  pct_promotor: number
  pct_neutro: number
  pct_detrator: number
}

// ─── Config de envio NPS ──────────────────────────────────────────────────────
export interface NpsConfigCompleta {
  id: string
  agenda_id: string | null   // null = global
  ativo: boolean
  trigger: 'automatico' | 'manual'
  horas_apos_atendimento?: number
  canal: LembreteCanal
  mensagem_template: string
  msg_promotor?: string
  msg_neutro?: string
  msg_detrator?: string
}

// ─── Ponto de evolução (gráfico) ──────────────────────────────────────────────
export interface NpsEvolucaoPonto {
  semana: string    // label "dd/MM"
  nps: number
  promotores: number
  neutros: number
  detratores: number
  total: number
}

// ─── Distribuição por score ────────────────────────────────────────────────────
export interface NpsDistribuicao {
  nota: number
  quantidade: number
  categoria: NpsCategoria
}

// ─── Labels / helpers visuais ─────────────────────────────────────────────────
export const CATEGORIA_LABEL: Record<NpsCategoria, string> = {
  promotor: 'Promotor',
  neutro: 'Neutro',
  detrator: 'Detrator',
}

export const CATEGORIA_COLOR: Record<NpsCategoria, string> = {
  promotor: 'var(--ws-green)',
  neutro: 'var(--ws-gold)',
  detrator: 'var(--ws-coral)',
}

export const CATEGORIA_BG: Record<NpsCategoria, string> = {
  promotor: 'rgba(15,168,86,0.15)',
  neutro: 'rgba(201,168,76,0.15)',
  detrator: 'rgba(255,92,141,0.15)',
}

export const CATEGORIA_EMOJI: Record<NpsCategoria, string> = {
  promotor: '😊',
  neutro: '😐',
  detrator: '😞',
}
