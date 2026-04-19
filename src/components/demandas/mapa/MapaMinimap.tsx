'use client'

import { MiniMap } from 'reactflow'
import { getNodeColors } from '@/lib/mapa-utils'
import type { MapaNode } from '@/types/mapa'

export default function MapaMinimap() {
  return (
    <MiniMap
      nodeColor={(node) => getNodeColors((node as MapaNode).data.level).bg}
      maskColor="rgba(15,39,68,0.05)"
      className="!rounded-lg !border !border-border/10 !bg-card"
    />
  )
}
