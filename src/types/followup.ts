// ═══════════════════════════════════════════
// LEAD / FOLLOW-UP STATE
// ═══════════════════════════════════════════

export type LeadOrigem =
  | 'meta_ads'      // Facebook / Instagram Ads
  | 'google_ads'
  | 'linkedin_ads'
  | 'tiktok_ads'
  | 'whatsapp'      // entrada orgânica por WhatsApp
  | 'indicacao'
  | 'offline'       // campanha física / evento
  | 'organico'      // site, SEO
  | 'outro'

export type LeadTemperatura = 'quente' | 'morno' | 'frio' | null

export type LeadStatusFechamento =
  | 'em_aberto'       // ainda em tratativa
  | 'ganho'           // converteu (agendou, comprou, etc.)
  | 'perca'           // disse que não quer
  | 'perdido'         // esgotou tentativas sem resposta
  | 'reagendado'      // follow-up pausado, volta depois

export type LeadStatusFollowup =
  | 'ativo'           // dentro do ciclo, aguardando próximo disparo
  | 'vencido'         // proximo_envio passou, disparo atrasado
  | 'respondeu'       // lead respondeu (pausa automática do ciclo)
  | 'encerrado'       // ciclo concluído manualmente
  | 'esgotado'        // atingiu max_tentativas sem resposta
  | 'pausado'         // pausado manualmente

// Cadência de disparo
export type CadenciaTipo =
  | 'diario'          // todo dia
  | 'dias_alternados' // dia sim, dia não
  | 'semanal'         // 1x por semana
  | 'personalizado'   // intervalo customizado em dias

export interface CadenciaConfig {
  tipo: CadenciaTipo
  intervalo_dias?: number  // para 'personalizado'
  horario_envio: string    // 'HH:mm'
  max_tentativas: number   // padrão: 8
  canal: 'whatsapp' | 'email' | 'sms'
}

// Mensagem individual da sequência
export interface FollowupMensagem {
  id: string
  followup_config_id: string
  ordem: number             // 1, 2, 3...
  conteudo: string          // template com {{nome}}, {{agente}}, etc.
  tem_midia: boolean
  midia_url?: string
  midia_tipo?: 'imagem' | 'video' | 'documento'
  delay_extra_dias?: number // atraso extra além da cadência base (default: 0)
}

// Config de followup (template reutilizável por org/agenda)
export interface FollowupConfig {
  id: string
  org_id: string
  nome: string              // ex: "Leads Frios - Avaliação"
  ativo: boolean
  cadencia: CadenciaConfig
  mensagens: FollowupMensagem[]
  aplicar_para: 'todos' | 'agenda' // escopo
  agenda_ids?: string[]     // se aplicar_para = 'agenda'
  created_at: string
}

// Estado de cada lead no ciclo de follow-up
export interface FollowupLead {
  id: string
  org_id: string
  // Identificação
  nome?: string
  telefone: string
  email?: string
  // Origem
  origem: LeadOrigem
  utm_source?: string       // ex: 'facebook', 'google'
  utm_medium?: string       // ex: 'cpc', 'social'
  utm_campaign?: string     // nome da campanha
  utm_content?: string      // identificador do anúncio
  utm_term?: string
  // Follow-up
  followup_config_id?: string
  status_followup: LeadStatusFollowup
  tentativa_atual: number   // qual mensagem foi a última enviada
  max_tentativas: number
  proximo_envio?: string    // ISO datetime do próximo disparo
  ultimo_contato?: string   // ISO datetime do último disparo realizado
  ultimo_resumo?: string    // resumo da última conversa pelo agente IA
  // Interesse / Temperatura
  temperatura?: LeadTemperatura
  interesse?: string        // serviço de interesse (ex: "Implante", "Avaliação")
  status_fechamento: LeadStatusFechamento
  // Integração chat
  session_id?: string       // ID da sessão no sistema de chat (CRM Atendimento)
  agente_id?: string        // agente IA responsável
  // Agendamento (se converteu)
  agendamento_id?: string   // referência ao agendamento criado
  // Recorrência (se compareceu)
  recorrencia_ativa: boolean
  recorrencia_config_id?: string
  // Timestamps
  created_at: string
  updated_at: string
}

// ═══════════════════════════════════════════
// RECORRÊNCIA (remarketing pós-atendimento)
// ═══════════════════════════════════════════

export type RecorrenciaTrigger =
  | 'pos_comparecimento'    // X dias após compareceu
  | 'pos_procedimento'      // X dias após procedimento específico
  | 'aniversario'           // aniversário do cliente
  | 'data_fixa'             // data específica no calendário

export interface RecorrenciaConfig {
  id: string
  org_id: string
  nome: string              // ex: "Retorno Implante - 6 meses"
  ativo: boolean
  trigger: RecorrenciaTrigger
  dias_apos_trigger: number // ex: 180 = 6 meses após comparecimento
  filtro_servico?: string   // só aplica se o serviço for X (ex: "Implante")
  filtro_agenda_ids?: string[]
  cadencia: CadenciaConfig
  mensagens: FollowupMensagem[]
  created_at: string
}

// Estado de cada lead na recorrência
export interface RecorrenciaLead {
  id: string
  org_id: string
  followup_lead_id?: string  // referência ao lead original
  agendamento_id: string     // agendamento que triggerou a recorrência
  recorrencia_config_id: string
  nome?: string
  telefone: string
  interesse?: string
  agenda_nome?: string
  data_comparecimento: string // ISO date
  data_trigger_programada: string // quando deve iniciar a recorrência
  status: 'aguardando' | 'ativo' | 'concluido' | 'cancelado'
  tentativa_atual: number
  proximo_envio?: string
  ultimo_contato?: string
  session_id?: string
  created_at: string
}

// ═══════════════════════════════════════════
// FILTROS
// ═══════════════════════════════════════════

export interface FiltrosFollowup {
  status: LeadStatusFollowup | 'todos'
  status_fechamento: LeadStatusFechamento | 'todos'
  temperatura: LeadTemperatura | 'todos'
  origem: LeadOrigem | 'todos'
  agente_id: string
  proximo_envio_range: 'todos' | 'hoje' | 'amanha' | '7dias' | 'atrasados'
  busca: string          // nome ou telefone
  periodo: 'atual' | 'all' | string // 'YYYY-MM'
}
