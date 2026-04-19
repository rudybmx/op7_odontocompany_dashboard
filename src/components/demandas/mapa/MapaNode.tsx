'use client'

import { ChevronDown, ChevronRight, Pencil, Plus, X } from 'lucide-react'
import { Handle, Position, type NodeProps } from 'reactflow'
import MapaNodeEditor from '@/components/demandas/mapa/MapaNodeEditor'
import { getNodeColors } from '@/lib/mapa-utils'
import type { MapaNodeData } from '@/types/mapa'

export default function MapaNode({ id, data }: NodeProps<MapaNodeData>) {
  const colors = getNodeColors(data.level)
  const backgroundColor = data.color ?? colors.bg
  const textColor = data.color ? '#ffffff' : colors.text
  const borderColor = colors.border

  const sizeClasses =
    data.level === 0
      ? 'rounded-full px-6 py-3 text-[15px] font-semibold shadow-[0_4px_20px_rgba(15,39,68,0.25)]'
      : data.level === 1
        ? 'rounded-xl px-4 py-2.5 text-[13px] font-medium shadow-[0_2px_12px_rgba(201,168,76,0.30)]'
        : data.level === 2
          ? 'rounded-lg px-3 py-2 text-[13px] shadow-[0_2px_8px_rgba(79,107,237,0.20)]'
          : 'rounded-md px-3 py-1.5 text-[12px]'

  return (
    <div className="group relative">
      {data.level > 0 && <Handle type="target" position={Position.Left} />}

      <div
        className={sizeClasses}
        style={{
          backgroundColor,
          color: textColor,
          border: borderColor === 'transparent' ? undefined : `1px solid ${borderColor}`,
        }}
      >
        <div className="max-w-[140px] truncate">{data.label}</div>
        {data.childCount > 0 && data.isCollapsed && (
          <div className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1 text-[10px] text-white">
            {data.childCount}
          </div>
        )}
      </div>

      <div className="absolute -bottom-7 left-1/2 flex -translate-x-1/2 gap-1 rounded-full border border-border/10 bg-card px-2 py-1 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
        <button type="button" onClick={() => data.onAddChild?.(id)} className="text-muted-foreground hover:text-foreground">
          <Plus className="h-4 w-4" />
        </button>

        <MapaNodeEditor label={data.label} color={data.color} onConfirm={(payload) => data.onUpdateNode?.(id, payload)}>
          <button type="button" className="text-muted-foreground hover:text-foreground">
            <Pencil className="h-4 w-4" />
          </button>
        </MapaNodeEditor>

        {data.childCount > 0 && (
          <button type="button" onClick={() => data.onToggleCollapse?.(id)} className="text-muted-foreground hover:text-foreground">
            {data.isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        )}

        {data.canDelete !== false && (
          <button type="button" onClick={() => data.onDelete?.(id)} className="text-muted-foreground hover:text-[#a32d2d]">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <Handle type="source" position={Position.Right} />
    </div>
  )
}
