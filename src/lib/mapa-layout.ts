import dagre from '@dagrejs/dagre'
import type { MapaEdge, MapaNode } from '@/types/mapa'

const NODE_DIMENSIONS: Record<number, { width: number; height: number }> = {
  0: { width: 180, height: 56 },
  1: { width: 160, height: 44 },
  2: { width: 140, height: 40 },
  3: { width: 130, height: 36 },
  4: { width: 120, height: 32 },
}

const DEFAULT_DIM = { width: 120, height: 32 }

export function getAutoLayout(
  nodes: MapaNode[],
  edges: MapaEdge[],
  direction: 'LR' | 'TB' = 'LR'
): MapaNode[] {
  const graph = new dagre.graphlib.Graph()
  graph.setDefaultEdgeLabel(() => ({}))
  graph.setGraph({
    rankdir: direction,
    ranksep: 80,
    nodesep: 24,
    marginx: 40,
    marginy: 40,
  })

  nodes.forEach((node) => {
    const dimensions = NODE_DIMENSIONS[node.data.level] ?? DEFAULT_DIM
    graph.setNode(node.id, { width: dimensions.width, height: dimensions.height })
  })

  const collapsedIds = new Set(nodes.filter((node) => node.data.isCollapsed).map((node) => node.id))

  edges.forEach((edge) => {
    if (!collapsedIds.has(edge.source)) {
      graph.setEdge(edge.source, edge.target)
    }
  })

  dagre.layout(graph)

  return nodes.map((node) => {
    const position = graph.node(node.id)
    const dimensions = NODE_DIMENSIONS[node.data.level] ?? DEFAULT_DIM
    return {
      ...node,
      position: position
        ? {
            x: position.x - dimensions.width / 2,
            y: position.y - dimensions.height / 2,
          }
        : node.position,
    }
  })
}
