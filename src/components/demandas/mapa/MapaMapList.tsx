'use client'

import { MoreHorizontal, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import type { MindMap } from '@/types/mapa'

interface MapaMapListProps {
  open: boolean
  onClose: () => void
  maps: MindMap[]
  clientName: string
  selectedMapId: string
  onSelectMap: (id: string) => void
  onNewMap: () => void
  onDeleteMap: (id: string) => void
  onRenameMap: (id: string) => void
}

export default function MapaMapList({
  open,
  onClose,
  maps,
  clientName,
  selectedMapId,
  onSelectMap,
  onNewMap,
  onDeleteMap,
  onRenameMap,
}: MapaMapListProps) {
  return (
    <Sheet open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <SheetContent side="left" className="w-[300px] max-w-[300px] border-r border-border/10 bg-card p-0">
        <SheetHeader className="border-b border-border/10 px-5 py-4">
          <SheetTitle className="text-[15px] font-semibold text-foreground">{`Mapas — ${clientName}`}</SheetTitle>
        </SheetHeader>

        <div className="border-b border-border/10 p-4">
          <Button type="button" variant="outline" onClick={onNewMap} className="w-full border-border/10 text-foreground hover:bg-muted/30">
            <Plus className="h-4 w-4" />
            Novo Mapa
          </Button>
        </div>

        <div className="overflow-y-auto">
          {maps.map((map) => {
            const isActive = map.id === selectedMapId
            return (
              <button
                key={map.id}
                type="button"
                onClick={() => {
                  onSelectMap(map.id)
                  onClose()
                }}
                className={`flex w-full items-start gap-3 border-b border-border/10 px-4 py-4 text-left transition-colors hover:bg-muted/30 ${isActive ? 'border-l-2 border-[var(--ws-gold)] bg-[var(--ws-gold)]/10' : ''}`}
              >
                <span className={`mt-1 inline-flex h-2.5 w-2.5 rounded-full ${isActive ? 'bg-[var(--ws-gold)]' : 'bg-muted-foreground/40'}`} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium text-foreground">{map.title}</div>
                  <div className="mt-1 text-[12px] text-muted-foreground">{`${map.nodes.length} nós · ${map.updatedAt}`}</div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(event) => event.stopPropagation()}
                      onKeyDown={(event) => event.stopPropagation()}
                      className="rounded-full p-1 text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-36 border-border/10 bg-card">
                    <DropdownMenuItem onClick={() => onRenameMap(map.id)}>Renomear</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDeleteMap(map.id)} className="text-[#a32d2d]">
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </button>
            )
          })}
        </div>
      </SheetContent>
    </Sheet>
  )
}
