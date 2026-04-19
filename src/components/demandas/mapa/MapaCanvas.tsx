'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  applyEdgeChanges,
  applyNodeChanges,
  useEdgesState,
  useNodesState,
  useReactFlow,
  useViewport,
  type EdgeChange,
  type NodeChange,
} from 'reactflow'
import { toast } from 'sonner'
import MapaMinimap from '@/components/demandas/mapa/MapaMinimap'
import MapaNodeComponent from '@/components/demandas/mapa/MapaNode'
import MapaToolbar from '@/components/demandas/mapa/MapaToolbar'
import { getAutoLayout } from '@/lib/mapa-layout'
import { countDirectChildren, createChildNode, generateEdgeId, getDescendantIds, getVisibleNodeIds } from '@/lib/mapa-utils'
import type { MindMap, MapaEdge, MapaNode, MapaState } from '@/types/mapa'

interface MapaCanvasProps {
  selectedMap: MindMap
  exportRequestId: number
  onSaveMap: (mapId: string, state: MapaState) => void
}

interface GraphSnapshot {
  nodes: MapaNode[]
  edges: MapaEdge[]
}

function cloneGraph(nodes: MapaNode[], edges: MapaEdge[]): GraphSnapshot {
  return JSON.parse(JSON.stringify({ nodes, edges })) as GraphSnapshot
}

function sleep(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

function CanvasInner({ selectedMap, exportRequestId, onSaveMap }: MapaCanvasProps) {
  const reactFlow = useReactFlow()
  const viewport = useViewport()
  const [direction, setDirection] = useState<'LR' | 'TB'>('LR')
  const actionRef = useRef<{
    addChildNode: (nodeId: string) => void
    deleteNode: (nodeId: string) => void
    updateNodeLabel: (nodeId: string, patch: { label: string; color?: string }) => void
    toggleCollapse: (nodeId: string) => void
  }>({
    addChildNode: () => undefined,
    deleteNode: () => undefined,
    updateNodeLabel: () => undefined,
    toggleCollapse: () => undefined,
  })
  const initialGraph = useMemo(() => cloneGraph(selectedMap.nodes, selectedMap.edges), [selectedMap.edges, selectedMap.nodes])
  const [history, setHistory] = useState<GraphSnapshot[]>([initialGraph])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [isDirty, setIsDirty] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const prepareGraph = useCallback(
    (rawNodes: MapaNode[], rawEdges: MapaEdge[], nextDirection: 'LR' | 'TB', shouldRelayout = true): GraphSnapshot => {
      const visibleIds = getVisibleNodeIds(rawNodes, rawEdges)
      const visibleEdges = rawEdges.filter((edge) => visibleIds.has(edge.source) && visibleIds.has(edge.target))
      const visibleNodes = rawNodes.filter((node) => visibleIds.has(node.id))
      const laidOutNodes = shouldRelayout ? getAutoLayout(visibleNodes, visibleEdges, nextDirection) : visibleNodes
      const positionMap = new Map(laidOutNodes.map((node) => [node.id, node.position]))

      const nodes = rawNodes.map((node) => ({
        ...node,
        hidden: !visibleIds.has(node.id),
        draggable: false,
        data: {
          ...node.data,
          childCount: countDirectChildren(node.id, rawEdges),
          onAddChild: actionRef.current.addChildNode,
          onDelete: actionRef.current.deleteNode,
          onToggleCollapse: actionRef.current.toggleCollapse,
          onUpdateNode: actionRef.current.updateNodeLabel,
          canDelete: node.data.level > 0,
        },
        position: positionMap.get(node.id) ?? node.position,
      }))

      const edges = rawEdges.map((edge) => ({
        ...edge,
        type: 'smoothstep',
        animated: false,
        hidden: !visibleIds.has(edge.source) || !visibleIds.has(edge.target),
      }))

      return { nodes, edges }
    },
    []
  )

  const preparedInitialGraph = useMemo(
    () => prepareGraph(initialGraph.nodes, initialGraph.edges, direction, true),
    [direction, initialGraph.edges, initialGraph.nodes, prepareGraph]
  )

  const [nodes, setNodes] = useNodesState(preparedInitialGraph.nodes)
  const [edges, setEdges] = useEdgesState(preparedInitialGraph.edges)

  const fitCanvas = useCallback(() => {
    requestAnimationFrame(() => {
      reactFlow.fitView({ padding: 0.2, duration: 300 })
    })
  }, [reactFlow])

  const pushHistory = useCallback((rawNodes: MapaNode[], rawEdges: MapaEdge[]) => {
    const snapshot = cloneGraph(rawNodes, rawEdges)
    setHistory((current) => {
      const next = [...current.slice(0, historyIndex + 1), snapshot]
      return next.length > 50 ? next.slice(next.length - 50) : next
    })
    setHistoryIndex((current) => Math.min(current + 1, 49))
  }, [historyIndex])

  const applyGraph = useCallback(
    (
      rawNodes: MapaNode[],
      rawEdges: MapaEdge[],
      options?: { pushHistory?: boolean; relayout?: boolean; markDirty?: boolean; fit?: boolean; nextDirection?: 'LR' | 'TB' }
    ) => {
      const graph = prepareGraph(rawNodes, rawEdges, options?.nextDirection ?? direction, options?.relayout ?? true)
      setNodes(graph.nodes)
      setEdges(graph.edges)
      if (options?.pushHistory) pushHistory(rawNodes, rawEdges)
      if (options?.markDirty) setIsDirty(true)
      if (options?.fit) fitCanvas()
    },
    [direction, fitCanvas, prepareGraph, pushHistory, setEdges, setNodes]
  )

  const addChildNode = useCallback((parentId: string) => {
    const snapshot = cloneGraph(nodes, edges)
    const parent = snapshot.nodes.find((node) => node.id === parentId)
    if (!parent) return
    const child = createChildNode(parentId, parent.data.level, 'Novo nó')
    parent.data.isCollapsed = false
    snapshot.nodes.push(child)
    snapshot.edges.push({
      id: generateEdgeId(parentId, child.id),
      source: parentId,
      target: child.id,
      type: 'smoothstep',
      animated: false,
    })
    applyGraph(snapshot.nodes, snapshot.edges, { pushHistory: true, relayout: true, markDirty: true, fit: true })
  }, [applyGraph, edges, nodes])

  const deleteNode = useCallback((nodeId: string) => {
    const snapshot = cloneGraph(nodes, edges)
    const node = snapshot.nodes.find((entry) => entry.id === nodeId)
    if (!node || node.data.level === 0) return
    const descendantIds = new Set([nodeId, ...getDescendantIds(nodeId, snapshot.edges)])
    const nextNodes = snapshot.nodes.filter((entry) => !descendantIds.has(entry.id))
    const nextEdges = snapshot.edges.filter((edge) => !descendantIds.has(edge.source) && !descendantIds.has(edge.target))
    applyGraph(nextNodes, nextEdges, { pushHistory: true, relayout: true, markDirty: true, fit: true })
  }, [applyGraph, edges, nodes])

  const updateNodeLabel = useCallback((nodeId: string, patch: { label: string; color?: string }) => {
    const snapshot = cloneGraph(nodes, edges)
    const nextNodes = snapshot.nodes.map((node) =>
      node.id === nodeId
        ? {
            ...node,
            data: {
              ...node.data,
              label: patch.label,
              color: patch.color,
            },
          }
        : node
    )
    applyGraph(nextNodes, snapshot.edges, { pushHistory: true, relayout: false, markDirty: true })
  }, [applyGraph, edges, nodes])

  const toggleCollapse = useCallback((nodeId: string) => {
    const snapshot = cloneGraph(nodes, edges)
    const nextNodes = snapshot.nodes.map((node) =>
      node.id === nodeId
        ? {
            ...node,
            data: {
              ...node.data,
              isCollapsed: !node.data.isCollapsed,
            },
          }
        : node
    )
    applyGraph(nextNodes, snapshot.edges, { pushHistory: true, relayout: true, markDirty: true, fit: true })
  }, [applyGraph, edges, nodes])

  actionRef.current = { addChildNode, deleteNode, updateNodeLabel, toggleCollapse }

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  const handleUndo = useCallback(() => {
    if (!canUndo) return
    const nextIndex = historyIndex - 1
    const snapshot = history[nextIndex]
    const graph = prepareGraph(snapshot.nodes, snapshot.edges, direction, true)
    setNodes(graph.nodes)
    setEdges(graph.edges)
    setHistoryIndex(nextIndex)
    setIsDirty(nextIndex !== 0)
    fitCanvas()
  }, [canUndo, direction, fitCanvas, history, historyIndex, prepareGraph, setEdges, setNodes])

  const handleRedo = useCallback(() => {
    if (!canRedo) return
    const nextIndex = historyIndex + 1
    const snapshot = history[nextIndex]
    const graph = prepareGraph(snapshot.nodes, snapshot.edges, direction, true)
    setNodes(graph.nodes)
    setEdges(graph.edges)
    setHistoryIndex(nextIndex)
    setIsDirty(true)
    fitCanvas()
  }, [canRedo, direction, fitCanvas, history, historyIndex, prepareGraph, setEdges, setNodes])

  const handleToggleDirection = useCallback(() => {
    const nextDirection = direction === 'LR' ? 'TB' : 'LR'
    setDirection(nextDirection)
    const snapshot = cloneGraph(nodes, edges)
    applyGraph(snapshot.nodes, snapshot.edges, { pushHistory: true, relayout: true, markDirty: true, fit: true, nextDirection })
  }, [applyGraph, direction, edges, nodes])

  const handleReLayout = useCallback(() => {
    const snapshot = cloneGraph(nodes, edges)
    applyGraph(snapshot.nodes, snapshot.edges, { pushHistory: true, relayout: true, markDirty: true, fit: true })
  }, [applyGraph, edges, nodes])

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    await sleep(600)
    const snapshot = cloneGraph(nodes, edges)
    onSaveMap(selectedMap.id, { nodes: snapshot.nodes, edges: snapshot.edges, isDirty: false })
    setHistory([snapshot])
    setHistoryIndex(0)
    setIsDirty(false)
    setIsSaving(false)
    toast.success('Mapa salvo com sucesso')
  }, [edges, nodes, onSaveMap, selectedMap.id])

  const exportPNG = useCallback(async () => {
    try {
      const module = (await import('reactflow')) as Record<string, unknown>
      const element = document.querySelector('.react-flow') as HTMLElement | null
      const toPng = module.toPng

      if (typeof toPng !== 'function' || !element) {
        toast.error('Exportação PNG indisponível nesta versão do ReactFlow')
        return
      }

      const dataUrl = await toPng(element)
      const link = document.createElement('a')
      link.download = `${selectedMap.title}.png`
      link.href = dataUrl as string
      link.click()
    } catch {
      toast.error('Não foi possível exportar o mapa em PNG')
    }
  }, [selectedMap.title])

  const lastExportRequestRef = useRef(0)
  if (exportRequestId !== lastExportRequestRef.current) {
    lastExportRequestRef.current = exportRequestId
    if (exportRequestId > 0) {
      void exportPNG()
    }
  }

  const nodeTypes = useMemo(() => ({ mapaNode: MapaNodeComponent }), [])

  return (
    <div className="relative flex-1 bg-muted/20">
      <MapaToolbar
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onReLayout={handleReLayout}
        onFitView={fitCanvas}
        onToggleDirection={handleToggleDirection}
        direction={direction}
        isDirty={isDirty}
        isSaving={isSaving}
        onSave={handleSave}
        onZoomIn={() => void reactFlow.zoomIn({ duration: 200 })}
        onZoomOut={() => void reactFlow.zoomOut({ duration: 200 })}
        zoomPercent={Math.round(viewport.zoom * 100)}
      />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={(changes: NodeChange[]) => setNodes((current) => applyNodeChanges(changes, current))}
        onEdgesChange={(changes: EdgeChange[]) => setEdges((current) => applyEdgeChanges(changes, current))}
        fitView
        fitViewOptions={{ padding: 0.2, duration: 300 }}
        minZoom={0.2}
        maxZoom={2}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable
        defaultEdgeOptions={{ type: 'smoothstep', animated: false, style: { stroke: 'var(--xy-edge-stroke)', strokeWidth: 2 } }}
        proOptions={{ hideAttribution: true }}
        className="bg-transparent"
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="rgba(15,39,68,0.08)" className="dark:opacity-30" />
        <MapaMinimap />
        <Controls className="!rounded-lg !border !border-border/10 !bg-card !shadow-none" showInteractive={false} />
      </ReactFlow>
    </div>
  )
}

export default function MapaCanvas(props: MapaCanvasProps) {
  return (
    <ReactFlowProvider>
      <CanvasInner {...props} />
    </ReactFlowProvider>
  )
}
