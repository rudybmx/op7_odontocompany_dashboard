import { 
  FollowupConfig, 
  FollowupLead, 
  LeadOrigem, 
  LeadStatusFollowup, 
  LeadStatusFechamento, 
  LeadTemperatura,
  RecorrenciaConfig,
  RecorrenciaLead
} from "@/types/followup"

import { CampanhaMetrics } from "@/types/campanhas"
import { addDays, subDays, startOfToday, formatISO } from "date-fns"

const hoje = startOfToday()

// ═══════════════════════════════════════════
// CONFIGS DE FOLLOW-UP
// ═══════════════════════════════════════════

export const MOCK_FOLLOWUP_CONFIGS: FollowupConfig[] = [
  {
    id: "conf_1",
    org_id: "org_123",
    nome: "Leads Frios — Clínica",
    ativo: true,
    cadencia: {
      tipo: "diario",
      horario_envio: "09:00",
      max_tentativas: 8,
      canal: "whatsapp"
    },
    mensagens: [
      { id: "m1", followup_config_id: "conf_1", ordem: 1, conteudo: "Olá {{nome}}, tudo bem? Notei que você se interessou pela nossa avaliação mas ainda não agendamos. Posso te ajudar?", tem_midia: false },
      { id: "m2", followup_config_id: "conf_1", ordem: 2, conteudo: "Oi {{nome}}, passando para lembrar que nossa agenda para implantes está com poucas vagas. Vamos garantir a sua?", tem_midia: true, midia_url: "https://example.com/beneficios.jpg", midia_tipo: "imagem" },
      { id: "m3", followup_config_id: "conf_1", ordem: 3, conteudo: "Olá {{nome}}, a Dra. {{agente}} pediu para te avisar que o valor promocional expira amanhã. Quer aproveitar?", tem_midia: false },
      { id: "m4", followup_config_id: "conf_1", ordem: 4, conteudo: "Oi {{nome}}. Infelizmente essa é minha última tentativa de contato por aqui. Se ainda tiver interesse, me avise!", tem_midia: false }
    ],
    aplicar_para: "todos",
    created_at: subDays(hoje, 30).toISOString()
  },
  {
    id: "conf_2",
    org_id: "org_123",
    nome: "Leads Mornos — Semanal",
    ativo: true,
    cadencia: {
      tipo: "semanal",
      horario_envio: "14:00",
      max_tentativas: 5,
      canal: "whatsapp"
    },
    mensagens: [
      { id: "m2_1", followup_config_id: "conf_2", ordem: 1, conteudo: "Olá {{nome}}, como vai seu tratamento? Estamos aqui se precisar de algo.", tem_midia: false }
    ],
    aplicar_para: "agenda",
    agenda_ids: ["ag_1"],
    created_at: subDays(hoje, 60).toISOString()
  }
]

// ═══════════════════════════════════════════
// LEADS DE FOLLOW-UP (30)
// ═══════════════════════════════════════════

const nomesFemininos = ["Ana Silva", "Maria Oliveira", "Juliana Costa", "Beatriz Santos", "Fernanda Lima", "Camila Rocha", "Larissa Souza", "Priscila Mendes", "Débora Antunes", "Gisele Bündchen", "Ivete Sangalo", "Anitta Machado", "Paolla Oliveira", "Bruna Marquezine", "Grazi Massafera"]
const nomesMasculinos = ["João Pereira", "Ricardo Souza", "Marcelo Santos", "Gustavo Lima", "Felipe Diniz", "Rodrigo Alves", "Bruno Garcia", "Tiago Nunes", "André Luiz", "Gabriel Jesus", "Roberto Carlos", "Silvio Santos", "Fausto Silva", "Luan Santana", "Neymar Jr"]

const origens: LeadOrigem[] = ["meta_ads", "google_ads", "whatsapp", "indicacao", "offline"]
const statusFollowup: LeadStatusFollowup[] = ["ativo", "vencido", "respondeu", "esgotado", "encerrado", "pausado"]
const statusFechamento: LeadStatusFechamento[] = ["em_aberto", "ganho", "perca", "perdido"]

export const MOCK_FOLLOWUP_LEADS: FollowupLead[] = Array.from({ length: 30 }).map((_, i) => {
  const isFeminino = i % 2 === 0
  const nome = isFeminino ? nomesFemininos[Math.floor(i/2) % nomesFemininos.length] : nomesMasculinos[Math.floor(i/2) % nomesMasculinos.length]
  const status_f = i < 10 ? 'ativo' : i < 15 ? 'vencido' : i < 20 ? 'respondeu' : i < 25 ? 'esgotado' : i < 28 ? 'encerrado' : 'pausado' as LeadStatusFollowup
  const status_c = i < 18 ? 'em_aberto' : i < 25 ? 'ganho' : i < 28 ? 'perca' : 'perdido' as LeadStatusFechamento
  const origem = i < 15 ? 'meta_ads' : i < 20 ? 'google_ads' : i < 25 ? 'whatsapp' : i < 28 ? 'indicacao' : 'offline' as LeadOrigem
  const temp: LeadTemperatura = i % 3 === 0 ? 'quente' : i % 3 === 1 ? 'morno' : 'frio'

  return {
    id: `lead_${i + 1}`,
    org_id: "org_123",
    nome,
    telefone: `55119${Math.floor(10000000 + Math.random() * 90000000)}`,
    email: nome.toLowerCase().replace(" ", ".") + "@example.com",
    origem,
    utm_campaign: origem === 'meta_ads' ? (i % 2 === 0 ? "implante-jan26" : "avaliacao-fev26") : undefined,
    status_followup: status_f,
    status_fechamento: status_c,
    temperatura: temp,
    tentativa_atual: Math.floor(Math.random() * 8) + 1,
    max_tentativas: 8,
    proximo_envio: status_f === 'ativo' 
      ? formatISO(addDays(hoje, 1).setHours(9 + (i % 8), (i * 10) % 60, 0, 0)) 
      : status_f === 'vencido' 
        ? formatISO(subDays(hoje, 1).setHours(14 + (i % 4), (i * 15) % 60, 0, 0)) 
        : undefined,
    ultimo_contato: subDays(hoje, 1).toISOString(),
    ultimo_resumo: "Lead demonstrou interesse inicial no preço do implante unitário. Aguardando confirmação de horário para avaliação.",
    interesse: i % 2 === 0 ? "Implante" : "Avaliação",
    recorrencia_ativa: false,
    created_at: subDays(hoje, 10 + i).toISOString(),
    updated_at: subDays(hoje, 1).toISOString()
  }
})

// ═══════════════════════════════════════════
// RECORRÊNCIA
// ═══════════════════════════════════════════

export const MOCK_RECORRENCIA_CONFIGS: RecorrenciaConfig[] = [
  {
    id: "rec_conf_1",
    org_id: "org_123",
    nome: "Retorno Implante — 6 meses",
    ativo: true,
    trigger: "pos_comparecimento",
    dias_apos_trigger: 180,
    filtro_servico: "Implante",
    cadencia: {
      tipo: "diario",
      horario_envio: "10:00",
      max_tentativas: 3,
      canal: "whatsapp"
    },
    mensagens: [
      { id: "rm1", followup_config_id: "rec_conf_1", ordem: 1, conteudo: "Olá {{nome}}, faz 6 meses do seu implante! Vamos agendar sua revisão?", tem_midia: false }
    ],
    created_at: subDays(hoje, 200).toISOString()
  },
  {
    id: "rec_conf_2",
    org_id: "org_123",
    nome: "Limpeza Semestral",
    ativo: true,
    trigger: "pos_comparecimento",
    dias_apos_trigger: 180,
    cadencia: {
      tipo: "diario",
      horario_envio: "11:00",
      max_tentativas: 3,
      canal: "whatsapp"
    },
    mensagens: [
      { id: "rm2_1", followup_config_id: "rec_conf_2", ordem: 1, conteudo: "Oi {{nome}}, hora da sua limpeza semestral!", tem_midia: false }
    ],
    created_at: subDays(hoje, 200).toISOString()
  }
]

export const MOCK_RECORRENCIA_LEADS: RecorrenciaLead[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `rec_lead_${i + 1}`,
  org_id: "org_123",
  agendamento_id: `ag_${i + 100}`,
  recorrencia_config_id: i % 2 === 0 ? "rec_conf_1" : "rec_conf_2",
  nome: i % 2 === 0 ? nomesFemininos[i] : nomesMasculinos[i],
  telefone: `551197777${i}000`,
  interesse: i % 2 === 0 ? "Implante" : "Limpeza",
  agenda_nome: "Clínica Central",
  data_comparecimento: subDays(hoje, 150 + i * 5).toISOString(),
  data_trigger_programada: addDays(subDays(hoje, 150 + i * 5), 180).toISOString(),
  status: i < 4 ? 'aguardando' : i < 8 ? 'ativo' : 'concluido',
  tentativa_atual: i < 4 ? 0 : 1,
  created_at: subDays(hoje, 100).toISOString()
}))

// ═══════════════════════════════════════════
// CAMPANHAS
// ═══════════════════════════════════════════

export const MOCK_CAMPANHA_METRICS: CampanhaMetrics[] = [
  {
    campanha_nome: "Meta — implante-jan26",
    plataforma: "meta",
    utm_campaign: "implante-jan26",
    total_leads: 45,
    leads_ativos: 20,
    leads_ganhos: 12,
    leads_percas: 7,
    leads_perdidos: 4,
    leads_esgotados: 2,
    taxa_conversao: 26.6,
    custo_total: 2800,
    custo_por_lead: 62.22,
    custo_por_fechamento: 233.33,
    temperatura_media: "morno"
  },
  {
    campanha_nome: "Meta — avaliacao-fev26",
    plataforma: "meta",
    utm_campaign: "avaliacao-fev26",
    total_leads: 32,
    leads_ativos: 15,
    leads_ganhos: 8,
    leads_percas: 5,
    leads_perdidos: 2,
    leads_esgotados: 2,
    taxa_conversao: 25,
    custo_total: 1500,
    custo_por_lead: 46.87,
    custo_por_fechamento: 187.5,
    temperatura_media: "quente"
  },
  {
    campanha_nome: "Google — clinica-odonto-sp",
    plataforma: "google",
    utm_source: "google",
    total_leads: 18,
    leads_ativos: 8,
    leads_ganhos: 5,
    leads_percas: 3,
    leads_perdidos: 1,
    leads_esgotados: 1,
    taxa_conversao: 27.7,
    custo_total: 900,
    custo_por_lead: 50,
    custo_por_fechamento: 180,
    temperatura_media: "morno"
  },
  {
    campanha_nome: "Instagram — antes-depois-implante",
    plataforma: "meta",
    utm_source: "instagram",
    total_leads: 28,
    leads_ativos: 14,
    leads_ganhos: 6,
    leads_percas: 4,
    leads_perdidos: 2,
    leads_esgotados: 2,
    taxa_conversao: 21.4,
    custo_total: 1200,
    custo_por_lead: 42.85,
    custo_por_fechamento: 200,
    temperatura_media: "frio"
  },
  {
    campanha_nome: "WhatsApp — campanha-offline-mar26",
    plataforma: "whatsapp",
    total_leads: 15,
    leads_ativos: 6,
    leads_ganhos: 4,
    leads_percas: 3,
    leads_perdidos: 1,
    leads_esgotados: 1,
    taxa_conversao: 26.6,
    custo_total: 0,
    custo_por_lead: 0,
    custo_por_fechamento: 0,
    temperatura_media: "quente"
  },
  {
    campanha_nome: "Offline — evento-saude-abr26",
    plataforma: "offline",
    total_leads: 8,
    leads_ativos: 2,
    leads_ganhos: 3,
    leads_percas: 1,
    leads_perdidos: 1,
    leads_esgotados: 1,
    taxa_conversao: 37.5,
    custo_total: 400,
    custo_por_lead: 50,
    custo_por_fechamento: 133.33,
    temperatura_media: "quente"
  }
]
