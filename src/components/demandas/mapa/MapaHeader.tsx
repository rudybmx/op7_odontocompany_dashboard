'use client'

import { Download, GitBranch, LayoutList, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatDateBR } from '@/lib/gantt-utils'
import type { MindMap } from '@/types/mapa'

interface MapaHeaderProps {
  clients: { id: string; name: string }[]
  selectedClientId: string
  onClientChange: (id: string) => void
  maps: MindMap[]
  selectedMapId: string
  onMapChange: (id: string) => void
  onNewMap: () => void
  onExportPNG: () => void
  onOpenMapList: () => void
}

export default function MapaHeader({
  clients,
  selectedClientId,
  onClientChange,
  maps,
  selectedMapId,
  onMapChange,
  onNewMap,
  onExportPNG,
  onOpenMapList,
}: MapaHeaderProps) {
  const activeMap = maps.find((map) => map.id === selectedMapId) ?? maps[0]

  return (
    <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border/10 bg-card p-5">
      <div className="flex min-w-0 items-start gap-3">
        <div className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-xl bg-muted/40 text-foreground">
          <GitBranch className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h1 className="text-[18px] font-semibold text-foreground">Mapa Mental</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px] text-muted-foreground">
            <span>Builder visual de estratégia</span>
            {activeMap && (
              <Badge className="rounded-full border border-border/10 bg-muted/40 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                {`Atualizado em ${formatDateBR(activeMap.updatedAt)}`}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <Select value={selectedClientId} onValueChange={onClientChange}>
          <SelectTrigger className="h-10 min-w-64 border-border/10 bg-card text-foreground">
            <SelectValue placeholder="Selecionar cliente" />
          </SelectTrigger>
          <SelectContent className="border-border/10 bg-card">
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedMapId} onValueChange={onMapChange}>
          <SelectTrigger className="h-10 min-w-56 border-border/10 bg-card text-foreground">
            <SelectValue placeholder="Selecionar mapa" />
          </SelectTrigger>
          <SelectContent className="border-border/10 bg-card">
            {maps.map((map) => (
              <SelectItem key={map.id} value={map.id}>
                {map.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button type="button" variant="outline" onClick={onOpenMapList} className="border-border/10 text-foreground hover:bg-muted/30">
          <LayoutList className="h-4 w-4" />
          Mapas
        </Button>
        <Button type="button" variant="outline" onClick={onNewMap} className="border-border/10 text-foreground hover:bg-muted/30">
          <Plus className="h-4 w-4" />
          Novo Mapa
        </Button>
        <Button type="button" onClick={onExportPNG} className="bg-[var(--ws-gold)] text-white hover:bg-[#b8943d]">
          <Download className="h-4 w-4" />
          PNG
        </Button>
      </div>
    </header>
  )
}
