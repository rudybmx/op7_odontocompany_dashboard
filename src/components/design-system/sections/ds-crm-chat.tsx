'use client'
import { useState, useMemo } from 'react'
import { ArrowRightLeft, X, CheckCheck } from 'lucide-react'
import { CrmListaConversas } from './ds-crm-inbox'
import type { CardConversaData } from './ds-crm-inbox'

// ─── Tipos ────────────────────────────────────────────────────────────────────

type MsgTipo = 'inbound' | 'ia' | 'humano'
type StageId = 'novo' | 'contato' | 'qualificado' | 'proposta' | 'fechado' | 'perdido'
type Canal = 'whatsapp' | 'instagram' | 'facebook'
type TemperaturaLead = 'frio' | 'morno' | 'quente' | 'muito-quente'
type EstagioFollowup = 'primeiro-contato' | 'aguardando-resposta' | 'em-negociacao' | 'agendamento' | 'pos-atendimento' | 'concluido'
type StatusResgate = 'nao-aplicavel' | 'em-resgate' | 'resgatado' | 'perdido'
type QualidadeAtendimento = 'excelente' | 'bom' | 'regular' | 'ruim'

interface Mensagem {
  id: string
  tipo: MsgTipo
  texto: string
  hora: string
  remetente?: string
}

interface ContatoDetalhes {
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
  etiquetas: { label: string; bg: string; color: string }[]
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
    scoreAtendimento: number // 0-100
  }
}

interface PainelRow {
  label: string
  valor: string
  valorColor?: string
}

// ─── Cores de canal ───────────────────────────────────────────────────────────

const CANAL_COLORS: Record<Canal, string> = {
  whatsapp:  '#1D9E75',
  instagram: '#993556',
  facebook:  '#185FA5',
}

const CANAL_LABELS: Record<Canal, string> = {
  whatsapp:  'WhatsApp',
  instagram: 'Instagram',
  facebook:  'Facebook',
}

// ─── Mensagens por conversa ───────────────────────────────────────────────────
//
// Em produção: substituir por fetch/websocket com paginação.
// Cada array é independente — facilita cache e lazy loading.

const MENSAGENS: Record<string, Mensagem[]> = {
  'conv-1': [
    { id: 'm1-1', tipo: 'inbound', texto: 'Olá! Gostaria de saber mais sobre o implante dentário. Tem alguma promoção disponível?', hora: '14:20' },
    { id: 'm1-2', tipo: 'ia', texto: 'Olá, Anthony! 😊 Temos condições especiais este mês. O implante de titânio a partir de R$ 1.890 em até 18x sem juros. Posso te ajudar com mais detalhes?', hora: '14:21', remetente: 'IA Agente' },
    { id: 'm1-3', tipo: 'inbound', texto: 'Ótimo! E quanto tempo dura o procedimento completo?', hora: '14:22' },
    { id: 'm1-4', tipo: 'humano', texto: 'Boa tarde! A cirurgia dura ~1h, mas a osseointegração leva de 3 a 6 meses. Posso agendar uma avaliação gratuita pra você?', hora: '14:25', remetente: 'Dra. Ana Lima' },
    { id: 'm1-5', tipo: 'ia', texto: 'Tenho horários amanhã às 9h, 11h ou 15h. Qual prefere? A consulta de avaliação é totalmente sem custo! 🦷', hora: '14:26', remetente: 'IA Agente' },
  ],
  'conv-2': [
    { id: 'm2-1', tipo: 'inbound', texto: 'Oi, quero saber sobre o implante. Quanto custa?', hora: '14:30' },
    { id: 'm2-2', tipo: 'ia', texto: 'Olá, Maria Clara! 😊 O valor varia conforme o caso. Temos opções a partir de R$ 1.890. Posso te ajudar com uma avaliação?', hora: '14:31', remetente: 'IA Agente' },
    { id: 'm2-3', tipo: 'inbound', texto: 'Sim! Tem horário essa semana?', hora: '14:32' },
  ],
  'conv-3': [
    { id: 'm3-1', tipo: 'inbound', texto: 'Vocês fazem lente de contato dental?', hora: '09:15' },
    { id: 'm3-2', tipo: 'ia', texto: 'Olá Lucas! Sim, trabalhamos com lentes de contato dental. O procedimento é minimamente invasivo e o resultado é incrível! Quer saber mais sobre valores e prazos?', hora: '09:16', remetente: 'IA Agente' },
    { id: 'm3-3', tipo: 'inbound', texto: 'Quanto fica pra arcada completa?', hora: '09:17' },
    { id: 'm3-4', tipo: 'ia', texto: 'Para a arcada completa, o investimento fica entre R$ 8.000 e R$ 15.000 dependendo do material. Posso agendar uma avaliação gratuita?', hora: '09:18', remetente: 'IA Agente' },
  ],
  'conv-4': [
    { id: 'm4-1', tipo: 'inbound', texto: 'Bom dia! Gostaria de agendar uma consulta de urgência.', hora: '08:44' },
    { id: 'm4-2', tipo: 'ia', texto: 'Bom dia, Sandra! Claro, qual o motivo da urgência? Assim consigo direcionar para o profissional certo.', hora: '08:45', remetente: 'IA Agente' },
    { id: 'm4-3', tipo: 'inbound', texto: 'Estou com muita dor no dente do fundo, desde ontem à noite', hora: '08:46' },
  ],
  'conv-5': [
    { id: 'm5-1', tipo: 'inbound', texto: 'Doutora, tem horário pra amanhã?', hora: '11:15' },
    { id: 'm5-2', tipo: 'humano', texto: 'Oi João! Tenho sim, às 10h ou às 14h. Qual prefere?', hora: '11:18', remetente: 'Dra. Ana Lima' },
    { id: 'm5-3', tipo: 'inbound', texto: 'Pode ser às 14h!', hora: '11:20' },
    { id: 'm5-4', tipo: 'humano', texto: 'Perfeito! Agendado pra amanhã às 14h. Lembre de trazer os exames que pedi na última consulta 📋', hora: '11:22', remetente: 'Dra. Ana Lima' },
  ],
  'conv-6': [
    { id: 'm6-1', tipo: 'inbound', texto: 'Doutora, quero agradecer pelo atendimento de ontem. Ficou perfeito!', hora: '16:00' },
    { id: 'm6-2', tipo: 'humano', texto: 'Que bom, Carla! Fico muito feliz! Qualquer coisa é só chamar 😊', hora: '16:05', remetente: 'Dra. Ana Lima' },
    { id: 'm6-3', tipo: 'inbound', texto: 'Obrigada pelo atendimento, doutora!', hora: '16:10' },
  ],
  'conv-7': [
    { id: 'm7-1', tipo: 'inbound', texto: 'Posso remarcar pro dia 15?', hora: '10:00' },
    { id: 'm7-2', tipo: 'humano', texto: 'Claro, Rafaela! Remarquei para o dia 15 às 9h. Tudo certo?', hora: '10:15', remetente: 'Dra. Ana Lima' },
  ],
  'conv-8': [
    { id: 'm8-1', tipo: 'inbound', texto: 'Boa tarde, ainda não recebi o retorno sobre o meu caso.', hora: '15:00' },
    { id: 'm8-2', tipo: 'humano', texto: 'Oi Pedro, peço desculpas pela demora. Vou verificar com a equipe e te retorno até amanhã.', hora: '15:30', remetente: 'Dr. Carlos' },
    { id: 'm8-3', tipo: 'inbound', texto: 'Tudo bem, obrigado. Fico no aguardo.', hora: '15:32' },
  ],
  'conv-9': [
    { id: 'm9-1', tipo: 'inbound', texto: 'Quero fazer a revisão do protocolo que combinamos', hora: '09:00' },
    { id: 'm9-2', tipo: 'humano', texto: 'Oi Fernanda! Claro, vou agendar a sua revisão. Pode ser na próxima quarta?', hora: '09:30', remetente: 'Dr. João' },
  ],
  'conv-10': [
    { id: 'm10-1', tipo: 'inbound', texto: 'Preciso do laudo pra o convênio, pode me enviar?', hora: '11:00' },
    { id: 'm10-2', tipo: 'humano', texto: 'Oi Bruno! Vou preparar e enviar por e-mail ainda hoje.', hora: '11:45', remetente: 'Dr. João' },
  ],
}

// ─── Detalhes de contato por conversa ─────────────────────────────────────────
//
// Em produção: substituir por fetch ao selecionar a conversa.

const CONTATOS: Record<string, ContatoDetalhes> = {
  'conv-1': {
    nome: 'Anthony', nomeCompleto: 'Anthony Ferreira', iniciais: 'AN',
    avatarBg: '#B5D4F4', avatarColor: '#0C447C',
    telefone: '+55 11 99887-7665', email: 'anthony@email.com',
    canal: 'whatsapp', canalLabel: 'WhatsApp', canalColor: '#1D9E75', online: true,
    primeiroContato: '12/01/2025',
    etiquetas: [
      { label: 'Indicações', bg: '#EAF3DE', color: '#3B6D11' },
      { label: 'Primeiro Atendimento', bg: '#E6F1FB', color: '#185FA5' },
    ],
    equipe: { nome: 'Comercial', iniciais: 'C', bg: '#E6F1FB', color: '#185FA5' },
    responsavel: { nome: 'Dra. Ana Lima', iniciais: 'AL', bg: '#FAC775', color: '#633806' },
    stageAtual: 'qualificado',
    origem: { campanha: 'Oral Sin', cpl: 'R$ 0,84' },
    ia: { status: 'Ativa', statusColor: '#1D9E75', msgsRespondidas: 3, assumidoEm: '14:21' },
    analiseIA: {
      resumoConversa: 'Lead demonstrou alto interesse em implante dentário. Perguntou sobre promoções e tempo de procedimento. Recebeu proposta de avaliação gratuita com horários disponíveis.',
      temperaturaLead: 'quente',
      estagioFollowup: 'agendamento',
      statusResgate: 'nao-aplicavel',
      qualidadeAtendimento: 'excelente',
      scoreAtendimento: 92,
    },
  },
  'conv-2': {
    nome: 'Maria Clara', nomeCompleto: 'Maria Clara Santos', iniciais: 'MC',
    avatarBg: '#CECBF6', avatarColor: '#3C3489',
    telefone: '+55 21 98765-4321', email: 'maria.clara@email.com',
    canal: 'instagram', canalLabel: 'Instagram', canalColor: '#993556', online: true,
    primeiroContato: '10/04/2025',
    etiquetas: [{ label: 'Primeiro Atendimento', bg: '#E6F1FB', color: '#185FA5' }],
    equipe: { nome: 'Comercial', iniciais: 'C', bg: '#E6F1FB', color: '#185FA5' },
    responsavel: { nome: 'Não atribuído', iniciais: '—', bg: '#D1D5DB', color: '#6B7280' },
    stageAtual: 'novo',
    origem: { campanha: 'Implantes Digital', cpl: 'R$ 1,20' },
    ia: { status: 'Ativa', statusColor: '#1D9E75', msgsRespondidas: 1, assumidoEm: '14:31' },
    analiseIA: {
      resumoConversa: 'Lead perguntou sobre implante e valores. Demonstrou interesse imediato em agendar. Aguardando confirmação de horário.',
      temperaturaLead: 'quente',
      estagioFollowup: 'primeiro-contato',
      statusResgate: 'nao-aplicavel',
      qualidadeAtendimento: 'bom',
      scoreAtendimento: 78,
    },
  },
  'conv-3': {
    nome: 'Lucas Mendes', nomeCompleto: 'Lucas Mendes Silva', iniciais: 'LM',
    avatarBg: '#C0DD97', avatarColor: '#27500A',
    telefone: '+55 31 99654-3210', email: 'lucas.m@email.com',
    canal: 'facebook', canalLabel: 'Facebook', canalColor: '#185FA5', online: false,
    primeiroContato: '11/04/2025',
    etiquetas: [{ label: 'Primeiro Atendimento', bg: '#E6F1FB', color: '#185FA5' }],
    equipe: { nome: 'Comercial', iniciais: 'C', bg: '#E6F1FB', color: '#185FA5' },
    responsavel: { nome: 'Não atribuído', iniciais: '—', bg: '#D1D5DB', color: '#6B7280' },
    stageAtual: 'novo',
    origem: { campanha: 'Lentes Dental', cpl: 'R$ 2,10' },
    ia: { status: 'Ativa', statusColor: '#1D9E75', msgsRespondidas: 2, assumidoEm: '09:16' },
    analiseIA: {
      resumoConversa: 'Lead interessado em lentes de contato dental. Perguntou sobre arcada completa. Recebeu faixa de preço e convite para avaliação.',
      temperaturaLead: 'morno',
      estagioFollowup: 'aguardando-resposta',
      statusResgate: 'nao-aplicavel',
      qualidadeAtendimento: 'bom',
      scoreAtendimento: 80,
    },
  },
  'conv-4': {
    nome: 'Sandra Vieira', nomeCompleto: 'Sandra Vieira Costa', iniciais: 'SV',
    avatarBg: '#FAC775', avatarColor: '#633806',
    telefone: '+55 11 91234-5678', email: 'sandra.v@email.com',
    canal: 'whatsapp', canalLabel: 'WhatsApp', canalColor: '#1D9E75', online: true,
    primeiroContato: '12/04/2025',
    etiquetas: [{ label: 'Urgente', bg: '#FCEBEB', color: '#A32D2D' }],
    equipe: { nome: 'Suporte', iniciais: 'S', bg: '#FAEEDA', color: '#633806' },
    responsavel: { nome: 'Não atribuído', iniciais: '—', bg: '#D1D5DB', color: '#6B7280' },
    stageAtual: 'novo',
    origem: { campanha: 'Orgânico', cpl: '—' },
    ia: { status: 'Ativa', statusColor: '#1D9E75', msgsRespondidas: 1, assumidoEm: '08:45' },
    analiseIA: {
      resumoConversa: 'Paciente com urgência odontológica (dor intensa). Precisa de atendimento imediato. IA direcionando para profissional disponível.',
      temperaturaLead: 'muito-quente',
      estagioFollowup: 'primeiro-contato',
      statusResgate: 'nao-aplicavel',
      qualidadeAtendimento: 'bom',
      scoreAtendimento: 75,
    },
  },
  'conv-5': {
    nome: 'João Paulo', nomeCompleto: 'João Paulo Ribeiro', iniciais: 'JP',
    avatarBg: '#C0DD97', avatarColor: '#27500A',
    telefone: '+55 11 97654-1234', email: 'joao.p@email.com',
    canal: 'whatsapp', canalLabel: 'WhatsApp', canalColor: '#1D9E75', online: false,
    primeiroContato: '05/03/2025',
    etiquetas: [{ label: 'Follow-up', bg: '#FAEEDA', color: '#633806' }],
    equipe: { nome: 'Comercial', iniciais: 'C', bg: '#E6F1FB', color: '#185FA5' },
    responsavel: { nome: 'Dra. Ana Lima', iniciais: 'AL', bg: '#FAC775', color: '#633806' },
    stageAtual: 'proposta',
    origem: { campanha: 'Oral Sin', cpl: 'R$ 0,92' },
    ia: { status: 'Pausada', statusColor: '#F59E0B', msgsRespondidas: 0, assumidoEm: '—' },
    analiseIA: {
      resumoConversa: 'Paciente em follow-up para agendamento de retorno. Confirmou horário para amanhã às 14h. Precisa trazer exames anteriores.',
      temperaturaLead: 'morno',
      estagioFollowup: 'agendamento',
      statusResgate: 'nao-aplicavel',
      qualidadeAtendimento: 'excelente',
      scoreAtendimento: 95,
    },
  },
  'conv-6': {
    nome: 'Carla Souza', nomeCompleto: 'Carla Souza Menezes', iniciais: 'CS',
    avatarBg: '#CECBF6', avatarColor: '#3C3489',
    telefone: '+55 21 99111-2233', email: 'carla.s@email.com',
    canal: 'whatsapp', canalLabel: 'WhatsApp', canalColor: '#1D9E75', online: false,
    primeiroContato: '15/01/2025',
    etiquetas: [{ label: 'VIP', bg: '#EEEDFE', color: '#3C3489' }],
    equipe: { nome: 'Comercial', iniciais: 'C', bg: '#E6F1FB', color: '#185FA5' },
    responsavel: { nome: 'Dra. Ana Lima', iniciais: 'AL', bg: '#FAC775', color: '#633806' },
    stageAtual: 'fechado',
    origem: { campanha: 'Indicação', cpl: '—' },
    ia: { status: 'Inativa', statusColor: '#6B7280', msgsRespondidas: 0, assumidoEm: '—' },
    analiseIA: {
      resumoConversa: 'Paciente VIP satisfeita com tratamento concluído. Elogiou atendimento. Potencial para indicações futuras.',
      temperaturaLead: 'frio',
      estagioFollowup: 'pos-atendimento',
      statusResgate: 'nao-aplicavel',
      qualidadeAtendimento: 'excelente',
      scoreAtendimento: 98,
    },
  },
  'conv-7': {
    nome: 'Rafaela Dias', nomeCompleto: 'Rafaela Dias Oliveira', iniciais: 'RD',
    avatarBg: '#B5D4F4', avatarColor: '#0C447C',
    telefone: '+55 11 98888-7777', email: 'rafaela.d@email.com',
    canal: 'instagram', canalLabel: 'Instagram', canalColor: '#993556', online: false,
    primeiroContato: '20/02/2025',
    etiquetas: [{ label: 'Primeiro Atendimento', bg: '#E6F1FB', color: '#185FA5' }],
    equipe: { nome: 'Comercial', iniciais: 'C', bg: '#E6F1FB', color: '#185FA5' },
    responsavel: { nome: 'Dra. Ana Lima', iniciais: 'AL', bg: '#FAC775', color: '#633806' },
    stageAtual: 'contato',
    origem: { campanha: 'Oral Sin', cpl: 'R$ 1,05' },
    ia: { status: 'Pausada', statusColor: '#F59E0B', msgsRespondidas: 0, assumidoEm: '—' },
    analiseIA: {
      resumoConversa: 'Paciente solicitou remarcação de consulta. Reagendada para dia 15 às 9h. Sem pendências.',
      temperaturaLead: 'morno',
      estagioFollowup: 'agendamento',
      statusResgate: 'nao-aplicavel',
      qualidadeAtendimento: 'bom',
      scoreAtendimento: 82,
    },
  },
  'conv-8': {
    nome: 'Pedro Torres', nomeCompleto: 'Pedro Torres Gomes', iniciais: 'PT',
    avatarBg: '#B5D4F4', avatarColor: '#0C447C',
    telefone: '+55 11 96543-2100', email: 'pedro.t@email.com',
    canal: 'whatsapp', canalLabel: 'WhatsApp', canalColor: '#1D9E75', online: false,
    primeiroContato: '10/12/2024',
    etiquetas: [{ label: 'Urgente', bg: '#FCEBEB', color: '#A32D2D' }],
    equipe: { nome: 'Suporte', iniciais: 'S', bg: '#FAEEDA', color: '#633806' },
    responsavel: { nome: 'Dr. Carlos', iniciais: 'CM', bg: '#C0DD97', color: '#27500A' },
    stageAtual: 'contato',
    origem: { campanha: 'Orgânico', cpl: '—' },
    ia: { status: 'Inativa', statusColor: '#6B7280', msgsRespondidas: 0, assumidoEm: '—' },
    analiseIA: {
      resumoConversa: 'Paciente insatisfeito com demora no retorno. Risco de perda. Equipe de suporte acionada para resposta urgente.',
      temperaturaLead: 'frio',
      estagioFollowup: 'aguardando-resposta',
      statusResgate: 'em-resgate',
      qualidadeAtendimento: 'regular',
      scoreAtendimento: 45,
    },
  },
  'conv-9': {
    nome: 'Fernanda Lima', nomeCompleto: 'Fernanda Lima Souza', iniciais: 'FL',
    avatarBg: '#FAC775', avatarColor: '#633806',
    telefone: '+55 31 97777-6666', email: 'fernanda.l@email.com',
    canal: 'whatsapp', canalLabel: 'WhatsApp', canalColor: '#1D9E75', online: true,
    primeiroContato: '08/02/2025',
    etiquetas: [{ label: 'Follow-up', bg: '#FAEEDA', color: '#633806' }],
    equipe: { nome: 'Comercial', iniciais: 'C', bg: '#E6F1FB', color: '#185FA5' },
    responsavel: { nome: 'Dr. João', iniciais: 'JR', bg: '#C0DD97', color: '#27500A' },
    stageAtual: 'qualificado',
    origem: { campanha: 'Implantes Digital', cpl: 'R$ 1,50' },
    ia: { status: 'Pausada', statusColor: '#F59E0B', msgsRespondidas: 0, assumidoEm: '—' },
    analiseIA: {
      resumoConversa: 'Lead em negociação de protocolo. Agendamento de revisão para próxima semana. Interesse confirmado.',
      temperaturaLead: 'quente',
      estagioFollowup: 'em-negociacao',
      statusResgate: 'resgatado',
      qualidadeAtendimento: 'bom',
      scoreAtendimento: 74,
    },
  },
  'conv-10': {
    nome: 'Bruno Alves', nomeCompleto: 'Bruno Alves Pereira', iniciais: 'BA',
    avatarBg: '#C0DD97', avatarColor: '#27500A',
    telefone: '+55 11 91111-0000', email: 'bruno.a@email.com',
    canal: 'whatsapp', canalLabel: 'WhatsApp', canalColor: '#1D9E75', online: false,
    primeiroContato: '01/03/2025',
    etiquetas: [{ label: 'Indicações', bg: '#EAF3DE', color: '#3B6D11' }],
    equipe: { nome: 'Comercial', iniciais: 'C', bg: '#E6F1FB', color: '#185FA5' },
    responsavel: { nome: 'Dr. João', iniciais: 'JR', bg: '#C0DD97', color: '#27500A' },
    stageAtual: 'proposta',
    origem: { campanha: 'Indicação', cpl: '—' },
    ia: { status: 'Inativa', statusColor: '#6B7280', msgsRespondidas: 0, assumidoEm: '—' },
    analiseIA: {
      resumoConversa: 'Lead solicitou laudo para convênio. Documento em preparação. Potencial para tratamento completo via convênio.',
      temperaturaLead: 'morno',
      estagioFollowup: 'em-negociacao',
      statusResgate: 'nao-aplicavel',
      qualidadeAtendimento: 'bom',
      scoreAtendimento: 70,
    },
  },
}

// ─── Constantes visuais da Análise IA ─────────────────────────────────────────

const TEMP_LEAD: Record<TemperaturaLead, { label: string; cor: string; posicao: number }> = {
  'frio':          { label: 'Frio',          cor: '#3B82F6', posicao: 10 },
  'morno':         { label: 'Morno',         cor: '#F59E0B', posicao: 38 },
  'quente':        { label: 'Quente',        cor: '#F97316', posicao: 66 },
  'muito-quente':  { label: 'Muito Quente',  cor: '#EF4444', posicao: 90 },
}

const FOLLOWUP_ESTAGIOS: Record<EstagioFollowup, { label: string; cor: string; bg: string }> = {
  'primeiro-contato':     { label: '1º Contato',          cor: '#185FA5', bg: '#E6F1FB' },
  'aguardando-resposta':  { label: 'Aguardando Resposta', cor: '#F59E0B', bg: '#FEF3C7' },
  'em-negociacao':        { label: 'Em Negociação',       cor: '#7A5AF8', bg: '#EEEDFE' },
  'agendamento':          { label: 'Agendamento',         cor: '#1D9E75', bg: '#D1FAE5' },
  'pos-atendimento':      { label: 'Pós-Atendimento',     cor: '#6B7280', bg: '#F3F4F6' },
  'concluido':            { label: 'Concluído',           cor: '#1D9E75', bg: '#D1FAE5' },
}

const STATUS_RESGATE: Record<StatusResgate, { label: string; cor: string; bg: string }> = {
  'nao-aplicavel': { label: '—',             cor: '#6B7280', bg: 'transparent' },
  'em-resgate':    { label: 'Em Resgate',    cor: '#F59E0B', bg: '#FEF3C7' },
  'resgatado':     { label: 'Resgatado',     cor: '#1D9E75', bg: '#D1FAE5' },
  'perdido':       { label: 'Perdido',       cor: '#EF4444', bg: '#FEE2E2' },
}

const QUALIDADE: Record<QualidadeAtendimento, { label: string; cor: string; emoji: string }> = {
  'excelente': { label: 'Excelente', cor: '#1D9E75', emoji: '🟢' },
  'bom':       { label: 'Bom',       cor: '#3B82F6', emoji: '🔵' },
  'regular':   { label: 'Regular',   cor: '#F59E0B', emoji: '🟡' },
  'ruim':      { label: 'Ruim',      cor: '#EF4444', emoji: '🔴' },
}

const STAGES: { id: StageId; label: string; cor: string }[] = [
  { id: 'novo',        label: 'Novo',        cor: '#8B8FA8' },
  { id: 'contato',     label: 'Contato',     cor: '#185FA5' },
  { id: 'qualificado', label: 'Qualificado', cor: '#0C447C' },
  { id: 'proposta',    label: 'Proposta',    cor: '#7A5AF8' },
  { id: 'fechado',     label: 'Fechado',     cor: '#1D9E75' },
  { id: 'perdido',     label: 'Perdido',     cor: '#A32D2D' },
]

// ─── SVG Ícones inline ────────────────────────────────────────────────────────

function IconEmoji() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  )
}

function IconAnexo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  )
}

function IconMicrofone() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  )
}

// ─── Botão de ação (estilo ds-botoes.tsx) ─────────────────────────────────────

function AcaoBtn({ label, variant, icon }: {
  label: string
  variant: 'ghost' | 'danger' | 'primary'
  icon?: React.ReactNode
}) {
  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 4,
    height: 28, padding: '0 10px',
    borderRadius: 'var(--ws-radius-md)',
    fontSize: 11, fontWeight: 500,
    cursor: 'pointer',
    transition: 'var(--ws-transition)',
  }

  const variantStyle: React.CSSProperties =
    variant === 'primary'
      ? { background: 'linear-gradient(135deg, #3E5BFF, #7A5AF8)', color: 'white', border: 'none', boxShadow: '0 4px 16px rgba(62,91,255,0.35)' }
      : variant === 'danger'
      ? { background: 'rgba(255,92,141,0.12)', border: '1px solid rgba(255,92,141,0.25)', color: '#c2004f' }
      : { background: 'transparent', border: '1px solid var(--ws-divider)', color: 'var(--ws-text-2)' }

  return (
    <button
      type="button"
      style={{ ...base, ...variantStyle }}
      onMouseEnter={e => {
        if (variant === 'primary') {
          e.currentTarget.style.boxShadow = '0 6px 24px rgba(62,91,255,0.50)'
          e.currentTarget.style.transform = 'translateY(-1px)'
        } else if (variant === 'ghost') {
          e.currentTarget.style.background = 'rgba(62,91,255,0.06)'
        }
      }}
      onMouseLeave={e => {
        if (variant === 'primary') {
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(62,91,255,0.35)'
          e.currentTarget.style.transform = ''
        } else if (variant === 'ghost') {
          e.currentTarget.style.background = 'transparent'
        }
      }}
    >
      {icon}
      {label}
    </button>
  )
}

// ─── Cabeçalho do chat (dinâmico) ─────────────────────────────────────────────

function ChatHeader({ contato, onTogglePainel }: {
  contato: ContatoDetalhes
  onTogglePainel: () => void
}) {
  return (
    <div style={{
      height: 48, flexShrink: 0,
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '0 12px',
      borderBottom: '1px solid var(--ws-glass-border)',
    }}>
      {/* Avatar 32px */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: contato.avatarBg, color: contato.avatarColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 600,
        }}>{contato.iniciais}</div>
        <div style={{
          position: 'absolute', bottom: -1, right: -1,
          width: 10, height: 10, borderRadius: '50%',
          background: contato.canalColor,
          border: '2px solid var(--ws-glass-bg)',
        }} />
      </div>

      {/* Nome + canal */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            onClick={onTogglePainel}
            style={{
              fontSize: 13, fontWeight: 500, color: 'var(--ws-text-1)', flexShrink: 0,
              cursor: 'pointer',
              transition: 'color 200ms',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--ws-blue)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--ws-text-1)'}
          >
            {contato.nome}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: contato.canalColor }} />
            <span style={{ fontSize: 11, color: 'var(--ws-text-3)' }}>{contato.canalLabel}</span>
          </div>
          {contato.online && (
            <span style={{ fontSize: 11, color: '#1D9E75', flexShrink: 0 }}>· online</span>
          )}
        </div>
      </div>

      {/* Ações */}
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        <AcaoBtn label="Transferir" variant="ghost"   icon={<ArrowRightLeft size={12} />} />
        <AcaoBtn label="Fechar"     variant="danger"  icon={<X size={12} />} />
        <AcaoBtn label="Resolver"   variant="primary" icon={<CheckCheck size={12} />} />
      </div>
    </div>
  )
}

// ─── Bolha de mensagem ────────────────────────────────────────────────────────

function BolhaMsg({ msg }: { msg: Mensagem }) {
  if (msg.tipo === 'inbound') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 3, alignSelf: 'flex-start', maxWidth: '68%' }}>
        <div style={{
          background: 'var(--ws-glass-bg)',
          border: '1px solid var(--ws-glass-border)',
          borderRadius: '12px 12px 12px 3px',
          padding: '8px 12px',
        }}>
          <span style={{ fontSize: 13, color: 'var(--ws-text-1)', lineHeight: 1.45 }}>{msg.texto}</span>
        </div>
        <span style={{ fontSize: 10, color: 'var(--ws-text-3)' }}>{msg.hora}</span>
      </div>
    )
  }

  if (msg.tipo === 'ia') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, alignSelf: 'flex-end', maxWidth: '68%' }}>
        <span style={{
          background: 'rgba(60,52,137,0.15)', color: '#8b7ef8',
          fontSize: 10, fontWeight: 500, padding: '1px 8px',
          borderRadius: 9999,
        }}>IA Agente</span>
        <div style={{
          background: 'rgba(62,91,255,0.12)',
          border: '1px solid rgba(62,91,255,0.25)',
          borderRadius: '12px 12px 3px 12px',
          padding: '8px 12px',
        }}>
          <span style={{ fontSize: 13, color: 'var(--ws-text-1)', lineHeight: 1.45 }}>{msg.texto}</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <span style={{ fontSize: 10, color: 'var(--ws-text-3)' }}>{msg.hora}</span>
          {msg.remetente && <span style={{ fontSize: 10, color: 'var(--ws-text-3)' }}>· {msg.remetente}</span>}
        </div>
      </div>
    )
  }

  // outbound humano
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, alignSelf: 'flex-end', maxWidth: '68%' }}>
      <span style={{
        background: 'rgba(59,109,17,0.15)', color: '#5a9a1f',
        fontSize: 10, fontWeight: 500, padding: '1px 8px',
        borderRadius: 9999,
      }}>Atendente</span>
      <div style={{
        background: '#3E5BFF',
        borderRadius: '12px 12px 3px 12px',
        padding: '8px 12px',
      }}>
        <span style={{ fontSize: 13, color: 'white', lineHeight: 1.45 }}>{msg.texto}</span>
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        <span style={{ fontSize: 10, color: 'var(--ws-text-3)' }}>{msg.hora}</span>
        {msg.remetente && <span style={{ fontSize: 10, color: 'var(--ws-text-3)' }}>· {msg.remetente}</span>}
      </div>
    </div>
  )
}

// ─── Área de mensagens (dinâmica) ─────────────────────────────────────────────

function AreaMensagens({ mensagens }: { mensagens: Mensagem[] }) {
  return (
    <div style={{
      flex: 1, overflowY: 'auto', scrollbarWidth: 'thin',
      padding: '12px 16px',
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      {mensagens.length === 0 ? (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 32, opacity: 0.3 }}>💬</span>
          <span style={{ fontSize: 13, color: 'var(--ws-text-3)' }}>
            Selecione uma conversa para começar
          </span>
        </div>
      ) : (
        mensagens.map(msg => <BolhaMsg key={msg.id} msg={msg} />)
      )}
    </div>
  )
}

// ─── Área de input ────────────────────────────────────────────────────────────

function InputArea({ campanha }: { campanha?: string }) {
  const [iaAtivo, setIaAtivo] = useState(true)
  const [msg, setMsg] = useState('')

  return (
    <div style={{
      flexShrink: 0,
      borderTop: '1px solid var(--ws-glass-border)',
      padding: '8px 12px 10px',
    }}>
      {/* Linha 1 — toggle IA + campanha */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: 'var(--ws-text-2)', fontWeight: 500 }}>IA Agente</span>
        <div
          role="switch"
          aria-checked={iaAtivo}
          onClick={() => setIaAtivo(a => !a)}
          style={{
            width: 30, height: 17, borderRadius: 9999,
            background: iaAtivo ? '#1D9E75' : 'rgba(14,20,42,0.15)',
            position: 'relative', cursor: 'pointer',
            transition: 'background 200ms',
          }}
        >
          <div style={{
            position: 'absolute', top: '50%', transform: 'translateY(-50%)',
            left: iaAtivo ? 15 : 2,
            width: 13, height: 13, borderRadius: '50%', background: 'white',
            transition: 'left 200ms',
            boxShadow: '0 1px 3px rgba(0,0,0,0.20)',
          }} />
        </div>
        <span style={{ flex: 1 }} />
        {campanha && (
          <span style={{ fontSize: 10, color: 'var(--ws-text-3)' }}>Campanha: {campanha}</span>
        )}
      </div>

      {/* Linha 2 — barra de ferramentas + input + enviar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* Ícones esquerda */}
        {([IconEmoji, IconAnexo, IconMicrofone] as React.FC[]).map((Icon, i) => (
          <button
            key={i}
            type="button"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--ws-text-3)', padding: 2,
              display: 'flex', alignItems: 'center',
              transition: 'color 120ms',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--ws-text-1)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--ws-text-3)'}
          >
            <Icon />
          </button>
        ))}

        {/* Input central */}
        <input
          value={msg}
          onChange={e => setMsg(e.target.value)}
          placeholder="Digite uma mensagem..."
          style={{
            flex: 1, height: 36,
            background: 'var(--ws-glass-bg)',
            border: '1px solid var(--ws-glass-border)',
            borderRadius: 20,
            padding: '0 14px',
            fontSize: 12, color: 'var(--ws-text-1)',
            outline: 'none',
            transition: 'border-color 120ms, box-shadow 120ms',
          }}
          onFocus={e => {
            e.target.style.borderColor = 'rgba(62,91,255,0.50)'
            e.target.style.boxShadow = '0 0 0 3px rgba(62,91,255,0.12)'
          }}
          onBlur={e => {
            e.target.style.borderColor = 'var(--ws-glass-border)'
            e.target.style.boxShadow = 'none'
          }}
        />

        {/* Botão enviar */}
        <button
          type="button"
          style={{
            width: 36, height: 36, borderRadius: '50%', border: 'none',
            background: '#3E5BFF', cursor: 'pointer', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 120ms',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#2340c4'}
          onMouseLeave={e => e.currentTarget.style.background = '#3E5BFF'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// ─── Painel do contato (dinâmico) ─────────────────────────────────────────────

function PainelContato({ contato }: { contato: ContatoDetalhes }) {
  const [stage, setStage] = useState<StageId>(contato.stageAtual)

  const secao: React.CSSProperties = {
    padding: 12,
    borderBottom: '1px solid var(--ws-divider)',
  }

  const labelSec: React.CSSProperties = {
    display: 'block', fontSize: 10, fontWeight: 600,
    textTransform: 'uppercase', letterSpacing: '0.06em',
    color: 'var(--ws-text-3)', marginBottom: 8,
  }

  function InfoRow({ label, valor, valorColor }: PainelRow) {
    return (
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: 'var(--ws-text-3)', minWidth: 80 }}>{label}</span>
        <span style={{ fontSize: 11, fontWeight: 500, color: valorColor ?? 'var(--ws-text-1)' }}>{valor}</span>
      </div>
    )
  }

  function MiniAvatar({ iniciais, bg, color }: { iniciais: string; bg: string; color: string }) {
    return (
      <div style={{
        width: 22, height: 22, borderRadius: '50%',
        background: bg, color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 9, fontWeight: 700, flexShrink: 0,
      }}>{iniciais}</div>
    )
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'thin' }}>
      {/* 1. Contato */}
      <div style={secao}>
        <span style={labelSec}>Contato</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: contato.avatarBg, color: contato.avatarColor,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 600, flexShrink: 0,
          }}>{contato.iniciais}</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ws-text-1)' }}>{contato.nomeCompleto}</div>
            <div style={{ fontSize: 11, color: 'var(--ws-text-2)' }}>{contato.telefone}</div>
          </div>
        </div>
        <InfoRow label="Canal"      valor={contato.canalLabel} />
        <InfoRow label="E-mail"     valor={contato.email} />
        <InfoRow label="1º contato" valor={contato.primeiroContato} />
      </div>

      {/* 2. Etiquetas */}
      <div style={secao}>
        <span style={labelSec}>Etiquetas</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {contato.etiquetas.map(et => (
            <span key={et.label} style={{
              background: `color-mix(in srgb, ${et.color} 15%, transparent)`,
              color: et.color,
              borderRadius: 9999, padding: '2px 8px',
              fontSize: 10, fontWeight: 500,
            }}>{et.label}</span>
          ))}
          <span style={{
            borderRadius: 9999, padding: '2px 8px', fontSize: 10,
            color: 'var(--ws-text-3)',
            border: '1px dashed var(--ws-divider)', cursor: 'pointer',
          }}>+ add</span>
        </div>
      </div>

      {/* 3. Equipe */}
      <div style={secao}>
        <span style={labelSec}>Equipe</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <MiniAvatar iniciais={contato.equipe.iniciais} bg={contato.equipe.bg} color={contato.equipe.color} />
          <span style={{ fontSize: 12, color: 'var(--ws-text-1)' }}>{contato.equipe.nome}</span>
        </div>
      </div>

      {/* 4. Origem */}
      <div style={secao}>
        <span style={labelSec}>Origem</span>
        <span style={{
          display: 'inline-block', marginBottom: 8,
          background: 'rgba(60,52,137,0.15)', color: '#8b7ef8',
          borderRadius: 9999, padding: '2px 8px',
          fontSize: 10, fontWeight: 500,
        }}>{contato.origem.campanha}</span>
        <InfoRow label="CPL camp." valor={contato.origem.cpl} valorColor="#4a9ae6" />
      </div>

      {/* 5. Stage do funil */}
      <div style={secao}>
        <span style={labelSec}>Stage do funil</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {STAGES.map(s => {
            const ativo = stage === s.id
            return (
              <div
                key={s.id}
                onClick={() => setStage(s.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '4px 8px', borderRadius: 6, cursor: 'pointer',
                  background: ativo ? 'var(--ws-card-active)' : 'transparent',
                  transition: 'background 100ms',
                }}
                onMouseEnter={e => { if (!ativo) e.currentTarget.style.background = 'var(--ws-glass-bg)' }}
                onMouseLeave={e => { if (!ativo) e.currentTarget.style.background = 'transparent' }}
              >
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: s.cor, flexShrink: 0,
                }} />
                <span style={{
                  fontSize: 11, fontWeight: ativo ? 500 : 400,
                  color: ativo ? 'var(--ws-blue)' : 'var(--ws-text-2)',
                }}>{s.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* 6. Análise IA — resumo, temperatura, follow-up, resgate, qualidade */}
      <div style={secao}>
        <span style={labelSec}>🤖 Análise IA</span>

        {/* Resumo da conversa */}
        <div style={{
          background: 'rgba(62,91,255,0.08)',
          border: '1px solid rgba(62,91,255,0.15)',
          borderRadius: 8, padding: '8px 10px', marginBottom: 10,
        }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: '#3E5BFF', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Resumo</div>
          <p style={{ fontSize: 11, color: 'var(--ws-text-2)', lineHeight: 1.5, margin: 0 }}>
            {contato.analiseIA.resumoConversa}
          </p>
        </div>

        {/* Temperatura do Lead */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: 'var(--ws-text-3)' }}>Temperatura</span>
            <span style={{
              fontSize: 10, fontWeight: 600,
              color: TEMP_LEAD[contato.analiseIA.temperaturaLead].cor,
            }}>
              {TEMP_LEAD[contato.analiseIA.temperaturaLead].label}
            </span>
          </div>
          {/* Barra de temperatura */}
          <div style={{
            height: 6, borderRadius: 3, position: 'relative',
            background: 'linear-gradient(90deg, #3B82F6 0%, #F59E0B 35%, #F97316 65%, #EF4444 100%)',
            opacity: 0.85,
          }}>
            {/* Indicador */}
            <div style={{
              position: 'absolute',
              left: `${TEMP_LEAD[contato.analiseIA.temperaturaLead].posicao}%`,
              top: -3, width: 12, height: 12, borderRadius: '50%',
              background: TEMP_LEAD[contato.analiseIA.temperaturaLead].cor,
              border: '2px solid white',
              boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
              transform: 'translateX(-50%)',
            }} />
          </div>
        </div>

        {/* Estágio do Follow-up */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--ws-text-3)' }}>Follow-up</span>
          <span style={{
            fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 9999,
            background: FOLLOWUP_ESTAGIOS[contato.analiseIA.estagioFollowup].bg,
            color: FOLLOWUP_ESTAGIOS[contato.analiseIA.estagioFollowup].cor,
          }}>
            {FOLLOWUP_ESTAGIOS[contato.analiseIA.estagioFollowup].label}
          </span>
        </div>

        {/* Status de Resgate */}
        {contato.analiseIA.statusResgate !== 'nao-aplicavel' && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: 'var(--ws-text-3)' }}>Resgate</span>
            <span style={{
              fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 9999,
              background: STATUS_RESGATE[contato.analiseIA.statusResgate].bg,
              color: STATUS_RESGATE[contato.analiseIA.statusResgate].cor,
            }}>
              {STATUS_RESGATE[contato.analiseIA.statusResgate].label}
            </span>
          </div>
        )}

        {/* Qualidade do Atendimento */}
        <div style={{ marginBottom: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: 'var(--ws-text-3)' }}>Qualidade</span>
            <span style={{
              fontSize: 10, fontWeight: 600,
              color: QUALIDADE[contato.analiseIA.qualidadeAtendimento].cor,
            }}>
              {QUALIDADE[contato.analiseIA.qualidadeAtendimento].emoji} {QUALIDADE[contato.analiseIA.qualidadeAtendimento].label}
            </span>
          </div>
          {/* Barra de score */}
          <div style={{
            height: 5, borderRadius: 3, background: 'var(--ws-glass-bg)',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', borderRadius: 3,
              width: `${contato.analiseIA.scoreAtendimento}%`,
              background: QUALIDADE[contato.analiseIA.qualidadeAtendimento].cor,
              transition: 'width 300ms ease',
            }} />
          </div>
          <div style={{ textAlign: 'right', marginTop: 2 }}>
            <span style={{ fontSize: 10, color: 'var(--ws-text-3)' }}>{contato.analiseIA.scoreAtendimento}/100</span>
          </div>
        </div>
      </div>

      {/* 7. Atribuído a */}
      <div style={secao}>
        <span style={labelSec}>Atribuído a</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <MiniAvatar iniciais={contato.responsavel.iniciais} bg={contato.responsavel.bg} color={contato.responsavel.color} />
          <span style={{ fontSize: 12, color: 'var(--ws-text-1)' }}>{contato.responsavel.nome}</span>
        </div>
      </div>

      {/* 8. IA Agente */}
      <div style={{ ...secao, borderBottom: 'none' }}>
        <span style={labelSec}>IA Agente</span>
        <InfoRow label="Status"            valor={contato.ia.status}  valorColor={contato.ia.statusColor} />
        <InfoRow label="Msgs respondidas"  valor={String(contato.ia.msgsRespondidas)} />
        <InfoRow label="Assumido em"       valor={contato.ia.assumidoEm} />
      </div>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────
//
// DSCrmChat é o orquestrador. Ele:
//   1. Gerencia conversaAtivaId (qual conversa está selecionada)
//   2. Deriva mensagens e contato a partir do ID ativo
//   3. Passa callbacks para CrmListaConversas
//   4. Atualiza header, chat e painel dinamicamente
//
// Para produção: conversaAtivaId pode vir da URL (query param / route),
// mensagens e contatos podem ser fetched via SWR/React Query.

export function DSCrmChat() {
  const [conversaAtivaId, setConversaAtivaId] = useState('conv-1')
  const [painelAberto, setPainelAberto] = useState(false)

  // Dados derivados da conversa ativa
  const mensagens = useMemo(
    () => MENSAGENS[conversaAtivaId] ?? [],
    [conversaAtivaId],
  )

  const contato = useMemo(
    () => CONTATOS[conversaAtivaId] ?? CONTATOS['conv-1'],
    [conversaAtivaId],
  )

  // Extrair campanha para o InputArea
  const campanhaLabel = contato
    ? `${contato.origem.campanha} · ${contato.canalLabel}`
    : undefined

  return (
    <div style={{ overflowX: 'auto', paddingBottom: 16 }}>
      {/* Header DS */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ws-text-1)', marginBottom: 6 }}>
          💬 CRM — Chat
        </h2>
        <p style={{ fontSize: 14, color: 'var(--ws-text-2)', lineHeight: 1.6 }}>
          Interface completa de atendimento com lista de conversas, área de chat e painel do contato.
          Suporte a mensagens de IA agente e atendente humano.
        </p>
      </div>

      {/* Glass card 3 colunas */}
      <div style={{
        background: 'var(--ws-glass-bg)',
        border: '1px solid var(--ws-glass-border)',
        borderRadius: 'var(--ws-radius-lg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        height: 600,
        minWidth: 1000,
        display: 'flex',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Shimmer superior */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1, zIndex: 1,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
          pointerEvents: 'none',
        }} />

        {/* Coluna 1 — Lista de conversas (300px) */}
        <div style={{
          width: 300, flexShrink: 0,
          borderRight: '1px solid var(--ws-glass-border)',
          display: 'flex', flexDirection: 'column',
          overflow: 'visible',
          position: 'relative',
        }}>
          <CrmListaConversas
            conversaAtivaId={conversaAtivaId}
            onSelectConversa={setConversaAtivaId}
          />
        </div>

        {/* Coluna 2 — Área de chat */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0,
        }}>
          <ChatHeader contato={contato} onTogglePainel={() => setPainelAberto(v => !v)} />
          <AreaMensagens mensagens={mensagens} />
          <InputArea campanha={campanhaLabel} />
        </div>

        {/* Coluna 3 — Painel do contato (260px) */}
        <div style={{
          width: painelAberto ? 260 : 0,
          flexShrink: 0,
          borderLeft: '1px solid var(--ws-glass-border)',
          overflow: 'hidden',
          transition: 'width 300ms ease',
        }}>
          <div style={{ minWidth: 260, height: '100%' }}>
            <PainelContato contato={contato} />
          </div>
        </div>
      </div>
    </div>
  )
}
