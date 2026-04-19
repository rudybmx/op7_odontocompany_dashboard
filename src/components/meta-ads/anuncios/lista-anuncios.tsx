'use client'

import { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { Anuncio, TipoAnuncio, StatusAnuncio } from '@/types/meta-ads-anuncios'
import { formatarMoeda, formatarNumeroCompacto } from '@/lib/formatar'

interface Props {
  anuncios: Anuncio[]
  onAbrirAnuncio: (id: string) => void
}

type ColOrdenavel = 'score' | 'leads' | 'cpl' | 'ctr' | 'cpc' | 'frequencia' | 'cpm' | 'impressoes'

const LABEL_STATUS: Record<StatusAnuncio, { texto: string; cor: string }> = {
  ACTIVE: { texto: 'Ativa', cor: '#3b6d11' },
  PAUSED: { texto: 'Pausada', cor: 'var(--text2)' },
  LEARNING: { texto: 'Aprendendo', cor: '#854f0b' },
  ARCHIVED: { texto: 'Arquivada', cor: 'var(--text2)' },
}

const LABEL_TIPO: Record<TipoAnuncio, string> = {
  IMAGE: 'Imagem',
  VIDEO: 'Vídeo',
  CAROUSEL: 'Carrossel',
}

function chipScore(score: number) {
  const cor = score >= 75 ? '#3b6d11' : score >= 40 ? 'var(--ws-gold)' : '#a32d2d'
  const bg = score >= 75 ? 'rgba(59,109,17,0.10)' : score >= 40 ? 'rgba(201,168,76,0.12)' : 'rgba(163,45,45,0.10)'
  return (
    <span style={{ background: bg, color: cor, borderRadius: '3px', padding: '2px 6px', fontSize: '11px', fontWeight: 600 }}>
      {score}
    </span>
  )
}

export function ListaAnuncios({ anuncios, onAbrirAnuncio }: Props) {
  const [sortCol, setSortCol] = useState<ColOrdenavel>('score')
  const [sortAsc, setSortAsc] = useState(false)

  const sorted = [...anuncios].sort((a, b) => {
    const mult = sortAsc ? 1 : -1
    return (a[sortCol] - b[sortCol]) * mult
  })

  function toggleSort(col: ColOrdenavel) {
    if (sortCol === col) setSortAsc(v => !v)
    else { setSortCol(col); setSortAsc(false) }
  }

  function Th({ col, label }: { col: ColOrdenavel; label: string }) {
    const ativo = sortCol === col
    return (
      <th
        onClick={() => toggleSort(col)}
        style={{
          padding: '8px 10px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em',
          color: ativo ? '#0f2744' : 'var(--text2)', fontWeight: ativo ? 600 : 400,
          cursor: 'pointer', whiteSpace: 'nowrap', userSelect: 'none',
          background: 'rgba(15,39,68,0.04)',
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
          {label}
          {ativo
            ? (sortAsc ? <ChevronUp size={10} /> : <ChevronDown size={10} />)
            : <ChevronDown size={10} style={{ opacity: 0.3 }} />}
        </span>
      </th>
    )
  }

  const thBase: React.CSSProperties = {
    padding: '8px 10px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.06em',
    color: 'var(--text2)', fontWeight: 400, background: 'rgba(15,39,68,0.04)',
    whiteSpace: 'nowrap',
  }

  return (
    <div style={{ 
      overflowX: 'auto', 
      background: 'rgba(255, 255, 255, 0.72)',
      border: '1px solid rgba(255, 255, 255, 0.40)',
      borderRadius: '12px',
      backdropFilter: 'blur(16px)',
      boxShadow: '0 4px 16px rgba(14, 20, 42, 0.08)'
    }}>
      <table style={{ width: '100%', minWidth: '860px', borderCollapse: 'collapse', fontSize: '12px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(14, 20, 42, 0.08)' }}>
            <th style={{ ...thBase, textAlign: 'left', paddingLeft: '16px', background: 'rgba(14, 20, 42, 0.02)' }}>Anúncio</th>
            <Th col="score" label="Score IA" />
            <th style={{ ...thBase, background: 'rgba(14, 20, 42, 0.02)' }}>Status</th>
            <Th col="leads" label="Leads" />
            <Th col="cpl" label="CPL" />
            <Th col="ctr" label="CTR" />
            <Th col="cpc" label="CPC" />
            <Th col="frequencia" label="Freq." />
            <Th col="cpm" label="CPM" />
            <Th col="impressoes" label="Impressões" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((a, idx) => {
            const st = LABEL_STATUS[a.status]
            return (
              <tr
                key={`${a.id}-${idx}`}
                onClick={() => onAbrirAnuncio(a.id)}
                style={{
                  borderBottom: '1px solid rgba(14, 20, 42, 0.04)',
                  opacity: a.status === 'PAUSED' ? 0.7 : 1,
                  cursor: 'pointer',
                  transition: 'background 150ms ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(62, 91, 255, 0.03)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {/* Nome */}
                <td style={{ padding: '10px 10px 10px 16px', maxWidth: '260px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: 28, height: 36, borderRadius: '4px', flexShrink: 0,
                      background: a.corFundo, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '8px', color: 'rgba(0,0,0,0.25)',
                      overflow: 'hidden'
                    }}>
                      {a.thumbnailUrl ? <img src={a.thumbnailUrl} alt="Thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : LABEL_TIPO[a.tipo][0]}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '11px', fontWeight: 500, color: '#0E142A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {a.nome}
                      </div>
                      <div style={{ fontSize: '10px', color: '#8892b0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {a.campanhaNome}
                      </div>
                    </div>
                  </div>
                </td>

                <td style={{ padding: '10px', textAlign: 'center' }}>{chipScore(a.score)}</td>

                <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>
                  <span style={{ fontSize: '11px', color: st.cor }}>{st.texto}</span>
                </td>

                <td style={{ padding: '10px', textAlign: 'right', color: 'var(--ws-gold)', fontWeight: 500 }}>
                  {a.leads.toLocaleString('pt-BR')}
                </td>

                <td style={{ padding: '10px', textAlign: 'right', color: a.cpl <= 1 ? '#0fa856' : a.cpl > 5 ? '#FF5C8D' : '#0E142A' }}>
                  {formatarMoeda(a.cpl)}
                </td>

                <td style={{ padding: '10px', textAlign: 'right' }}>{a.ctr.toFixed(1)}%</td>
                <td style={{ padding: '10px', textAlign: 'right' }}>{formatarMoeda(a.cpc)}</td>

                <td style={{ padding: '10px', textAlign: 'right', color: a.frequencia >= 3.5 ? '#FF5C8D' : '#0E142A' }}>
                  {a.frequencia.toFixed(1)}
                </td>

                <td style={{ padding: '10px', textAlign: 'right' }}>{formatarMoeda(a.cpm)}</td>
                <td style={{ padding: '10px', textAlign: 'right' }}>{formatarNumeroCompacto(a.impressoes)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
