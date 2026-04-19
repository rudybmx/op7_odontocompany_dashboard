'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface MapaNodeEditorProps {
  label: string
  color?: string
  onConfirm: (payload: { label: string; color?: string }) => void
  children: React.ReactNode
}

const SWATCHES = ['#0f2744', 'var(--ws-gold)', '#4f6bed', '#3b6d11', '#7c4dbd', '#bf5a2f']

export default function MapaNodeEditor({ label, color, onConfirm, children }: MapaNodeEditorProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(label)
  const [selectedColor, setSelectedColor] = useState<string | undefined>(color)

  useEffect(() => {
    if (open) {
      setValue(label)
      setSelectedColor(color)
    }
  }, [color, label, open])

  function handleConfirm() {
    onConfirm({ label: value.trim() || label, color: selectedColor })
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-72 border-border/10 bg-card p-4">
        <div className="mb-3 text-[13px] font-medium text-foreground">Editar nó</div>
        <Input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          autoFocus
          onKeyDown={(event) => {
            if (event.key === 'Enter') handleConfirm()
            if (event.key === 'Escape') setOpen(false)
          }}
          className="border-border/10 bg-card text-foreground"
        />
        <div className="mt-3 text-[11px] text-muted-foreground">Cor personalizada:</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {SWATCHES.map((swatch) => (
            <button
              key={swatch}
              type="button"
              onClick={() => setSelectedColor(swatch)}
              className="h-6 w-6 rounded-full border border-border/10"
              style={{ backgroundColor: swatch }}
            />
          ))}
          <button
            type="button"
            onClick={() => setSelectedColor(undefined)}
            className="rounded-full border border-border/10 px-2 py-1 text-[11px] text-muted-foreground"
          >
            Auto
          </button>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-border/10 text-foreground hover:bg-muted/30">
            Cancelar
          </Button>
          <Button type="button" onClick={handleConfirm} className="bg-[var(--ws-gold)] text-white hover:bg-[#b8943d]">
            OK
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
