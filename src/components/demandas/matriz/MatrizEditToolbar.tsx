'use client'

import { Pencil, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MatrizEditToolbarProps {
  changesCount: number
  onCancel: () => void
  onSave: () => void
  isSaving?: boolean
}

export default function MatrizEditToolbar({
  changesCount,
  onCancel,
  onSave,
  isSaving = false,
}: MatrizEditToolbarProps) {
  return (
    <div
      className="fixed right-0 bottom-0 left-[88px] z-50 flex h-14 items-center justify-between px-6"
      style={{
        background: 'var(--ws-glass-bg)',
        borderTop: '1px solid var(--ws-glass-border)',
        backdropFilter: 'blur(20px)',
        boxShadow: 'var(--ws-glass-shadow-lg)',
      }}
    >
      <div className="flex items-center gap-4">
        <div className="inline-flex items-center gap-2 text-[13px] font-medium text-foreground">
          <Pencil className="h-4 w-4" />
          Modo Edição
        </div>
        <div className={`text-[12px] ${changesCount > 0 ? 'font-medium text-[#92722a]' : 'text-muted-foreground'}`}>
          {changesCount > 0 ? `${changesCount} células alteradas` : 'Nenhuma alteração'}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" onClick={onCancel} className="text-foreground hover:bg-muted/30" style={{ border: '1px solid var(--ws-glass-border-strong)' }}>
          Cancelar
        </Button>
        <Button
          type="button"
          onClick={onSave}
          disabled={changesCount === 0 || isSaving}
          className="border-[var(--ws-gold)] bg-[var(--ws-gold)] text-white hover:bg-[#b8943d]"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </div>
  )
}
