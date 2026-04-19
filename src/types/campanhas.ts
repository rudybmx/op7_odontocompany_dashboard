import { FollowupLead, LeadTemperatura } from "./followup"

export type CampanhaPlataforma =
  | 'meta'          // Facebook / Instagram
  | 'google'
  | 'linkedin'
  | 'tiktok'
  | 'whatsapp'
  | 'offline'       // panfleto, evento, outdoor
  | 'organico'
  | 'outro'

export interface Campanha {
  id: string
  org_id: string
  nome: string                     // nome amigável
  plataforma: CampanhaPlataforma
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string            // identificador UTM
  custo_total?: number             // R$ investido
  ativo: boolean
  data_inicio: string
  data_fim?: string
  created_at: string
}

// View agregada por campanha (calculada)
export interface CampanhaMetrics {
  campanha_id?: string
  campanha_nome: string
  plataforma: CampanhaPlataforma
  utm_campaign?: string
  utm_source?: string
  total_leads: number
  leads_ativos: number
  leads_ganhos: number
  leads_percas: number
  leads_perdidos: number
  leads_esgotados: number
  taxa_conversao: number           // leads_ganhos / total_leads * 100
  custo_total?: number
  custo_por_lead?: number          // custo_total / total_leads
  custo_por_fechamento?: number    // custo_total / leads_ganhos
  temperatura_media?: LeadTemperatura
  leads?: FollowupLead[]           // populado ao expandir
}

export interface FiltrosCampanhas {
  plataforma: CampanhaPlataforma | 'todas'
  periodo: 'atual' | 'all' | string
  busca: string
}
