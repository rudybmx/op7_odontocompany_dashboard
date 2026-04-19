import type { MapaEdge, MapaNode } from '@/types/mapa'

export function generateNodeId(): string {
  return `node-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function generateEdgeId(source: string, target: string): string {
  return `edge-${source}-${target}`
}

export function getNodeColors(level: number): { bg: string; text: string; border: string } {
  if (level === 0) {
    return { bg: '#0f2744', text: '#ffffff', border: 'transparent' }
  }
  if (level === 1) {
    return { bg: 'var(--ws-gold)', text: '#ffffff', border: 'transparent' }
  }
  if (level === 2) {
    return { bg: '#4f6bed', text: '#ffffff', border: 'transparent' }
  }
  if (level === 3) {
    return { bg: 'hsl(var(--card))', text: 'hsl(var(--foreground))', border: 'hsl(var(--border) / 0.2)' }
  }
  return { bg: 'hsl(var(--muted) / 0.6)', text: 'hsl(var(--foreground))', border: 'hsl(var(--border) / 0.1)' }
}

export function getDescendantIds(nodeId: string, edges: MapaEdge[]): string[] {
  const descendants: string[] = []
  const visit = (currentId: string) => {
    edges
      .filter((edge) => edge.source === currentId)
      .forEach((edge) => {
        descendants.push(edge.target)
        visit(edge.target)
      })
  }

  visit(nodeId)
  return descendants
}

export function countDirectChildren(nodeId: string, edges: MapaEdge[]): number {
  return edges.filter((edge) => edge.source === nodeId).length
}

export function createRootNode(label: string): MapaNode {
  return {
    id: generateNodeId(),
    type: 'mapaNode',
    position: { x: 0, y: 0 },
    draggable: false,
    data: {
      label,
      level: 0,
      isEditing: false,
      isCollapsed: false,
      childCount: 0,
      canDelete: false,
    },
  }
}

export function createChildNode(parentId: string, parentLevel: number, label: string): MapaNode {
  return {
    id: generateNodeId(),
    type: 'mapaNode',
    position: { x: 0, y: 0 },
    draggable: false,
    data: {
      label,
      level: parentLevel + 1,
      isEditing: false,
      isCollapsed: false,
      childCount: 0,
      canDelete: parentId.length > 0,
    },
  }
}

export function getVisibleNodeIds(nodes: MapaNode[], edges: MapaEdge[]): Set<string> {
  const parentMap = new Map<string, string[]>()
  edges.forEach((edge) => {
    const parents = parentMap.get(edge.target) ?? []
    parents.push(edge.source)
    parentMap.set(edge.target, parents)
  })

  const collapsedMap = new Map(nodes.map((node) => [node.id, node.data.isCollapsed]))
  const isHidden = (nodeId: string): boolean => {
    const parents = parentMap.get(nodeId) ?? []
    return parents.some((parentId) => collapsedMap.get(parentId) || isHidden(parentId))
  }

  return new Set(nodes.filter((node) => !isHidden(node.id)).map((node) => node.id))
}
