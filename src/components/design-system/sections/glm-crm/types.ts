// ─── Tipos compartilhados do CRM ──────────────────────────────────────────────

export type Canal = 'whatsapp' | 'instagram' | 'facebook'

export type AvatarVariant = 'azul' | 'roxo' | 'verde' | 'ambar'

export type StageId = 'novo' | 'contato' | 'qualificado' | 'proposta' | 'fechado' | 'perdido'

export type MsgTipo = 'inbound' | 'ia' | 'humano'

export type TemperaturaLead = 'frio' | 'morno' | 'quente' | 'muito-quente'

export type EstagioFollowup =
  | 'primeiro-contato'
  | 'aguardando-resposta'
  | 'em-negociacao'
  | 'agendamento'
  | 'pos-atendimento'
  | 'concluido'

export type StatusResgate = 'nao-aplicavel' | 'em-resgate' | 'resgatado' | 'perdido'

export type QualidadeAtendimento = 'excelente' | 'bom' | 'regular' | 'ruim'

export type EtiquetaVariant =
  | 'indicacoes'
  | 'primeiro-atendimento'
  | 'follow-up'
  | 'vip'
  | 'urgente'

export type NivelUsuario = 'admin' | 'gerente' | 'atendente'

export type StatusConversa = 'novo' | 'em-atendimento' | 'concluido'

export type AgenteAtualTipo = 'ia-comercial' | 'ia-sdr' | 'ia-suporte' | 'humano'

export type AbaId = 'novos' | 'meus' | 'outros'

export type PainelAberto = 'busca' | 'filtro' | 'ordenacao' | null

// ─── Interfaces ────────────────────────────────────────────────────────────────

export interface Mensagem {
  id: string
  tipo: MsgTipo
  texto: string
  hora: string
  remetente?: string
}

export interface Etiqueta {
  label: string
  variant: EtiquetaVariant
}

export interface EtiquetaDetalhe {
  label: string
  bg: string
  color: string
}

export interface ContatoDetalhes {
  nome: string
  nomeCompleto: string
  iniciais: string
  avatarBg: string
  avatarColor: string
  telefone: string
  email: string
  canal: Canal
  canalLabel: string
  canalColor: string
  online: boolean
  primeiroContato: string
  etiquetas: EtiquetaDetalhe[]
  equipe: { nome: string; iniciais: string; bg: string; color: string }
  responsavel: { nome: string; iniciais: string; bg: string; color: string }
  stageAtual: StageId
  origem: { campanha: string; cpl: string }
  ia: { status: string; statusColor: string; msgsRespondidas: number; assumidoEm: string }
  analiseIA: {
    resumoConversa: string
    temperaturaLead: TemperaturaLead
    estagioFollowup: EstagioFollowup
    statusResgate: StatusResgate
    qualidadeAtendimento: QualidadeAtendimento
    scoreAtendimento: number
  }
}

export interface CardConversaData {
  id: string
  nome: string
  iniciais: string
  avatarVariant: AvatarVariant
  canal: Canal
  timestamp: string
  preview: string
  badgeCount?: number
  etiquetas: Etiqueta[]
  equipe: string
  equipeVariant?: 'comercial' | 'posVenda' | 'suporte'
  ativo?: boolean
  agenteAtual: AgenteAtualTipo
  agenteLabel?: string
  status: StatusConversa
  responsavelId?: string
  responsavelNome?: string
  equipeIds: string[]
}

export interface UsuarioAtual {
  id: string
  nome: string
  nivel: NivelUsuario
  equipeIds: string[]
}

export interface PainelRow {
  label: string
  valor: string
  valorColor?: string
}