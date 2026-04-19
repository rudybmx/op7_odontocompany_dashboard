'use client'

import { useState, Fragment } from 'react'
import type { CampanhaGoogle, GrupoAnuncios } from '@/types/google-ads'
import { LinhaCampanha } from './linha-campanha'
import { LinhaGrupo } from './linha-grupo'

interface Props {
  campanhas: CampanhaGoogle[]
  grupos: (campanhaId: string) => GrupoAnuncios[]
}

const thStyle: React.CSSProperties = {
  padding: '8px 10px',
  fontSize: 10,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: 'var(--ws-text-3)',
  fontWeight: 500,
  whiteSpace: 'nowrap',
}

const thRight: React.CSSProperties = {
  ...thStyle,
  textAlign: 'right',
  cursor: 'pointer',
}

type SortCol = 'investimento' | 'cliques' | 'conversoes' | 'ctr' | 'roas' | 'qualityScore'

export function TabelaCampanhas({ campanhas, grupos }: Props) {
  const [expandidos, setExpandidos] = useState<Set<string>>(new Set())
  const [sortCol, setSortCol] = useState<SortCol>('investimento')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  function toggleExpand(id: string) {
    setExpandidos(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleSort(col: SortCol) {
    if (col === sortCol) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('desc') }
  }

  const sorted = [...campanhas].sort((a, b) => {
    const mult = sortDir === 'asc' ? 1 : -1
    switch (sortCol) {
      case 'cliques':     return (b.cliques - a.cliques) * mult
      case 'conversoes':  return (b.conversoes - a.conversoes) * mult
      case 'ctr':         return (b.ctr - a.ctr) * mult
      case 'roas':        return (b.roas - a.roas) * mult
      case 'qualityScore': return (b.qualityScoreMedio - a.qualityScoreMedio) * mult
      default:            return (b.investimento - a.investimento) * mult
    }
  })

  function sortInd(col: SortCol) {
    if (sortCol !== col) return ''
    return sortDir === 'asc' ? ' ↑' : ' ↓'
  }

  return (
    <div style={{
      background: 'var(--ws-glass-bg)',
      border: '1px solid var(--ws-glass-border)',
      borderRadius: 'var(--ws-radius-lg)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      boxShadow: 'var(--ws-glass-shadow)',
      overflow: 'hidden',
      overflowX: 'auto',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
        zIndex: 1,
      }} />
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 900 }}>
        <thead>
          <tr style={{ background: 'rgba(62,91,255,0.04)', borderBottom: '1px solid var(--ws-divider)' }}>
            <th style={{ width: 32 }} />
            <th style={{ ...thStyle, textAlign: 'left', minWidth: 280, cursor: 'pointer' }}>
              Campanha
            </th>
            <th style={{ ...thStyle, textAlign: 'left' }}>Status</th>
            <th style={thRight} onClick={() => handleSort('investimento')}>
              Investimento{sortInd('investimento')}
            </th>
            <th style={thRight} onClick={() => handleSort('cliques')}>
              Cliques{sortInd('cliques')}
            </th>
            <th style={{ ...thRight, cursor: 'default' }}>Impressões</th>
            <th style={thRight} onClick={() => handleSort('conversoes')}>
              Conv.{sortInd('conversoes')}
            </th>
            <th style={thRight} onClick={() => handleSort('ctr')}>
              CTR{sortInd('ctr')}
            </th>
            <th style={{ ...thRight, cursor: 'default' }}>CPC</th>
            <th style={thRight} onClick={() => handleSort('roas')}>
              ROAS{sortInd('roas')}
            </th>
            <th style={{ ...thRight, cursor: 'default' }}>Taxa Conv.</th>
            <th style={{ ...thRight, cursor: 'default' }}>Custo/Conv.</th>
            <th style={thRight} onClick={() => handleSort('qualityScore')}>
              QS{sortInd('qualityScore')}
            </th>
            <th style={{ ...thRight, cursor: 'default' }}>IS</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(campanha => (
            <Fragment key={campanha.id}>
              <LinhaCampanha
                campanha={campanha}
                grupos={grupos(campanha.id)}
                expandido={expandidos.has(campanha.id)}
                onToggle={() => toggleExpand(campanha.id)}
              />
              {expandidos.has(campanha.id) && grupos(campanha.id).map(grupo => (
                <LinhaGrupo key={grupo.id} grupo={grupo} tipo={campanha.tipo} />
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}
