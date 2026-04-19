import {
  Agenda,
  Agendamento,
  Bloqueio,
  HorarioAgenda,
  LembreteConfig,
  NpsConfig,
  DiaSemana,
} from '@/types/agenda'
import {
  startOfWeek,
  addDays,
  setHours,
  setMinutes,
  addMinutes,
  format,
} from 'date-fns'

// ─── Referência: semana atual ──────────────────────────────────────────────────
const hoje = new Date()
const inicioSemana = startOfWeek(hoje, { weekStartsOn: 1 }) // segunda-feira

function dt(offsetDias: number, hora: number, min = 0): string {
  const d = setMinutes(setHours(addDays(inicioSemana, offsetDias), hora), min)
  return d.toISOString()
}

function fim(inicio: string, minutos: number): string {
  return addMinutes(new Date(inicio), minutos).toISOString()
}

function now(): string {
  return new Date().toISOString()
}

// ─── AGENDAS ──────────────────────────────────────────────────────────────────
export const MOCK_AGENDAS: Agenda[] = [
  {
    id: 'ag-rafael',
    nome: 'Dr. Rafael (Avaliação)',
    tipo: 'profissional',
    cor: '#3E5BFF',
    capacidade_simultanea: 1,
    fuso_horario: 'America/Sao_Paulo',
    ativo: true,
    created_at: now(),
    updated_at: now(),
  },
  {
    id: 'ag-ana',
    nome: 'Dra. Ana (Implante)',
    tipo: 'profissional',
    cor: '#0fa856',
    capacidade_simultanea: 1,
    fuso_horario: 'America/Sao_Paulo',
    ativo: true,
    created_at: now(),
    updated_at: now(),
  },
  {
    id: 'ag-sala',
    nome: 'Sala de Procedimentos',
    tipo: 'sala',
    cor: '#FF5C8D',
    capacidade_simultanea: 2,
    fuso_horario: 'America/Sao_Paulo',
    ativo: true,
    created_at: now(),
    updated_at: now(),
  },
]

// ─── HORÁRIOS ─────────────────────────────────────────────────────────────────
const DIAS_UTEIS: DiaSemana[] = ['seg', 'ter', 'qua', 'qui', 'sex']

function gerarHorarios(agendaId: string, duracao = 60): HorarioAgenda[] {
  const base: HorarioAgenda[] = DIAS_UTEIS.map((dia, i) => ({
    id: `hor-${agendaId}-${dia}`,
    agenda_id: agendaId,
    dia_semana: dia,
    ativo: true,
    hora_inicio: '08:00',
    hora_fim: '18:00',
    duracao_slot_minutos: duracao,
    tem_almoco: true,
    almoco_inicio: '12:00',
    almoco_fim: '13:00',
  }))

  // Sábado: 08:00–12:00 sem almoço
  base.push({
    id: `hor-${agendaId}-sab`,
    agenda_id: agendaId,
    dia_semana: 'sab',
    ativo: true,
    hora_inicio: '08:00',
    hora_fim: '12:00',
    duracao_slot_minutos: duracao,
    tem_almoco: false,
  })

  return base
}

export const MOCK_HORARIOS: HorarioAgenda[] = [
  ...gerarHorarios('ag-rafael', 60),
  ...gerarHorarios('ag-ana', 60),
  ...gerarHorarios('ag-sala', 30),
]

// ─── BLOQUEIOS ────────────────────────────────────────────────────────────────
export const MOCK_BLOQUEIOS: Bloqueio[] = [
  {
    id: 'bl-001',
    agenda_id: 'ag-rafael',
    motivo: 'Reunião de equipe',
    inicio: dt(1, 12), // terça 12:00
    fim: dt(1, 13),
    tipo: 'reuniao',
    created_at: now(),
  },
  {
    id: 'bl-002',
    agenda_id: null, // global
    motivo: 'Feriado — Tiradentes',
    inicio: dt(3, 0), // quinta (dia inteiro)
    fim: dt(3, 23, 59),
    tipo: 'feriado',
    created_at: now(),
  },
  {
    id: 'bl-003',
    agenda_id: 'ag-ana',
    motivo: 'Agenda cheia — lista de espera ativa',
    inicio: dt(4, 8), // sexta manhã
    fim: dt(4, 12),
    tipo: 'agenda_cheia',
    created_at: now(),
  },
  {
    id: 'bl-004',
    agenda_id: 'ag-sala',
    motivo: 'Manutenção dos equipamentos de esterilização',
    inicio: dt(0, 7), // segunda 07:00
    fim: dt(0, 8),
    tipo: 'manutencao',
    created_at: now(),
  },
  {
    id: 'bl-005',
    agenda_id: 'ag-rafael',
    motivo: 'Congresso Odontológico SP',
    inicio: dt(5, 0), // sábado (dia inteiro)
    fim: dt(5, 23, 59),
    tipo: 'outro',
    created_at: now(),
  },
]

// ─── AGENDAMENTOS ─────────────────────────────────────────────────────────────
// Semana atual — 15 agendamentos com mix de status/origem

const NOMES = [
  'Fernanda Rodrigues',
  'Carlos Eduardo Lima',
  'Beatriz Alves Santos',
  'Thiago Mendonça',
  'Juliana Costa Ferreira',
  'Ricardo Souza Neto',
  'Amanda Oliveira',
  'Paulo Henrique Dias',
  'Larissa Nascimento',
  'Marcos Vinícius Carvalho',
  'Priya Silva',
  'Camila Ferraz',
  'Diego Borges',
  'Andressa Martins',
  'Roberto Faria',
]

const TELEFONES = [
  '11987654321', '11923456789', '21987654321', '21912345678',
  '31987654321', '31923456789', '41987654321', '41912345678',
  '51987654321', '51923456789', '61987654321', '61912345678',
  '71987654321', '71923456789', '81987654321',
]

const SERVICOS = ['Avaliação', 'Consulta', 'Implante', 'Retorno', 'Limpeza']

type AgRow = {
  agendaId: string
  diasOffset: number
  hora: number
  durMin: number
  statusIdx: number // 0-7
  origemIdx: number // 0-3
  nomeIdx: number
  servicoIdx: number
}

const ROWS: AgRow[] = [
  // Segunda
  { agendaId: 'ag-rafael', diasOffset: 0, hora: 8,  durMin: 60, statusIdx: 0, origemIdx: 0, nomeIdx: 0, servicoIdx: 0 },
  { agendaId: 'ag-ana',    diasOffset: 0, hora: 9,  durMin: 60, statusIdx: 1, origemIdx: 1, nomeIdx: 1, servicoIdx: 2 },
  { agendaId: 'ag-sala',   diasOffset: 0, hora: 10, durMin: 30, statusIdx: 2, origemIdx: 0, nomeIdx: 2, servicoIdx: 4 },
  // Terça
  { agendaId: 'ag-rafael', diasOffset: 1, hora: 9,  durMin: 60, statusIdx: 3, origemIdx: 1, nomeIdx: 3, servicoIdx: 1 },
  { agendaId: 'ag-ana',    diasOffset: 1, hora: 10, durMin: 60, statusIdx: 4, origemIdx: 2, nomeIdx: 4, servicoIdx: 3 },
  { agendaId: 'ag-sala',   diasOffset: 1, hora: 14, durMin: 30, statusIdx: 0, origemIdx: 0, nomeIdx: 5, servicoIdx: 4 },
  // Quarta
  { agendaId: 'ag-rafael', diasOffset: 2, hora: 8,  durMin: 60, statusIdx: 1, origemIdx: 1, nomeIdx: 6, servicoIdx: 0 },
  { agendaId: 'ag-ana',    diasOffset: 2, hora: 15, durMin: 60, statusIdx: 5, origemIdx: 3, nomeIdx: 7, servicoIdx: 2 },
  // Quinta (feriado — agendado antes)
  { agendaId: 'ag-rafael', diasOffset: 3, hora: 9,  durMin: 60, statusIdx: 7, origemIdx: 0, nomeIdx: 8, servicoIdx: 1 },
  // Sexta
  { agendaId: 'ag-rafael', diasOffset: 4, hora: 8,  durMin: 60, statusIdx: 0, origemIdx: 1, nomeIdx: 9,  servicoIdx: 3 },
  { agendaId: 'ag-ana',    diasOffset: 4, hora: 13, durMin: 60, statusIdx: 1, origemIdx: 0, nomeIdx: 10, servicoIdx: 0 },
  { agendaId: 'ag-sala',   diasOffset: 4, hora: 9,  durMin: 30, statusIdx: 3, origemIdx: 1, nomeIdx: 11, servicoIdx: 4 },
  { agendaId: 'ag-sala',   diasOffset: 4, hora: 15, durMin: 30, statusIdx: 2, origemIdx: 2, nomeIdx: 12, servicoIdx: 2 },
  // Sábado
  { agendaId: 'ag-rafael', diasOffset: 5, hora: 8,  durMin: 60, statusIdx: 0, origemIdx: 0, nomeIdx: 13, servicoIdx: 1 },
  { agendaId: 'ag-ana',    diasOffset: 5, hora: 9,  durMin: 60, statusIdx: 4, origemIdx: 1, nomeIdx: 14, servicoIdx: 3 },
]

const STATUS_LIST: Agendamento['status'][] = [
  'agendado', 'confirmado', 'em_atendimento', 'compareceu',
  'falta', 'cancelado', 'bloqueado', 'reagendado',
]

const ORIGEM_LIST: Agendamento['origem'][] = ['manual', 'agente', 'api', 'paciente']

export const MOCK_AGENDAMENTOS: Agendamento[] = ROWS.map((r, i) => {
  const inicio = dt(r.diasOffset, r.hora)
  const fimDt = fim(inicio, r.durMin)
  const status = STATUS_LIST[r.statusIdx]

  return {
    id: `ag-${String(i + 1).padStart(3, '0')}`,
    agenda_id: r.agendaId,
    agenda: MOCK_AGENDAS.find(a => a.id === r.agendaId),
    cliente_nome: NOMES[r.nomeIdx],
    cliente_telefone: TELEFONES[r.nomeIdx],
    cliente_email: `${NOMES[r.nomeIdx].split(' ')[0].toLowerCase()}@email.com`,
    data_hora_inicio: inicio,
    data_hora_fim: fimDt,
    servico: SERVICOS[r.servicoIdx],
    observacoes: i % 3 === 0 ? 'Paciente com histórico de sensibilidade.' : undefined,
    status,
    origem: ORIGEM_LIST[r.origemIdx],
    criado_por: r.origemIdx === 1 ? 'agente' : 'usr-001',
    cancelamento_motivo: status === 'cancelado' ? 'Paciente solicitou cancelamento' : undefined,
    cancelado_por: status === 'cancelado' ? 'usr-001' : undefined,
    cancelado_em: status === 'cancelado' ? now() : undefined,
    nps_enviado: status === 'compareceu',
    nps_enviado_em: status === 'compareceu' ? now() : undefined,
    nps_score: status === 'compareceu' ? [9, 10, 8, 7][i % 4] : undefined,
    created_at: now(),
    updated_at: now(),
  }
})

// ─── LEMBRETES ────────────────────────────────────────────────────────────────
export const MOCK_LEMBRETES: LembreteConfig[] = [
  {
    id: 'lem-001',
    agenda_id: null, // global
    ativo: true,
    canal: 'whatsapp',
    dias_antes: 1,
    hora_envio: '09:00',
    mensagem_template:
      'Olá, {{nome}}! 👋 Lembramos que você tem uma consulta amanhã ({{data}} às {{hora}}) com {{profissional}}. Confirme sua presença respondendo *SIM*.',
    tem_midia: false,
    ordem: 1,
  },
  {
    id: 'lem-002',
    agenda_id: null, // global
    ativo: true,
    canal: 'whatsapp',
    dias_antes: 0,
    horas_antes: 2,
    mensagem_template:
      '⏰ Sua consulta de {{servico}} é em 2 horas! ({{hora}}). Estamos aguardando você. 📍 Endereço: Av. Paulista, 1000, São Paulo.',
    tem_midia: false,
    ordem: 2,
  },
]

// ─── NPS CONFIG ───────────────────────────────────────────────────────────────
export const MOCK_NPS_CONFIG: NpsConfig[] = [
  {
    id: 'nps-001',
    agenda_id: null, // global
    ativo: true,
    trigger: 'automatico',
    horas_apos_atendimento: 2,
    canal: 'whatsapp',
    mensagem_template:
      'Olá, {{nome}}! 😊 Esperamos que sua consulta tenha sido ótima.\n\nDe 0 a 10, como você avalia seu atendimento?\n\nResponda com o número para nos ajudar a melhorar! 🌟',
  },
]
