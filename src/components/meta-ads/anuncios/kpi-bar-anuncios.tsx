'use client'

import type { Anuncio } from '@/types/meta-ads-anuncios'
import { formatarMoeda } from '@/lib/formatar'

interface Props {
  anuncios: Anuncio[]
}

export function KpiBarAnuncios({ anuncios }: Props) {
  if (anuncios.length === 0) return null

  const totalLeads     = anuncios.reduce((s, a) => s + a.leads, 0)
  const totalInvest    = anuncios.reduce((s, a) => s + (a.investimento ?? a.cpl * a.leads), 0)
  const cplMedio       = totalLeads > 0 ? totalInvest / totalLeads : 0
  const ctrMedio       = anuncios.reduce((s, a) => s + a.ctr, 0) / anuncios.length
  const freqMedia      = anuncios.reduce((s, a) => s + a.frequencia, 0) / anuncios.length
  const ativos         = anuncios.filter(a => a.status === 'ACTIVE').length
  const comFadiga      = anuncios.filter(a => a.frequencia >= 3.5).length

  const items = [
    {
      label: 'Investimento total',
      valor: formatarMoeda(totalInvest),
      sub: `${ativos} anúncios ativos`,
      cor: 'var(--ws-blue)',
      bg: 'var(--ws-blue-soft)',
    },
    {
      label: 'Leads gerados',
      valor: totalLeads.toLocaleString('pt-BR'),
      sub: `CPL médio ${formatarMoeda(cplMedio)}`,
      cor: '#0fa856',
      bg: 'rgba(15,168,86,0.08)',
    },
    {
      label: 'CTR médio',
      valor: `${ctrMedio.toFixed(1).replace('.', ',')}%`,
      sub: ctrMedio >= 3 ? 'Acima da média' : ctrMedio >= 1.5 ? 'Na média' : 'Abaixo da média',
      cor: ctrMedio >= 3 ? '#0fa856' : ctrMedio >= 1.5 ? '#EF9F27' : '#FF5C8D',
      bg: ctrMedio >= 3 ? 'rgba(15,168,86,0.08)' : ctrMedio >= 1.5 ? 'rgba(239,159,39,0.08)' : 'rgba(255,92,141,0.08)',
    },
    {
      label: 'Frequência média',
      valor: freqMedia.toFixed(1).replace('.', ','),
      sub: comFadiga > 0 ? `${comFadiga} anúncio${comFadiga > 1 ? 's' : ''} com fadiga` : 'Sem fadiga detectada',
      cor: freqMedia >= 3.5 ? '#FF5C8D' : freqMedia >= 2.5 ? '#EF9F27' : '#0fa856',
      bg: freqMedia >= 3.5 ? 'rgba(255,92,141,0.08)' : freqMedia >= 2.5 ? 'rgba(239,159,39,0.08)' : 'rgba(15,168,86,0.08)',
    },
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 12,
      marginBottom: 20,
    }}>
      {items.map(item => (
        <div key={item.label} style={{
          background: 'var(--ws-glass-bg)',
          border: '1px solid var(--ws-glass-border)',
          borderRadius: 'var(--ws-radius-lg)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: 'var(--ws-glass-shadow-sm)',
          padding: '14px 16px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 3,
            background: item.cor, opacity: 0.6,
          }} />
          <div style={{ fontSize: 10, color: 'var(--ws-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 6 }}>
            {item.label}
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: item.cor, letterSpacing: '-0.02em', lineHeight: 1 }}>
            {item.valor}
          </div>
          <div style={{
            fontSize: 10, color: item.cor, background: item.bg,
            borderRadius: 9999, padding: '3px 8px', marginTop: 8,
            display: 'inline-block', fontWeight: 500,
          }}>
            {item.sub}
          </div>
        </div>
      ))}
    </div>
  )
}
