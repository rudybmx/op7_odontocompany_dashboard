import type { PmpPhase, PmpPlan, PmpTask, PmpVersion, TaskPriority, TaskStatus } from '@/types/pmp'

const PHASES = [
  { id: 'diagnostico', name: 'Diagnóstico e Estratégia', color: '#4f6bed' },
  { id: 'identidade', name: 'Identidade e Posicionamento', color: 'var(--ws-gold)' },
  { id: 'conteudo', name: 'Criação de Conteúdo', color: '#3b8f6d' },
  { id: 'midia-paga', name: 'Mídia Paga', color: '#7c4dbd' },
  { id: 'analise', name: 'Análise e Otimização', color: '#bf5a2f' },
] as const

const PEOPLE = [
  { name: 'Ana Lima', initials: 'AL' },
  { name: 'Leo Costa', initials: 'LC' },
  { name: 'Fernanda Reis', initials: 'FR' },
  { name: 'Marcos Dutra', initials: 'MD' },
  { name: 'Juliana Park', initials: 'JP' },
] as const

const CLIENTS = [
  {
    id: 'lumie',
    name: 'Clínica Estética Lumié',
    version: '3.2',
    updatedAt: '2025-03-15',
    createdAt: '2025-01-08',
    createdBy: 'Fernanda Reis',
    status: 'em_andamento' as const,
    phaseTasks: [
      [
        ['Mapear jornada das pacientes', '2025-01-08', '2025-01-24', 'concluido', 100, 'alta'],
        ['Diagnóstico de concorrência regional', '2025-01-15', '2025-02-02', 'concluido', 100, 'alta'],
        ['Plano de diferenciação premium', '2025-01-27', '2025-02-14', 'em_andamento', 78, 'alta'],
      ],
      [
        ['Refinar proposta de valor', '2025-02-10', '2025-03-04', 'concluido', 100, 'alta'],
        ['Manual visual da clínica', '2025-02-20', '2025-03-18', 'em_andamento', 62, 'media'],
        ['Ajuste de discurso comercial', '2025-03-01', '2025-03-21', 'em_risco', 44, 'media'],
      ],
      [
        ['Calendário editorial Q2', '2025-03-15', '2025-04-18', 'em_andamento', 58, 'alta'],
        ['Produção de reels institucionais', '2025-03-28', '2025-05-12', 'atrasado', 36, 'alta'],
        ['Sequência de e-mails sazonais', '2025-04-03', '2025-05-20', 'nao_iniciado', 0, 'media'],
        ['Biblioteca de provas sociais', '2025-04-10', '2025-05-02', 'em_andamento', 54, 'baixa'],
      ],
      [
        ['Estrutura de campanhas always-on', '2025-05-06', '2025-06-14', 'atrasado', 41, 'alta'],
        ['Campanha Botox Experience', '2025-05-20', '2025-07-12', 'em_andamento', 49, 'alta'],
        ['Teste criativo de captação local', '2025-06-01', '2025-07-05', 'em_risco', 31, 'media'],
        ['Retargeting para leads inativos', '2025-06-15', '2025-07-25', 'nao_iniciado', 0, 'media'],
      ],
      [
        ['Painel de CAC por procedimento', '2025-08-01', '2025-09-05', 'nao_iniciado', 0, 'alta'],
        ['Rotina quinzenal de otimização', '2025-09-08', '2025-11-28', 'nao_iniciado', 0, 'media'],
        ['Revisão anual de performance', '2025-12-01', '2025-12-19', 'nao_iniciado', 0, 'media'],
      ],
    ],
    versions: [
      ['3.2', '2025-03-15', 'Fernanda Reis', 'Adição de fase de Mídia Paga e ajuste de prazos críticos.'],
      ['3.1', '2025-03-02', 'Marcos Dutra', 'Revisão de responsáveis, dependências e entregas da fase 2.'],
      ['3.0', '2025-02-18', 'Ana Lima', 'Versão inicial consolidando estratégia, branding e conteúdo.'],
    ],
  },
  {
    id: 'bravo',
    name: 'Auto Peças Bravo',
    version: '2.8',
    updatedAt: '2025-04-08',
    createdAt: '2025-01-10',
    createdBy: 'Marcos Dutra',
    status: 'em_risco' as const,
    phaseTasks: [
      [
        ['Auditoria de mix e sazonalidade', '2025-01-10', '2025-01-31', 'concluido', 100, 'alta'],
        ['Mapa de canais por linha de produto', '2025-01-20', '2025-02-07', 'concluido', 100, 'media'],
        ['Planejamento promocional do semestre', '2025-02-01', '2025-02-28', 'em_andamento', 84, 'alta'],
      ],
      [
        ['Arquitetura de comunicação B2B/B2C', '2025-02-18', '2025-03-17', 'em_andamento', 59, 'alta'],
        ['Key visual de campanhas sazonais', '2025-03-01', '2025-03-26', 'atrasado', 39, 'alta'],
        ['Ajuste de naming por categoria', '2025-03-05', '2025-03-28', 'em_risco', 47, 'media'],
      ],
      [
        ['Calendário de ofertas mensais', '2025-03-24', '2025-05-16', 'em_andamento', 52, 'alta'],
        ['Conteúdo técnico para oficinas', '2025-04-01', '2025-05-30', 'em_andamento', 44, 'media'],
        ['Série de criativos por categoria', '2025-04-07', '2025-06-06', 'atrasado', 29, 'alta'],
      ],
      [
        ['Campanhas de giro rápido', '2025-05-12', '2025-07-04', 'em_andamento', 33, 'alta'],
        ['Promoções de inverno', '2025-06-02', '2025-07-18', 'nao_iniciado', 0, 'media'],
        ['Captação para representantes', '2025-06-16', '2025-08-01', 'nao_iniciado', 0, 'media'],
      ],
      [
        ['Modelo de dashboard por loja', '2025-08-11', '2025-09-19', 'nao_iniciado', 0, 'media'],
        ['Ciclo de otimização trimestral', '2025-09-22', '2025-11-21', 'nao_iniciado', 0, 'baixa'],
        ['Fechamento de aprendizados', '2025-12-01', '2025-12-22', 'nao_iniciado', 0, 'baixa'],
      ],
    ],
    versions: [
      ['2.8', '2025-04-08', 'Marcos Dutra', 'Ajuste do cronograma de conteúdo e antecipação da fase comercial.'],
      ['2.7', '2025-03-19', 'Juliana Park', 'Revisão da linha de campanhas sazonais e refinamento de targets.'],
      ['2.6', '2025-02-25', 'Ana Lima', 'Versão inicial após alinhamento com expansão regional.'],
    ],
  },
  {
    id: 'viva',
    name: 'Colégio Viva',
    version: '4.1',
    updatedAt: '2025-05-06',
    createdAt: '2025-01-06',
    createdBy: 'Ana Lima',
    status: 'em_andamento' as const,
    phaseTasks: [
      [
        ['Pesquisa com famílias e leads', '2025-01-06', '2025-01-29', 'concluido', 100, 'alta'],
        ['Diagnóstico de concorrentes por faixa etária', '2025-01-20', '2025-02-12', 'concluido', 100, 'alta'],
        ['Plano de diferenciação pedagógica', '2025-02-03', '2025-02-25', 'concluido', 100, 'alta'],
        ['Estratégia de captação 2º semestre', '2025-02-12', '2025-03-05', 'em_andamento', 77, 'alta'],
      ],
      [
        ['Refino do discurso institucional', '2025-03-01', '2025-03-28', 'concluido', 100, 'media'],
        ['Sistema visual de campanha matrícula', '2025-03-08', '2025-04-09', 'em_andamento', 71, 'alta'],
        ['Guia de tom para atendimento', '2025-03-20', '2025-04-10', 'em_andamento', 63, 'media'],
      ],
      [
        ['Calendário de conteúdo de autoridade', '2025-04-07', '2025-05-23', 'em_andamento', 56, 'alta'],
        ['Cobertura audiovisual do colégio', '2025-04-14', '2025-06-06', 'em_risco', 42, 'media'],
        ['Série de depoimentos de pais', '2025-04-28', '2025-06-20', 'em_andamento', 38, 'media'],
        ['Fluxo de nutrição para visitas', '2025-05-05', '2025-06-27', 'nao_iniciado', 0, 'media'],
      ],
      [
        ['Campanha de captação vestibulinho', '2025-06-02', '2025-08-01', 'nao_iniciado', 0, 'alta'],
        ['Campanha de bolsas segmentadas', '2025-06-16', '2025-08-15', 'nao_iniciado', 0, 'media'],
        ['Retargeting para lista de visitas', '2025-07-01', '2025-08-29', 'nao_iniciado', 0, 'media'],
      ],
      [
        ['Monitor de origem de matrícula', '2025-09-01', '2025-10-03', 'nao_iniciado', 0, 'alta'],
        ['Ritual mensal de otimização', '2025-10-06', '2025-11-28', 'nao_iniciado', 0, 'media'],
        ['Retrospectiva de captação 2025', '2025-12-01', '2025-12-18', 'nao_iniciado', 0, 'baixa'],
      ],
    ],
    versions: [
      ['4.1', '2025-05-06', 'Ana Lima', 'Ampliação da frente de conteúdo e ajustes para calendário de matrícula.'],
      ['4.0', '2025-04-12', 'Leo Costa', 'Inclusão de automações de nutrição e revisão de dependências entre fases.'],
      ['3.9', '2025-03-18', 'Fernanda Reis', 'Versão inicial do plano anual com foco em retenção e captação.'],
    ],
  },
  {
    id: 'apex',
    name: 'Imobiliária Apex',
    version: '3.4',
    updatedAt: '2025-04-18',
    createdAt: '2025-01-09',
    createdBy: 'Juliana Park',
    status: 'atrasado' as const,
    phaseTasks: [
      [
        ['Mapeamento de jornadas por perfil', '2025-01-09', '2025-01-30', 'concluido', 100, 'alta'],
        ['Benchmark regional de imóveis premium', '2025-01-22', '2025-02-13', 'concluido', 100, 'alta'],
        ['Estratégia de autoridade para corretores', '2025-02-04', '2025-03-03', 'em_andamento', 73, 'media'],
      ],
      [
        ['Reposicionamento visual de lançamentos', '2025-03-01', '2025-03-31', 'em_andamento', 64, 'alta'],
        ['Manifesto de marca para imóveis de alto padrão', '2025-03-10', '2025-04-08', 'atrasado', 43, 'alta'],
        ['Arquitetura de mensagens por bairro', '2025-03-17', '2025-04-18', 'em_risco', 52, 'media'],
      ],
      [
        ['Calendário de vídeos dos corretores', '2025-04-07', '2025-05-23', 'em_andamento', 51, 'alta'],
        ['Produção de tours curtos', '2025-04-15', '2025-06-10', 'atrasado', 35, 'alta'],
        ['Série de conteúdos sobre financiamento', '2025-04-28', '2025-06-13', 'em_andamento', 39, 'media'],
        ['Rotina de captação de leads orgânicos', '2025-05-05', '2025-06-20', 'nao_iniciado', 0, 'baixa'],
      ],
      [
        ['Campanha para plantões de lançamento', '2025-06-02', '2025-07-25', 'nao_iniciado', 0, 'alta'],
        ['Mídia paga para imóveis compactos', '2025-06-16', '2025-08-08', 'nao_iniciado', 0, 'media'],
        ['Campanha de remarketing WhatsApp', '2025-07-01', '2025-08-22', 'nao_iniciado', 0, 'media'],
      ],
      [
        ['Painel por corretor e origem', '2025-09-01', '2025-10-10', 'nao_iniciado', 0, 'alta'],
        ['Sprints de otimização quinzenal', '2025-10-13', '2025-11-28', 'nao_iniciado', 0, 'media'],
        ['Fechamento do ano comercial', '2025-12-01', '2025-12-18', 'nao_iniciado', 0, 'baixa'],
      ],
    ],
    versions: [
      ['3.4', '2025-04-18', 'Juliana Park', 'Replanejamento da fase de posicionamento e reforço do conteúdo comercial.'],
      ['3.3', '2025-03-22', 'Fernanda Reis', 'Atualização de cronograma após mudança de portfólio imobiliário.'],
      ['3.2', '2025-02-27', 'Leo Costa', 'Versão inicial com pilares de autoridade, mídia e captação.'],
    ],
  },
] as const

const descriptionTemplates: Record<string, string> = {
  'Diagnóstico e Estratégia': 'Levantamento de contexto, análise competitiva e definição de direcionadores estratégicos do plano.',
  'Identidade e Posicionamento': 'Ajuste de narrativa, visual e diferenciais para elevar clareza e percepção de valor da marca.',
  'Criação de Conteúdo': 'Produção e organização de ativos editoriais, criativos e rotinas de publicação.',
  'Mídia Paga': 'Estruturação de campanhas, públicos, testes criativos e monitoramento de aquisição.',
  'Análise e Otimização': 'Rituais de revisão, leitura de indicadores e otimização contínua do plano.',
}

function getPerson(index: number) {
  return PEOPLE[index % PEOPLE.length]
}

function buildTask(
  clientId: string,
  phase: (typeof PHASES)[number],
  phaseOrder: number,
  taskIndex: number,
  task: readonly [string, string, string, TaskStatus, number, TaskPriority]
): PmpTask {
  const assignee = getPerson(phaseOrder + taskIndex)

  return {
    id: `${clientId}-${phase.id}-task-${taskIndex + 1}`,
    phase: phase.name,
    phaseOrder,
    title: task[0],
    assignee: assignee.name,
    assigneeInitials: assignee.initials,
    startDate: task[1],
    endDate: task[2],
    status: task[3],
    priority: task[5],
    progress: task[4],
    description: `${descriptionTemplates[phase.name]} Esta frente cobre ${task[0].toLowerCase()} com acompanhamento semanal e checkpoints da agência.`,
    deliverables: [
      `Briefing de ${task[0].toLowerCase()}`,
      'Aprovação do cliente',
      'Publicação e validação operacional',
    ],
    tags: [phase.name.split(' ')[0].toLowerCase(), assignee.initials.toLowerCase(), task[5]],
    color: phase.color,
  }
}

function buildPhase(clientId: string, phase: (typeof PHASES)[number], order: number, tasks: readonly (readonly [string, string, string, TaskStatus, number, TaskPriority])[]): PmpPhase {
  return {
    id: `${clientId}-${phase.id}`,
    name: phase.name,
    order,
    color: phase.color,
    tasks: tasks.map((task, index) => buildTask(clientId, phase, order, index, task)),
  }
}

function buildVersion(clientId: string, version: readonly [string, string, string, string], index: number): PmpVersion {
  return {
    id: `${clientId}-version-${index + 1}`,
    version: `v${version[0]}`,
    createdAt: version[1],
    createdBy: version[2],
    changesSummary: version[3],
  }
}

export const pmpPlans: PmpPlan[] = CLIENTS.map((client) => ({
  id: `plan-${client.id}`,
  clientId: client.id,
  clientName: client.name,
  version: client.version,
  title: 'Plano de Marketing Personalizado',
  startDate: '2025-01-01',
  endDate: '2025-12-31',
  status: client.status,
  createdAt: client.createdAt,
  updatedAt: client.updatedAt,
  createdBy: client.createdBy,
  phases: client.phaseTasks.map((tasks, index) => buildPhase(client.id, PHASES[index], index + 1, tasks)),
  versions: client.versions.map((version, index) => buildVersion(client.id, version, index)),
}))

export const pmpClients = pmpPlans.map((plan) => ({
  id: plan.clientId,
  name: plan.clientName,
}))

export function getPmpPlanByClientId(clientId: string): PmpPlan | undefined {
  return pmpPlans.find((plan) => plan.clientId === clientId)
}
