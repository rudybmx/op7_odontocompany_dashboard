import type { KanbanBoard } from '@/types/kanban'

export const KANBAN_MOCK: KanbanBoard = {
  id: 'board-1',
  nome: 'Painéis CRM',
  colunas: [
    { id: 'backlog',      nome: 'Backlog',       cor: '#8892b0', ordem: 0 },
    { id: 'a-fazer',     nome: 'A fazer',        cor: '#3E5BFF', ordem: 1, limite: 5 },
    { id: 'em-progresso',nome: 'Em progresso',   cor: '#EF9F27', ordem: 2, limite: 3 },
    { id: 'revisao',     nome: 'Revisão',        cor: '#7A5AF8', ordem: 3 },
    { id: 'concluido',   nome: 'Concluído',      cor: '#0fa856', ordem: 4 },
  ],
  cards: [
    {
      id: 'c1', titulo: 'Qualificar leads da campanha Abril', descricao: 'Revisar todos os leads captados na campanha de abril e classificar por potencial.',
      status: 'a-fazer', responsavel: 'Ana Lima', responsavelInitials: 'AL',
      prioridade: 'alta', dataVencimento: '2026-04-28',
      tags: ['leads', 'campanha'], comentarios: [], camposCustom: [], criadoEm: '2026-04-15', atualizadoEm: '2026-04-15', ordem: 0,
    },
    {
      id: 'c2', titulo: 'Follow-up cliente Tuler Odonto', descricao: 'Realizar ligação de acompanhamento pós-proposta.',
      status: 'em-progresso', responsavel: 'Carlos Melo', responsavelInitials: 'CM',
      prioridade: 'urgente', dataVencimento: '2026-04-20',
      tags: ['follow-up'], comentarios: [
        { id: 'cm1', autor: 'Ana Lima', avatarInitials: 'AL', texto: 'Tentei contato ontem, sem retorno.', criadoEm: '2026-04-18' }
      ], camposCustom: [], criadoEm: '2026-04-14', atualizadoEm: '2026-04-18', ordem: 0,
    },
    {
      id: 'c3', titulo: 'Proposta comercial Implante Premium', descricao: 'Montar proposta personalizada para paciente VIP.',
      status: 'revisao', responsavel: 'Beatriz Costa', responsavelInitials: 'BC',
      prioridade: 'alta', dataVencimento: '2026-04-22',
      tags: ['proposta', 'vip'], comentarios: [], camposCustom: [], criadoEm: '2026-04-12', atualizadoEm: '2026-04-17', ordem: 0,
    },
    {
      id: 'c4', titulo: 'Atualizar cadastro de contatos', descricao: 'Verificar e atualizar dados desatualizados na base.',
      status: 'backlog', responsavel: undefined, responsavelInitials: undefined,
      prioridade: 'baixa', dataVencimento: undefined,
      tags: ['dados'], comentarios: [], camposCustom: [], criadoEm: '2026-04-10', atualizadoEm: '2026-04-10', ordem: 0,
    },
    {
      id: 'c5', titulo: 'Onboarding novo cliente Oral Sin', descricao: 'Apresentar plataforma e definir estratégia inicial.',
      status: 'concluido', responsavel: 'Ana Lima', responsavelInitials: 'AL',
      prioridade: 'media', dataVencimento: '2026-04-15',
      tags: ['onboarding'], comentarios: [], camposCustom: [], criadoEm: '2026-04-08', atualizadoEm: '2026-04-15', ordem: 0,
    },
    {
      id: 'c6', titulo: 'Analisar ROI campanha Q1', descricao: 'Compilar métricas e preparar relatório executivo.',
      status: 'a-fazer', responsavel: 'Carlos Melo', responsavelInitials: 'CM',
      prioridade: 'media', dataVencimento: '2026-04-30',
      tags: ['relatório', 'análise'], comentarios: [], camposCustom: [], criadoEm: '2026-04-16', atualizadoEm: '2026-04-16', ordem: 1,
    },
    {
      id: 'c7', titulo: 'Configurar automação de e-mail', descricao: 'Criar sequência de nurturing para leads frios.',
      status: 'backlog', responsavel: 'Beatriz Costa', responsavelInitials: 'BC',
      prioridade: 'media', dataVencimento: undefined,
      tags: ['automação', 'email'], comentarios: [], camposCustom: [], criadoEm: '2026-04-11', atualizadoEm: '2026-04-11', ordem: 1,
    },
  ],
}
