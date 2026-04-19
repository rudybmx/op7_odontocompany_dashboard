// ─── Mock data separado dos componentes ─────────────────────────────────────
// Em producao: substituir por fetch/SWR/React Query

import type {
  Mensagem,
  ContatoDetalhes,
  CardConversaData,
  UsuarioAtual,
  AvatarVariant,
  Canal,
  StageId,
} from './types'

// ─── Usuario atual (mock) ───────────────────────────────────────────────────
export const USUARIO_ATUAL: UsuarioAtual = {
  id: 'ana-lima',
  nome: 'Dra. Ana Lima',
  nivel: 'atendente',
  equipeIds: ['comercial'],
}

// ─── Mensagens por conversa ──────────────────────────────────────────────────
export const MENSAGENS: Record<string, Mensagem[]> = {
  'conv-1': [
    { id: 'm1-1', tipo: 'inbound', texto: 'Ol\u00e1! Gostaria de saber mais sobre o implante dent\u00e1rio. Tem alguma promo\u00e7\u00e3o dispon\u00edvel?', hora: '14:20' },
    { id: 'm1-2', tipo: 'ia', texto: 'Ol\u00e1, Anthony! \uD83D\uDE0A Temos condi\u00e7\u00f5es especiais este m\u00eas. O implante de tit\u00e2nio a partir de R$ 1.890 em at\u00e9 18x sem juros. Posso te ajudar com mais detalhes?', hora: '14:21', remetente: 'IA Agente' },
    { id: 'm1-3', tipo: 'inbound', texto: '\u00d3timo! E quanto tempo dura o procedimento completo?', hora: '14:22' },
    { id: 'm1-4', tipo: 'humano', texto: 'Boa tarde! A cirurgia dura ~1h, mas a osseointegra\u00e7\u00e3o leva de 3 a 6 meses. Posso agendar uma avalia\u00e7\u00e3o gratuita pra voc\u00ea?', hora: '14:25', remetente: 'Dra. Ana Lima' },
    { id: 'm1-5', tipo: 'ia', texto: 'Tenho hor\u00e1rios amanh\u00e3 \u00e0s 9h, 11h ou 15h. Qual prefere? A consulta de avalia\u00e7\u00e3o \u00e9 totalmente sem custo! \uD83E\uDEB7', hora: '14:26', remetente: 'IA Agente' },
  ],
  'conv-2': [
    { id: 'm2-1', tipo: 'inbound', texto: 'Oi, quero saber sobre o implante. Quanto custa?', hora: '14:30' },
    { id: 'm2-2', tipo: 'ia', texto: 'Ol\u00e1, Maria Clara! \uD83D\uDE0A O valor varia conforme o caso. Temos op\u00e7\u00f5es a partir de R$ 1.890. Posso te ajudar com uma avalia\u00e7\u00e3o?', hora: '14:31', remetente: 'IA Agente' },
    { id: 'm2-3', tipo: 'inbound', texto: 'Sim! Tem hor\u00e1rio essa semana?', hora: '14:32' },
  ],
  'conv-3': [
    { id: 'm3-1', tipo: 'inbound', texto: 'Voc\u00eas fazem lente de contato dental?', hora: '09:15' },
    { id: 'm3-2', tipo: 'ia', texto: 'Ol\u00e1 Lucas! Sim, trabalhamos com lentes de contato dental. O procedimento \u00e9 minimamente invasivo e o resultado \u00e9 incr\u00edvel! Quer saber mais sobre valores e prazos?', hora: '09:16', remetente: 'IA Agente' },
    { id: 'm3-3', tipo: 'inbound', texto: 'Quanto fica pra arcada completa?', hora: '09:17' },
    { id: 'm3-4', tipo: 'ia', texto: 'Para a arcada completa, o investimento fica entre R$ 8.000 e R$ 15.000 dependendo do material. Posso agendar uma avalia\u00e7\u00e3o gratuita?', hora: '09:18', remetente: 'IA Agente' },
  ],
  'conv-4': [
    { id: 'm4-1', tipo: 'inbound', texto: 'Bom dia! Gostaria de agendar uma consulta de urg\u00eancia.', hora: '08:44' },
    { id: 'm4-2', tipo: 'ia', texto: 'Bom dia, Sandra! Claro, qual o motivo da urg\u00eancia? Assim consigo direcionar para o profissional certo.', hora: '08:45', remetente: 'IA Agente' },
    { id: 'm4-3', tipo: 'inbound', texto: 'Estou com muita dor no dente do fundo, desde ontem \u00e0 noite', hora: '08:46' },
  ],
  'conv-5': [
    { id: 'm5-1', tipo: 'inbound', texto: 'Doutora, tem hor\u00e1rio pra amanh\u00e3?', hora: '11:15' },
    { id: 'm5-2', tipo: 'humano', texto: 'Oi Jo\u00e3o! Tenho sim, \u00e0s 10h ou \u00e0s 14h. Qual prefere?', hora: '11:18', remetente: 'Dra. Ana Lima' },
    { id: 'm5-3', tipo: 'inbound', texto: 'Pode ser \u00e0s 14h!', hora: '11:20' },
    { id: 'm5-4', tipo: 'humano', texto: 'Perfeito! Agendado pra amanh\u00e3 \u00e0s 14h. Lembre de trazer os exames que pedi na \u00faltima consulta \uD83D\uDCCB', hora: '11:22', remetente: 'Dra. Ana Lima' },
  ],
  'conv-6': [
    { id: 'm6-1', tipo: 'inbound', texto: 'Doutora, quero agradecer pelo atendimento de ontem. Ficou perfeito!', hora: '16:00' },
    { id: 'm6-2', tipo: 'humano', texto: 'Que bom, Carla! Fico muito feliz! Qualquer coisa \u00e9 s\u00f3 chamar \uD83D\uDE0A', hora: '16:05', remetente: 'Dra. Ana Lima' },
    { id: 'm6-3', tipo: 'inbound', texto: 'Obrigada pelo atendimento, doutora!', hora: '16:10' },
  ],
  'conv-7': [
    { id: 'm7-1', tipo: 'inbound', texto: 'Posso remarcar pro dia 15?', hora: '10:00' },
    { id: 'm7-2', tipo: 'humano', texto: 'Claro, Rafaela! Remarquei para o dia 15 \u00e0s 9h. Tudo certo?', hora: '10:15', remetente: 'Dra. Ana Lima' },
  ],
  'conv-8': [
    { id: 'm8-1', tipo: 'inbound', texto: 'Boa tarde, ainda n\u00e3o recebi o retorno sobre o meu caso.', hora: '15:00' },
    { id: 'm8-2', tipo: 'humano', texto: 'Oi Pedro, pe\u00e7o desculpas pela demora. Vou verificar com a equipe e te retorno at\u00e9 amanh\u00e3.', hora: '15:30', remetente: 'Dr. Carlos' },
    { id: 'm8-3', tipo: 'inbound', texto: 'Tudo bem, obrigado. Fico no aguardo.', hora: '15:32' },
  ],
  'conv-9': [
    { id: 'm9-1', tipo: 'inbound', texto: 'Quero fazer a revis\u00e3o do protocolo que combinamos', hora: '09:00' },
    { id: 'm9-2', tipo: 'humano', texto: 'Oi Fernanda! Claro, vou agendar a sua revis\u00e3o. Pode ser na pr\u00f3xima quarta?', hora: '09:30', remetente: 'Dr. Jo\u00e3o' },
  ],
  'conv-10': [
    { id: 'm10-1', tipo: 'inbound', texto: 'Preciso do laudo pra o conv\u00eanio, pode me enviar?', hora: '11:00' },
    { id: 'm10-2', tipo: 'humano', texto: 'Oi Bruno! Vou preparar e enviar por e-mail ainda hoje.', hora: '11:45', remetente: 'Dr. Jo\u00e3o' },
  ],
}

// ─── Contatos por conversa ──────────────────────────────────────────────────
export const CONTATOS: Record<string, ContatoDetalhes> = {
  'conv-1': {
    nome: 'Anthony', nomeCompleto: 'Anthony Ferreira', iniciais: 'AN',
    avatarBg: '#B5D4F4', avatarColor: '#0C447C',
    telefone: '+55 11 99887-7665', email: 'anthony@email.com',
    canal: 'whatsapp', canalLabel: 'WhatsApp', canalColor: '#1D9E75', online: true,
    primeiroContato: '12/01/2025',
    etiquetas: [
      { label: 'Indica\u00e7\u00f5es', bg: '#EAF3DE', color: '#3B6D11' },
      { label: 'Primeiro Atendimento', bg: '#E6F1FB', color: '#185FA5' },
    ],
    equipe: { nome: 'Comercial', iniciais: 'C', bg: '#E6F1FB', color: '#185FA5' },
    responsavel: { nome: 'Dra. Ana Lima', iniciais: 'AL', bg: '#FAC775', color: '#633806' },
    stageAtual: 'qualificado',
    origem: { campanha: 'Oral Sin', cpl: 'R$ 0,84' },
    ia: { status: 'Ativa', statusColor: '#1D9E75', msgsRespondidas: 3, assumidoEm: '14:21' },
    analiseIA: {
      resumoConversa: 'Lead demonstrou alto interesse em implante dent\u00e1rio. Perguntou sobre promo\u00e7\u00f5es e tempo de procedimento. Recebeu proposta de avalia\u00e7\u00e3o gratuita com hor\u00e1rios dispon\u00edveis.',
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
    responsavel: { nome: 'N\u00e3o atribu\u00eddo', iniciais: '\u2014', bg: '#D1D5DB', color: '#6B7280' },
    stageAtual: 'novo',
    origem: { campanha: 'Implantes Digital', cpl: 'R$ 1,20' },
    ia: { status: 'Ativa', statusColor: '#1D9E75', msgsRespondidas: 1, assumidoEm: '14:31' },
    analiseIA: {
      resumoConversa: 'Lead perguntou sobre implante e valores. Demonstrou interesse imediato em agendar. Aguardando confirma\u00e7\u00e3o de hor\u00e1rio.',
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
    responsavel: { nome: 'N\u00e3o atribu\u00eddo', iniciais: '\u2014', bg: '#D1D5DB', color: '#6B7280' },
    stageAtual: 'novo',
    origem: { campanha: 'Lentes Dental', cpl: 'R$ 2,10' },
    ia: { status: 'Ativa', statusColor: '#1D9E75', msgsRespondidas: 2, assumidoEm: '09:16' },
    analiseIA: {
      resumoConversa: 'Lead interessado em lentes de contato dental. Perguntou sobre arcada completa. Recebeu faixa de pre\u00e7o e convite para avalia\u00e7\u00e3o.',
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
    responsavel: { nome: 'N\u00e3o atribu\u00eddo', iniciais: '\u2014', bg: '#D1D5DB', color: '#6B7280' },
    stageAtual: 'novo',
    origem: { campanha: 'Org\u00e2nico', cpl: '\u2014' },
    ia: { status: 'Ativa', statusColor: '#1D9E75', msgsRespondidas: 1, assumidoEm: '08:45' },
    analiseIA: {
      resumoConversa: 'Paciente com urg\u00eancia odontol\u00f3gica (dor intensa). Precisa de atendimento imediato. IA direcionando para profissional dispon\u00edvel.',
      temperaturaLead: 'muito-quente',
      estagioFollowup: 'primeiro-contato',
      statusResgate: 'nao-aplicavel',
      qualidadeAtendimento: 'bom',
      scoreAtendimento: 75,
    },
  },
  'conv-5': {
    nome: 'Jo\u00e3o Paulo', nomeCompleto: 'Jo\u00e3o Paulo Ribeiro', iniciais: 'JP',
    avatarBg: '#C0DD97', avatarColor: '#27500A',
    telefone: '+55 11 97654-1234', email: 'joao.p@email.com',
    canal: 'whatsapp', canalLabel: 'WhatsApp', canalColor: '#1D9E75', online: false,
    primeiroContato: '05/03/2025',
    etiquetas: [{ label: 'Follow-up', bg: '#FAEEDA', color: '#633806' }],
    equipe: { nome: 'Comercial', iniciais: 'C', bg: '#E6F1FB', color: '#185FA5' },
    responsavel: { nome: 'Dra. Ana Lima', iniciais: 'AL', bg: '#FAC775', color: '#633806' },
    stageAtual: 'proposta',
    origem: { campanha: 'Oral Sin', cpl: 'R$ 0,92' },
    ia: { status: 'Pausada', statusColor: '#F59E0B', msgsRespondidas: 0, assumidoEm: '\u2014' },
    analiseIA: {
      resumoConversa: 'Paciente em follow-up para agendamento de retorno. Confirmou hor\u00e1rio para amanh\u00e3 \u00e0s 14h. Precisa trazer exames anteriores.',
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
    origem: { campanha: 'Indica\u00e7\u00e3o', cpl: '\u2014' },
    ia: { status: 'Inativa', statusColor: '#6B7280', msgsRespondidas: 0, assumidoEm: '\u2014' },
    analiseIA: {
      resumoConversa: 'Paciente VIP satisfeita com tratamento conclu\u00eddo. Elogiou atendimento. Potencial para indica\u00e7\u00f5es futuras.',
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
    ia: { status: 'Pausada', statusColor: '#F59E0B', msgsRespondidas: 0, assumidoEm: '\u2014' },
    analiseIA: {
      resumoConversa: 'Paciente solicitou remarca\u00e7\u00e3o de consulta. Reagendada para dia 15 \u00e0s 9h. Sem pend\u00eancias.',
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
    origem: { campanha: 'Org\u00e2nico', cpl: '\u2014' },
    ia: { status: 'Inativa', statusColor: '#6B7280', msgsRespondidas: 0, assumidoEm: '\u2014' },
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
    responsavel: { nome: 'Dr. Jo\u00e3o', iniciais: 'JR', bg: '#C0DD97', color: '#27500A' },
    stageAtual: 'qualificado',
    origem: { campanha: 'Implantes Digital', cpl: 'R$ 1,50' },
    ia: { status: 'Pausada', statusColor: '#F59E0B', msgsRespondidas: 0, assumidoEm: '\u2014' },
    analiseIA: {
      resumoConversa: 'Lead em negocia\u00e7\u00e3o de protocolo. Agendamento de revis\u00e3o para pr\u00f3xima semana. Interesse confirmado.',
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
    etiquetas: [{ label: 'Indica\u00e7\u00f5es', bg: '#EAF3DE', color: '#3B6D11' }],
    equipe: { nome: 'Comercial', iniciais: 'C', bg: '#E6F1FB', color: '#185FA5' },
    responsavel: { nome: 'Dr. Jo\u00e3o', iniciais: 'JR', bg: '#C0DD97', color: '#27500A' },
    stageAtual: 'proposta',
    origem: { campanha: 'Indica\u00e7\u00e3o', cpl: '\u2014' },
    ia: { status: 'Inativa', statusColor: '#6B7280', msgsRespondidas: 0, assumidoEm: '\u2014' },
    analiseIA: {
      resumoConversa: 'Lead solicitou laudo para conv\u00eanio. Documento em prepara\u00e7\u00e3o. Potencial para tratamento completo via conv\u00eanio.',
      temperaturaLead: 'morno',
      estagioFollowup: 'em-negociacao',
      statusResgate: 'nao-aplicavel',
      qualidadeAtendimento: 'bom',
      scoreAtendimento: 70,
    },
  },
}

// ─── Cards de conversa (inbox) ──────────────────────────────────────────────
export const CARDS_INBOX: CardConversaData[] = [
  {
    id: 'conv-1', nome: 'Anthony', iniciais: 'AN', avatarVariant: 'azul', canal: 'whatsapp',
    timestamp: 'h\u00e1 6 meses', preview: 'Posso saber se voc\u00ea...', badgeCount: 3,
    etiquetas: [{ label: 'Indica\u00e7\u00f5es', variant: 'indicacoes' }, { label: 'Primeiro Atendimento', variant: 'primeiro-atendimento' }],
    equipe: 'Comercial', equipeVariant: 'comercial', ativo: true,
    agenteAtual: 'ia-comercial', status: 'novo', responsavelId: undefined, equipeIds: ['comercial'],
  },
  {
    id: 'conv-2', nome: 'Maria Clara', iniciais: 'MC', avatarVariant: 'roxo', canal: 'instagram',
    timestamp: '14:32', preview: 'Oi, quero saber sobre o implante', badgeCount: 1,
    etiquetas: [{ label: 'Primeiro Atendimento', variant: 'primeiro-atendimento' }],
    equipe: 'Comercial', equipeVariant: 'comercial',
    agenteAtual: 'ia-comercial', status: 'novo', responsavelId: undefined, equipeIds: ['comercial'],
  },
  {
    id: 'conv-3', nome: 'Lucas Mendes', iniciais: 'LM', avatarVariant: 'verde', canal: 'facebook',
    timestamp: '09:15', preview: 'Voc\u00eas fazem lente de contato dental?', badgeCount: 2,
    etiquetas: [{ label: 'Primeiro Atendimento', variant: 'primeiro-atendimento' }],
    equipe: 'Comercial', equipeVariant: 'comercial',
    agenteAtual: 'ia-sdr', status: 'novo', responsavelId: undefined, equipeIds: ['comercial'],
  },
  {
    id: 'conv-4', nome: 'Sandra Vieira', iniciais: 'SV', avatarVariant: 'ambar', canal: 'whatsapp',
    timestamp: '08:44', preview: 'Bom dia! Gostaria de agendar uma consulta',
    etiquetas: [{ label: 'Urgente', variant: 'urgente' }],
    equipe: 'Suporte', equipeVariant: 'suporte',
    agenteAtual: 'ia-suporte', status: 'novo', responsavelId: undefined, equipeIds: ['suporte'],
  },
  {
    id: 'conv-5', nome: 'Jo\u00e3o Paulo', iniciais: 'JP', avatarVariant: 'verde', canal: 'whatsapp',
    timestamp: '11:20', preview: 'Tem hor\u00e1rio pra amanh\u00e3?',
    etiquetas: [{ label: 'Follow-up', variant: 'follow-up' }],
    equipe: 'Comercial', equipeVariant: 'comercial',
    agenteAtual: 'humano', agenteLabel: 'Dra. Ana Lima',
    status: 'em-atendimento', responsavelId: 'ana-lima', responsavelNome: 'Dra. Ana Lima', equipeIds: ['comercial'],
  },
  {
    id: 'conv-6', nome: 'Carla Souza', iniciais: 'CS', avatarVariant: 'roxo', canal: 'whatsapp',
    timestamp: 'Ontem', preview: 'Obrigada pelo atendimento, doutora!',
    etiquetas: [{ label: 'VIP', variant: 'vip' }],
    equipe: 'Comercial', equipeVariant: 'comercial',
    agenteAtual: 'humano', agenteLabel: 'Dra. Ana Lima',
    status: 'em-atendimento', responsavelId: 'ana-lima', responsavelNome: 'Dra. Ana Lima', equipeIds: ['comercial'],
  },
  {
    id: 'conv-7', nome: 'Rafaela Dias', iniciais: 'RD', avatarVariant: 'azul', canal: 'instagram',
    timestamp: '2 dias', preview: 'Posso remarcar pro dia 15?', badgeCount: 1,
    etiquetas: [{ label: 'Primeiro Atendimento', variant: 'primeiro-atendimento' }],
    equipe: 'Comercial', equipeVariant: 'comercial',
    agenteAtual: 'ia-sdr',
    status: 'em-atendimento', responsavelId: 'ana-lima', responsavelNome: 'Dra. Ana Lima', equipeIds: ['comercial'],
  },
  {
    id: 'conv-8', nome: 'Pedro Torres', iniciais: 'PT', avatarVariant: 'azul', canal: 'whatsapp',
    timestamp: 'Ontem', preview: 'Ainda n\u00e3o recebi o retorno',
    etiquetas: [{ label: 'Urgente', variant: 'urgente' }],
    equipe: 'Suporte', equipeVariant: 'suporte',
    agenteAtual: 'humano', agenteLabel: 'Dr. Carlos',
    status: 'em-atendimento', responsavelId: 'carlos-med', responsavelNome: 'Dr. Carlos', equipeIds: ['suporte'],
  },
  {
    id: 'conv-9', nome: 'Fernanda Lima', iniciais: 'FL', avatarVariant: 'ambar', canal: 'whatsapp',
    timestamp: '3 dias', preview: 'Quero fazer a revis\u00e3o do protocolo',
    etiquetas: [{ label: 'Follow-up', variant: 'follow-up' }],
    equipe: 'Comercial', equipeVariant: 'comercial',
    agenteAtual: 'ia-comercial',
    status: 'em-atendimento', responsavelId: 'joao-rec', responsavelNome: 'Dr. Jo\u00e3o', equipeIds: ['comercial'],
  },
  {
    id: 'conv-10', nome: 'Bruno Alves', iniciais: 'BA', avatarVariant: 'verde', canal: 'whatsapp',
    timestamp: '5 dias', preview: 'Preciso do laudo pra o conv\u00eanio',
    etiquetas: [{ label: 'Indica\u00e7\u00f5es', variant: 'indicacoes' }],
    equipe: 'Comercial', equipeVariant: 'comercial',
    agenteAtual: 'humano', agenteLabel: 'Dr. Jo\u00e3o',
    status: 'em-atendimento', responsavelId: 'joao-rec', responsavelNome: 'Dr. Jo\u00e3o', equipeIds: ['comercial'],
  },
]

// ─── Cards de contatos (tabela) ──────────────────────────────────────────────
export type ContatoTabelaData = {
  nome: string
  iniciais: string
  avatarVariant: AvatarVariant
  telefone: string
  canais: Canal[]
  campanha?: string
  campanhaLabel?: string
  stage: StageId
  atribuidoA?: string
  primeiroContato: string
}

export const CONTATOS_TABELA: ContatoTabelaData[] = [
  { nome: 'Maria Clara', iniciais: 'MC', avatarVariant: 'azul', telefone: '+55 41 99999-0001', canais: ['whatsapp'], campanha: 'Oral Sin \u00b7 Video', campanhaLabel: 'Oral Sin \u00b7 Video', stage: 'qualificado', atribuidoA: 'Fernanda N.', primeiroContato: '12 abr' },
  { nome: 'Rafael Silva', iniciais: 'RS', avatarVariant: 'roxo', telefone: '+55 11 98888-0002', canais: ['instagram'], campanha: 'ODC \u00b7 Consulta', campanhaLabel: 'ODC \u00b7 Consulta', stage: 'contato', atribuidoA: 'Carlos M.', primeiroContato: '12 abr' },
  { nome: 'Jo\u00e3o Paulo', iniciais: 'JP', avatarVariant: 'verde', telefone: '+55 41 97777-0003', canais: ['whatsapp', 'facebook'], campanha: 'HS \u00b7 Promo\u00e7\u00e3o', campanhaLabel: 'HS \u00b7 Promo\u00e7\u00e3o', stage: 'proposta', atribuidoA: 'Fernanda N.', primeiroContato: '10 abr' },
  { nome: 'Ana Lima', iniciais: 'AL', avatarVariant: 'ambar', telefone: '+55 21 96666-0004', canais: ['facebook'], stage: 'fechado', atribuidoA: 'Carlos M.', primeiroContato: '08 abr' },
  { nome: 'Beatriz F.', iniciais: 'BF', avatarVariant: 'azul', telefone: '+55 41 94444-0006', canais: ['instagram', 'whatsapp'], stage: 'novo', primeiroContato: '12 abr' },
]

export const CONTATOS_STATS = [
  { label: 'Total de contatos', valor: '1.284', sub: '+38 esta semana', cor: 'var(--ws-text-1)' },
  { label: 'Leads ativos', valor: '312', sub: 'em acompanhamento', cor: '#185FA5' },
  { label: 'Sem atribui\u00e7\u00e3o', valor: '47', sub: 'aguardando agente', cor: '#BA7517' },
  { label: 'Fechados este m\u00eas', valor: '28', sub: 'taxa 9,0%', cor: '#3B6D11' },
]