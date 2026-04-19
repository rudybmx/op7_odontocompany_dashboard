import type { Edge, Node } from 'reactflow'

export interface MapaNodeData {
  label: string
  level: number
  isEditing: boolean
  isCollapsed: boolean
  childCount: number
  color?: string
  onAddChild?: (nodeId: string) => void
  onDelete?: (nodeId: string) => void
  onToggleCollapse?: (nodeId: string) => void
  onUpdateNode?: (nodeId: string, patch: { label: string; color?: string }) => void
  canDelete?: boolean
}

export type MapaNode = Node<MapaNodeData>
export type MapaEdge = Edge

export interface MindMap {
  id: string
  clientId: string
  clientName: string
  title: string
  description?: string
  createdAt: string
  updatedAt: string
  createdBy: string
  nodes: MapaNode[]
  edges: MapaEdge[]
}

export interface MapaState {
  nodes: MapaNode[]
  edges: MapaEdge[]
  isDirty: boolean
}
