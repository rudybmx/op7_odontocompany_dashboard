'use client'

import { Minus, Plus, Redo2, Save, Scan, Undo2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

interface MapaToolbarProps {
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  onReLayout: () => void
  onFitView: () => void
  onToggleDirection: () => void
  direction: 'LR' | 'TB'
  isDirty: boolean
  isSaving: boolean
  onSave: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  zoomPercent: number
}

export default function MapaToolbar({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onReLayout,
  onFitView,
  onToggleDirection,
  direction,
  isDirty,
  isSaving,
  onSave,
  onZoomIn,
  onZoomOut,
  zoomPercent,
}: MapaToolbarProps) {
  return (
    <div className="absolute top-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-border/10 bg-card px-3 py-2 shadow-md">
      <Button type="button" variant="outline" size="sm" disabled={!canUndo} onClick={onUndo} className="border-border/10 text-foreground hover:bg-muted/30">
        <Undo2 className="h-4 w-4" />
        Desfazer
      </Button>
      <Button type="button" variant="outline" size="sm" disabled={!canRedo} onClick={onRedo} className="border-border/10 text-foreground hover:bg-muted/30">
        <Redo2 className="h-4 w-4" />
        Refazer
      </Button>
      <Separator orientation="vertical" className="h-5 bg-border/10" />
      <Button type="button" variant="outline" size="sm" onClick={onReLayout} className="border-border/10 text-foreground hover:bg-muted/30">
        ⊞ Reorganizar
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={onFitView} className="border-border/10 text-foreground hover:bg-muted/30">
        <Scan className="h-4 w-4" />
        Fit View
      </Button>
      <Separator orientation="vertical" className="h-5 bg-border/10" />
      <Button type="button" variant="outline" size="icon-sm" onClick={onZoomOut} className="border-border/10 text-foreground hover:bg-muted/30">
        <Minus className="h-4 w-4" />
      </Button>
      <div className="min-w-12 text-center text-[12px] font-medium text-foreground">{zoomPercent}%</div>
      <Button type="button" variant="outline" size="icon-sm" onClick={onZoomIn} className="border-border/10 text-foreground hover:bg-muted/30">
        <Plus className="h-4 w-4" />
      </Button>
      <Separator orientation="vertical" className="h-5 bg-border/10" />
      <Button type="button" variant="outline" size="sm" onClick={onToggleDirection} className="border-border/10 text-foreground hover:bg-muted/30">
        {direction === 'LR' ? 'LR' : 'TB'}
      </Button>
      <Button
        type="button"
        size="sm"
        disabled={!isDirty || isSaving}
        onClick={onSave}
        className={isDirty ? 'bg-[var(--ws-gold)] text-white hover:bg-[#b8943d]' : 'bg-muted text-muted-foreground'}
      >
        {isDirty && <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-white" />}
        <Save className="h-4 w-4" />
        {isSaving ? 'Salvando' : 'Salvar'}
      </Button>
    </div>
  )
}
