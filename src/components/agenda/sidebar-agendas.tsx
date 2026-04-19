'use client'

import { Agenda } from '@/types/agenda'

interface Props {
  agendas: Agenda[]
  agendasVisiveis: string[]
  onToggleVisibilidade: (id: string) => void
  onEditar: (agenda: Agenda) => void
  onNova: () => void
  onConfiguracoes: () => void
  onBloqueios: () => void
}

export function SidebarAgendas({
  agendas,
  agendasVisiveis,
  onToggleVisibilidade,
  onEditar,
  onNova,
  onConfiguracoes,
  onBloqueios,
}: Props) {
  // TODO: Implementar sidebar completa com:
  // - Listagem de agendas com checkbox de visibilidade
  // - Botão "+ Nova Agenda"
  // - Links p/ Configurações e Bloqueios
  return (
    <div style={{ padding: 16, color: 'var(--foreground)', fontSize: 14 }}>
      <p style={{ opacity: 0.4 }}>SidebarAgendas — TODO</p>
    </div>
  )
}
