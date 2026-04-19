export type TaskStatus =
  | 'nao_iniciado'
  | 'em_andamento'
  | 'concluido'
  | 'atrasado'
  | 'em_risco'

export type TaskPriority = 'alta' | 'media' | 'baixa'

export interface PmpTask {
  id: string
  phase: string
  phaseOrder: number
  title: string
  assignee: string
  assigneeInitials: string
  startDate: string
  endDate: string
  status: TaskStatus
  priority: TaskPriority
  progress: number
  description?: string
  deliverables?: string[]
  tags?: string[]
  color?: string
}

export interface PmpPhase {
  id: string
  name: string
  order: number
  tasks: PmpTask[]
  color: string
}

export interface PmpVersion {
  id: string
  version: string
  createdAt: string
  createdBy: string
  changesSummary: string
}

export interface PmpPlan {
  id: string
  clientId: string
  clientName: string
  version: string
  title: string
  startDate: string
  endDate: string
  status: TaskStatus
  createdAt: string
  updatedAt: string
  createdBy: string
  phases: PmpPhase[]
  versions: PmpVersion[]
}
