"use client"

import { X } from "lucide-react"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useLayout } from "@/lib/contexto-layout"

export function PainelChat() {
  const { chatAberto, setChatAberto } = useLayout()

  return (
    <Sheet open={chatAberto} onOpenChange={setChatAberto}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-[min(360px,90vw)] max-w-none gap-0 border-[var(--border)] bg-[var(--bg)] p-0 text-[var(--text)]"
      >
        <SheetHeader className="flex h-10 flex-row items-center justify-between border-b border-[var(--border)] px-3 py-0">
          <div>
            <SheetTitle className="text-[13px] font-medium text-[var(--text)]">
              Assistente
            </SheetTitle>
            <SheetDescription className="sr-only">
              Painel lateral do assistente
            </SheetDescription>
          </div>
          <button
            type="button"
            aria-label="Fechar assistente"
            className="flex h-6 w-6 items-center justify-center rounded-[3px] text-[var(--text2)] transition-colors hover:bg-[var(--bg2)] hover:text-[var(--text)]"
            onClick={() => setChatAberto(false)}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </SheetHeader>
        <div className="flex flex-1 items-center justify-center px-6 text-center text-[12px] text-[var(--text2)]">
          O agente estará disponível em breve.
        </div>
      </SheetContent>
    </Sheet>
  )
}
