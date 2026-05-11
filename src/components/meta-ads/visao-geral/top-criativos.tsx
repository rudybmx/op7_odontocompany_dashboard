'use client'

import { useState } from 'react'
import { ImageIcon, Video, Layers, Play, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { InfoTooltip } from '@/components/ui/info-tooltip'
import type { CriativoTop } from '@/types/meta-ads'
import { formatarNumero, formatarMoeda, formatarPorcentagem } from '@/lib/formatar'

interface TopCriativosProps {
  criativos: CriativoTop[]
}

const TIPO_CONFIG: Record<string, { bg: string; Icon: typeof ImageIcon; label: string }> = {
  IMAGE:    { bg: '#e6f1fb', Icon: ImageIcon, label: 'Imagem' },
  VIDEO:    { bg: '#eaf3de', Icon: Video,     label: 'Vídeo' },
  CAROUSEL: { bg: '#faeeda', Icon: Layers,    label: 'Carrossel' },
}

const TOTAL_SLOTS = 5
const TOP_CRIATIVOS_DIAGRAM = `
  <div style="font-size:10px;color:#666">
    <div style="background:#f0f0f0;border-radius:4px;padding:6px 8px;margin-bottom:4px">
      <div style="font-size:9px;color:#999;margin-bottom:2px">SCORE IA = </div>
      <div style="color:#333">CPL (40%) + CTR (25%) + Leads (20%) + Freq. (15%)</div>
    </div>
  </div>
`

interface CardMidiaProps {
  criativo: CriativoTop
  indice: number
}

function CardMidia({ criativo, indice }: CardMidiaProps) {
  const [carouselIdx, setCarouselIdx] = useState(0)
  const config = TIPO_CONFIG[criativo.tipo] ?? TIPO_CONFIG.IMAGE
  const IconComp = config.Icon

  const items = criativo.carouselItems ?? []
  const carouselLen = items.length

  const imgSrc =
    criativo.tipo === 'CAROUSEL' && carouselLen > 0
      ? items[carouselIdx]?.picture
      : criativo.imageUrlHq ?? criativo.thumbnailUrl

  const prevSlide = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCarouselIdx((i) => (i - 1 + carouselLen) % carouselLen)
  }

  const nextSlide = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCarouselIdx((i) => (i + 1) % carouselLen)
  }

  const inner = (
    <div
      style={{
        background: config.bg,
        aspectRatio: '9/16',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Imagem */}
      {imgSrc ? (
        <img
          src={imgSrc}
          alt={criativo.nome}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      ) : (
        <IconComp style={{ width: 32, height: 32, color: 'var(--ws-text-3, #8892b0)', opacity: 0.5 }} />
      )}

      {/* Overlay play para vídeo */}
      {criativo.tipo === 'VIDEO' && imgSrc && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.18)',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(255,255,255,0.88)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Play size={16} style={{ color: '#0E142A', marginLeft: 2 }} />
          </div>
        </div>
      )}

      {/* Controles carousel */}
      {criativo.tipo === 'CAROUSEL' && carouselLen > 1 && (
        <>
          <button
            onClick={prevSlide}
            style={{
              position: 'absolute', left: 4, top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%',
              width: 22, height: 22, cursor: 'pointer', zIndex: 3,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <ChevronLeft size={13} />
          </button>
          <button
            onClick={nextSlide}
            style={{
              position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%',
              width: 22, height: 22, cursor: 'pointer', zIndex: 3,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <ChevronRight size={13} />
          </button>

          {/* Dots */}
          <div style={{
            position: 'absolute', bottom: 28, left: 0, right: 0,
            display: 'flex', justifyContent: 'center', gap: 4, zIndex: 3,
          }}>
            {items.map((_, di) => (
              <div
                key={di}
                style={{
                  width: di === carouselIdx ? 12 : 5,
                  height: 5, borderRadius: 3,
                  background: di === carouselIdx ? '#fff' : 'rgba(255,255,255,0.55)',
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Badge rank */}
      <span style={{
        position: 'absolute', top: 8, left: 8,
        background: '#0E142A', color: '#fff',
        fontSize: 10, fontWeight: 700,
        padding: '2px 8px', borderRadius: 10, zIndex: 2,
      }}>
        #{indice + 1}
      </span>

      {/* Badge tipo */}
      <span style={{
        position: 'absolute', top: 8, right: 8,
        background: 'rgba(0,0,0,0.45)', color: '#fff',
        fontSize: 10, padding: '2px 8px', borderRadius: 4, zIndex: 2,
      }}>
        {config.label}
      </span>

      {/* Link externo */}
      {criativo.linkAnuncio && (
        <span style={{
          position: 'absolute', bottom: 8, right: 8,
          background: 'rgba(0,0,0,0.45)', borderRadius: 4,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 4, zIndex: 3,
        }}>
          <ExternalLink size={11} style={{ color: '#fff' }} />
        </span>
      )}
    </div>
  )

  return (
    <div
      className="group cursor-default"
      style={{
        border: '1px solid rgba(255,255,255,0.40)',
        borderRadius: 12,
        boxShadow: '0 4px 16px rgba(14,20,42,0.10)',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(14,20,42,0.15)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(14,20,42,0.10)'
      }}
    >
      {criativo.linkAnuncio ? (
        <a href={criativo.linkAnuncio} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textDecoration: 'none' }}>
          {inner}
        </a>
      ) : (
        inner
      )}

      {/* Footer */}
      <div style={{
        padding: '10px 12px',
        background: 'rgba(255,255,255,0.90)',
        borderTop: '1px solid rgba(14,20,42,0.06)',
      }}>
        <div style={{
          fontSize: 12, fontWeight: 500, color: '#0E142A',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {criativo.nome}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4, marginTop: 6 }}>
          <div>
            <div style={{ fontSize: 8, fontWeight: 600, color: '#8892b0', textTransform: 'uppercase' }}>Leads</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#0E142A' }}>{formatarNumero(criativo.leads)}</div>
          </div>
          <div>
            <div style={{ fontSize: 8, fontWeight: 600, color: '#8892b0', textTransform: 'uppercase' }}>CTR</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#0E142A' }}>{formatarPorcentagem(criativo.ctr)}</div>
          </div>
          <div>
            <div style={{ fontSize: 8, fontWeight: 600, color: '#8892b0', textTransform: 'uppercase' }}>CPL</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: criativo.cpl <= 5 ? '#0fa856' : '#FF5C8D' }}>
              {formatarMoeda(criativo.cpl)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function TopCriativos({ criativos }: TopCriativosProps) {
  const vagas = TOTAL_SLOTS - criativos.length

  return (
    <div style={{
      background: 'var(--ws-glass-bg, rgba(255,255,255,0.72))',
      border: '1px solid var(--ws-glass-border, rgba(255,255,255,0.35))',
      borderRadius: 14,
      padding: '16px 20px',
      backdropFilter: 'blur(16px)',
      boxShadow: 'var(--ws-glass-shadow, 0 8px 32px rgba(14,20,42,0.12), 0 2px 8px rgba(14,20,42,0.08))',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)', zIndex: 1 }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ws-text-1, #0E142A)' }}>Top criativos do período</div>
          <div style={{ fontSize: 11, color: 'var(--ws-text-3, #8892b0)', marginTop: 2 }}>Os 5 criativos com maior geração de leads</div>
        </div>
        <InfoTooltip
          title="Top criativos do período"
          description="Os 5 anúncios com melhor Score IA no período."
          diagram={TOP_CRIATIVOS_DIAGRAM}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, overflowX: 'auto', paddingBottom: 4 }}>
        {criativos.map((cr, indice) => (
          <CardMidia key={`${cr.id}-${indice}`} criativo={cr} indice={indice} />
        ))}
        {Array.from({ length: Math.max(0, vagas) }).map((_, i) => (
          <div
            key={`empty-${i}`}
            style={{
              border: '1px dashed var(--ws-glass-border, rgba(255,255,255,0.35))',
              borderRadius: 12,
              overflow: 'hidden',
              opacity: 0.5,
            }}
          >
            <div style={{
              aspectRatio: '9/16',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--ws-text-3, #8892b0)',
              fontSize: 11,
            }}>
              Sem dados
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
