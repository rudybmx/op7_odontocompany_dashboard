'use client'
import { X, ChevronRight } from 'lucide-react'
import { RecorrenciaLead } from '@/types/followup'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Sheet, SheetContent } from '@/components/ui/sheet'

interface RecorrenciaPainelLeadProps {
  lead: RecorrenciaLead
  aberto: boolean
  onFechar: () => void
  onCancelar: (id: string) => void
}

export function RecorrenciaPainelLead({ lead, aberto, onFechar, onCancelar }: RecorrenciaPainelLeadProps) {
  return (
    <Sheet open={aberto} onOpenChange={(open) => !open && onFechar()}>
      <SheetContent
        side="right"
        style={{
          width: 480,
          background: 'var(--ws-glass-bg)',
          backdropFilter: 'blur(24px)',
          borderLeft: '1px solid var(--ws-glass-border)',
          padding: 0,
        }}
        className="overflow-y-auto flex flex-col"
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--ws-divider)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ws-text-1)' }}>
              {lead.nome || lead.telefone}
            </h2>
            <p style={{ fontSize: 12, color: 'var(--ws-text-3)', marginTop: 2 }}>
              {lead.telefone} · {lead.interesse || 'Sem serviço'}
            </p>
          </div>
          <button onClick={onFechar} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--ws-text-3)', padding: 4, borderRadius: 6,
          }}>
            <X size={18} />
          </button>
        </div>

        {/* Conteúdo */}
        <div style={{ padding: '24px', flex: 1 }}>
          {/* Dados da recorrência */}
          <div style={{
            background: 'rgba(14,20,42,0.03)',
            border: '1px solid var(--ws-divider)',
            borderRadius: 'var(--ws-radius-md)',
            padding: '14px 16px',
            marginBottom: 16,
          }}>
            <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ws-text-3)', marginBottom: 12 }}>
              DADOS DA RECORRÊNCIA
            </p>
            {[
              { label: 'Serviço', valor: lead.interesse || '—' },
              { label: 'Agenda', valor: lead.agenda_nome || '—' },
              { label: 'Compareceu em', valor: lead.data_comparecimento ? format(parseISO(lead.data_comparecimento), 'dd/MM/yyyy', { locale: ptBR }) : '—' },
              { label: 'Início programado', valor: lead.data_trigger_programada ? format(parseISO(lead.data_trigger_programada), 'dd/MM/yyyy', { locale: ptBR }) : '—' },
              { label: 'Status', valor: lead.status },
              { label: 'Tentativa atual', valor: `${lead.tentativa_atual}` },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: 'var(--ws-text-3)' }}>{item.label}</span>
                <span style={{ fontSize: 12, color: 'var(--ws-text-1)', fontWeight: 500 }}>{item.valor}</span>
              </div>
            ))}
          </div>

          {/* Ação de cancelar */}
          {lead.status !== 'cancelado' && lead.status !== 'concluido' && (
            <button
              onClick={() => { onCancelar(lead.id); onFechar() }}
              style={{
                width: '100%', padding: '10px',
                background: 'rgba(255,92,141,0.08)',
                border: '1px solid rgba(255,92,141,0.25)',
                borderRadius: 'var(--ws-radius-md)',
                color: 'var(--ws-coral)',
                fontSize: 13, fontWeight: 500, cursor: 'pointer',
              }}
            >
              Cancelar Recorrência
            </button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
