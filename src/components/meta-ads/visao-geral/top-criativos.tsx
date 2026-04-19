'use client'

import { ImageIcon, Video, Layers } from 'lucide-react'
import { InfoTooltip } from '@/components/ui/info-tooltip'
import type { CriativoTop } from '@/types/meta-ads'
import { formatarNumero, formatarMoeda, formatarPorcentagem } from '@/lib/formatar'

interface TopCriativosProps {
  criativos: CriativoTop[]
}

const TIPO_CONFIG: Record<string, { bg: string; Icon: typeof ImageIcon; label: string }> = {
  IMAGE: { bg: '#e6f1fb', Icon: ImageIcon, label: 'Imagem' },
  VIDEO: { bg: '#eaf3de', Icon: Video, label: 'Vídeo' },
  CAROUSEL: { bg: '#faeeda', Icon: Layers, label: 'Carrossel' },
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

export function TopCriativos({ criativos }: TopCriativosProps) {
  const vagas = TOTAL_SLOTS - criativos.length

  return (
    <div
      style={{
        background: 'var(--ws-glass-bg, rgba(255,255,255,0.72))',
        border: '1px solid var(--ws-glass-border, rgba(255,255,255,0.35))',
        borderRadius: '14px',
        padding: '16px 20px',
        backdropFilter: 'blur(16px)',
        boxShadow: 'var(--ws-glass-shadow, 0 8px 32px rgba(14,20,42,0.12), 0 2px 8px rgba(14,20,42,0.08))',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glow line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)', zIndex: 1 }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ws-text-1, #0E142A)' }}>Top criativos do período</div>
          <div style={{ fontSize: 11, color: 'var(--ws-text-3, #8892b0)', marginTop: '2px' }}>Os 5 criativos com maior geração de leads</div>
        </div>
        <InfoTooltip
          title="Top criativos do período"
          description="Os 5 anúncios com melhor Score IA no período."
          diagram={TOP_CRIATIVOS_DIAGRAM}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
        {criativos.map((cr, indice) => {
          const config = TIPO_CONFIG[cr.tipo]
          const IconComp = config?.Icon || ImageIcon
          return (
            <div
              key={`${cr.id}-${indice}`}
              className="group cursor-default"
              style={{
                background: 'var(--bg)',
                border: '1px solid rgba(255,255,255,0.40)',
                borderRadius: '12px',
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
              <div
                style={{
                  aspectRatio: '9/16',
                  background: config?.bg || '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {cr.thumbnailUrl ? (
                  <img
                    src={cr.thumbnailUrl}
                    alt={cr.nome}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <IconComp className="h-8 w-8" style={{ color: 'var(--ws-text-3, #8892b0)', opacity: 0.5 }} />
                )}
                
                {/* Badge Rank */}
                <span
                  style={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    background: '#0E142A',
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '10px',
                    zIndex: 2,
                  }}
                >
                  #{indice + 1}
                </span>

                {/* Badge Tipo */}
                <span
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    background: 'rgba(0,0,0,0.45)',
                    color: '#fff',
                    fontSize: '10px',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    zIndex: 2,
                  }}
                >
                  {config?.label || cr.tipo}
                </span>
              </div>

              {/* Footer */}
              <div 
                style={{ 
                  padding: '10px 12px', 
                  background: 'rgba(255,255,255,0.90)',
                  borderTop: '1px solid rgba(14,20,42,0.06)'
                }}
              >
                <div 
                  style={{ 
                    fontSize: '12px', 
                    fontWeight: 500, 
                    color: '#0E142A',
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap' 
                  }}
                >
                  {cr.nome}
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', marginTop: '6px' }}>
                  <div>
                    <div style={{ fontSize: '8px', fontWeight: 600, color: '#8892b0', textTransform: 'uppercase' }}>Leads</div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#0E142A' }}>{formatarNumero(cr.leads)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '8px', fontWeight: 600, color: '#8892b0', textTransform: 'uppercase' }}>CTR</div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#0E142A' }}>{formatarPorcentagem(cr.ctr)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '8px', fontWeight: 600, color: '#8892b0', textTransform: 'uppercase' }}>CPL</div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: cr.cpl <= 5 ? '#0fa856' : '#FF5C8D' }}>
                      {formatarMoeda(cr.cpl)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        {Array.from({ length: Math.max(0, vagas) }).map((_, i) => (
          <div
            key={`empty-${i}`}
            style={{
              border: '1px dashed var(--ws-glass-border, rgba(255,255,255,0.35))',
              borderRadius: '12px',
              overflow: 'hidden',
              opacity: 0.5,
            }}
          >
            <div
              style={{
                aspectRatio: '9/16',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--ws-text-3, #8892b0)',
                fontSize: '11px',
              }}
            >
              Sem dados
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

