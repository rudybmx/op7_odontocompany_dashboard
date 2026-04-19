// ─── Constantes compartilhadas do CRM ──────────────────────────────────────────

import type {
  Canal,
  AvatarVariant,
  EtiquetaVariant,
  StageId,
  TemperaturaLead,
  EstagioFollowup,
  StatusResgate,
  QualidadeAtendimento,
  AgenteAtualTipo,
  NivelUsuario,
} from './types'

// ─── Canais ─────────────────────────────────────────────────────────────────────

export const CANAL_COLORS: Record<Canal, string> = {
  whatsapp: '#1D9E75',
  instagram: '#993556',
  facebook: '#185FA5',
}

export const CANAL_LABELS: Record<Canal, string> = {
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  facebook: 'Facebook',
}

export const CANAL_META: Record<Canal, { label: string; bg: string; color: string }> = {
  whatsapp: { label: 'WA', bg: 'rgba(29,158,117,0.12)', color: '#1D9E75' },
  instagram: { label: 'IG', bg: 'rgba(153,53,86,0.12)', color: '#993556' },
  facebook: { label: 'FB', bg: 'rgba(24,95,165,0.12)', color: '#185FA5' },
}

// ─── Avatares ────────────────────────────────────────────────────────────────────

export const AVATAR_STYLES: Record<AvatarVariant, { bg: string; color: string }> = {
  azul: { bg: '#B5D4F4', color: '#0C447C' },
  roxo: { bg: '#CECBF6', color: '#3C3489' },
  verde: { bg: '#C0DD97', color: '#27500A' },
  ambar: { bg: '#FAC775', color: '#633806' },
}

// ─── Etiquetas ───────────────────────────────────────────────────────────────────

export const ETIQUETA_STYLES: Record<EtiquetaVariant, { bg: string; color: string }> = {
  'indicacoes': { bg: 'rgba(59,109,17,0.12)', color: '#5a9a1f' },
  'primeiro-atendimento': { bg: 'rgba(24,95,165,0.12)', color: '#4a9ae6' },
  'follow-up': { bg: 'rgba(99,56,6,0.12)', color: '#c4850a' },
  'vip': { bg: 'rgba(60,52,137,0.12)', color: '#8b7ef8' },
  'urgente': { bg: 'rgba(163,45,45,0.12)', color: '#e05555' },
}

// ─── Equipes ─────────────────────────────────────────────────────────────────────

export const EQUIPE_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  comercial: { bg: 'rgba(24,95,165,0.12)', color: '#4a9ae6', border: 'rgba(24,95,165,0.20)' },
  posVenda: { bg: 'rgba(60,52,137,0.12)', color: '#8b7ef8', border: 'rgba(60,52,137,0.20)' },
  suporte: { bg: 'rgba(99,56,6,0.12)', color: '#c4850a', border: 'rgba(99,56,6,0.20)' },
}

// ─── Agentes ──────────────────────────────────────────────────────────────────────

export const AGENTE_STYLES: Record<AgenteAtualTipo, { cor: string; icone: string; labelPadrao: string }> = {
  'ia-comercial': { cor: '#4a9ae6', icone: 'robot', labelPadrao: 'Agente Comercial' },
  'ia-sdr': { cor: '#8b7ef8', icone: 'robot', labelPadrao: 'Agente SDR' },
  'ia-suporte': { cor: '#c4850a', icone: 'robot', labelPadrao: 'Agente Suporte' },
  'humano': { cor: '#5a9a1f', icone: 'user', labelPadrao: 'Humano' },
}

// ─── Stages / Pipeline ────────────────────────────────────────────────────────────

export const STAGES: { id: StageId; label: string; cor: string }[] = [
  { id: 'novo', label: 'Novo', cor: '#8B8FA8' },
  { id: 'contato', label: 'Contato', cor: '#185FA5' },
  { id: 'qualificado', label: 'Qualificado', cor: '#0C447C' },
  { id: 'proposta', label: 'Proposta', cor: '#7A5AF8' },
  { id: 'fechado', label: 'Fechado', cor: '#1D9E75' },
  { id: 'perdido', label: 'Perdido', cor: '#A32D2D' },
]

export const STAGE_STYLES: Record<StageId, { bg: string; border: string; color: string; label: string }> = {
  novo: { bg: 'rgba(14,20,42,0.08)', border: 'rgba(14,20,42,0.15)', color: 'var(--ws-text-2)', label: 'Novo' },
  contato: { bg: 'rgba(62,91,255,0.12)', border: 'rgba(62,91,255,0.25)', color: '#2340c4', label: 'Contato' },
  qualificado: { bg: '#B5D4F4', border: '#85B7EB', color: '#0C447C', label: 'Qualificado' },
  proposta: { bg: 'rgba(15,168,86,0.12)', border: 'rgba(15,168,86,0.25)', color: '#007a40', label: 'Proposta' },
  fechado: { bg: '#EAF3DE', border: 'rgba(59,109,17,0.25)', color: '#3B6D11', label: 'Fechado' },
  perdido: { bg: 'rgba(255,92,141,0.12)', border: 'rgba(255,92,141,0.25)', color: '#c2004f', label: 'Perdido' },
}

// ─── Análise IA ──────────────────────────────────────────────────────────────────

export const TEMP_LEAD: Record<TemperaturaLead, { label: string; cor: string; posicao: number }> = {
  frio: { label: 'Frio', cor: '#3B82F6', posicao: 10 },
  morno: { label: 'Morno', cor: '#F59E0B', posicao: 38 },
  quente: { label: 'Quente', cor: '#F97316', posicao: 66 },
  'muito-quente': { label: 'Muito Quente', cor: '#EF4444', posicao: 90 },
}

export const FOLLOWUP_ESTAGIOS: Record<EstagioFollowup, { label: string; cor: string; bg: string }> = {
  'primeiro-contato': { label: '1\u00ba Contato', cor: '#185FA5', bg: '#E6F1FB' },
  'aguardando-resposta': { label: 'Aguardando Resposta', cor: '#F59E0B', bg: '#FEF3C7' },
  'em-negociacao': { label: 'Em Negocia\u00e7\u00e3o', cor: '#7A5AF8', bg: '#EEEDFE' },
  agendamento: { label: 'Agendamento', cor: '#1D9E75', bg: '#D1FAE5' },
  'pos-atendimento': { label: 'P\u00f3s-Atendimento', cor: '#6B7280', bg: '#F3F4F6' },
  concluido: { label: 'Conclu\u00eddo', cor: '#1D9E75', bg: '#D1FAE5' },
}

export const STATUS_RESGATE: Record<StatusResgate, { label: string; cor: string; bg: string }> = {
  'nao-aplicavel': { label: '\u2014', cor: '#6B7280', bg: 'transparent' },
  'em-resgate': { label: 'Em Resgate', cor: '#F59E0B', bg: '#FEF3C7' },
  resgatado: { label: 'Resgatado', cor: '#1D9E75', bg: '#D1FAE5' },
  perdido: { label: 'Perdido', cor: '#EF4444', bg: '#FEE2E2' },
}

export const QUALIDADE: Record<QualidadeAtendimento, { label: string; cor: string; emoji: string }> = {
  excelente: { label: 'Excelente', cor: '#1D9E75', emoji: '\uD83D\uDFE2' },
  bom: { label: 'Bom', cor: '#3B82F6', emoji: '\uD83D\uDFE2' },
  regular: { label: 'Regular', cor: '#F59E0B', emoji: '\uD83D\uDFE1' },
  ruim: { label: 'Ruim', cor: '#EF4444', emoji: '\uD83D\uDD34' },
}

// ─── Permissões ────────────────────────────────────────────────────────────────────

export const NIVEL_LABELS: Record<NivelUsuario, string> = {
  admin: 'Administrador',
  gerente: 'Gerente',
  atendente: 'Atendente',
}

// ─── Busca categorias ──────────────────────────────────────────────────────────────

export const BUSCA_CATEGORIAS = [
  { id: 'abertos', label: 'Abertos' },
  { id: 'novos', label: 'Novos' },
  { id: 'meus', label: 'Meus' },
  { id: 'outros', label: 'Outros' },
  { id: 'contatos', label: 'Contatos' },
  { id: 'grupos', label: 'Grupos' },
  { id: 'concluidos', label: 'Conclu\u00eddos' },
] as const

export const FILTRO_ITEMS = [
  { iconKey: 'network', label: 'Canais' },
  { iconKey: 'tag', label: 'Etiquetas' },
  { iconKey: 'users', label: 'Usu\u00e1rios' },
  { iconKey: 'briefcase', label: 'Equipes' },
] as const