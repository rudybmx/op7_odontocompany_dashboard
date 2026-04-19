'use client'
import { Dialog } from 'radix-ui'
import { X, Image, Video, LayoutGrid } from 'lucide-react'
import { Criativo, Anuncio, TipoCriativo } from '@/types/meta-ads-campanhas'

interface Props {
  criativo: Criativo | null
  anuncio: Anuncio | null
  aberto: boolean
  onFechar: () => void
}

const tipoLabel: Record<TipoCriativo, string> = {
  IMAGE: 'Imagem',
  VIDEO: 'Vídeo',
  CAROUSEL: 'Carrossel',
}

const TipoIcon = ({ tipo }: { tipo: TipoCriativo }) => {
  const size = 28
  if (tipo === 'VIDEO') return <Video size={size} strokeWidth={1.5} />
  if (tipo === 'CAROUSEL') return <LayoutGrid size={size} strokeWidth={1.5} />
  return <Image size={size} strokeWidth={1.5} />
}

export function ModalCriativo({ criativo, anuncio, aberto, onFechar }: Props) {
  if (!criativo || !anuncio) return null

  const fmtBRL = (n: number) => n.toLocaleString('pt-BR', { minimumFractionDigits: 2 })

  return (
    <Dialog.Root open={aberto} onOpenChange={open => !open && onFechar()}>
      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.45)',
            zIndex: 50,
          }}
        />
        <Dialog.Content
          style={{
            position: 'fixed',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 320, maxWidth: '90vw',
            background: 'var(--background)',
            borderRadius: 10,
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            zIndex: 51,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 14px',
            borderBottom: '0.5px solid var(--border)',
          }}>
            <Dialog.Title
              style={{
                fontSize: 12, fontWeight: 500,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                maxWidth: 240,
              }}
              title={anuncio.nome}
            >
              {anuncio.nome}
            </Dialog.Title>
            <Dialog.Close
              onClick={onFechar}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 24, height: 24, borderRadius: 4, border: 'none',
                background: 'transparent', cursor: 'pointer',
                color: 'var(--muted-foreground)',
              }}
            >
              <X size={14} />
            </Dialog.Close>
          </div>

          {/* Thumbnail */}
          <div style={{
            aspectRatio: '9/16',
            maxHeight: 380,
            background: criativo.corFundo,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}>
            {criativo.thumbnailUrl ? (
              <img
                src={criativo.thumbnailUrl}
                alt={anuncio.nome}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ color: 'rgba(0,0,0,0.3)' }}>
                <TipoIcon tipo={criativo.tipo} />
              </div>
            )}
          </div>

          {/* Body */}
          <div style={{ padding: '12px 16px' }}>
            {/* Creative type badge */}
            <div style={{
              display: 'inline-block',
              padding: '2px 8px', borderRadius: 10,
              fontSize: 10, fontWeight: 500,
              background: 'var(--muted)', color: 'var(--muted-foreground)',
              marginBottom: 12,
            }}>
              {tipoLabel[criativo.tipo]}
            </div>

            {/* KPI grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {[
                { label: 'Leads', value: String(anuncio.leads) },
                { label: 'CTR', value: `${anuncio.ctr.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}%` },
                { label: 'CPL', value: `R$ ${fmtBRL(anuncio.cpl)}` },
              ].map(kpi => (
                <div key={kpi.label} style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em',
                    color: 'var(--muted-foreground)', marginBottom: 2,
                  }}>
                    {kpi.label}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{kpi.value}</div>
                </div>
              ))}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
