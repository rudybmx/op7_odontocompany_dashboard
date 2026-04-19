'use client'

import { useState } from 'react'
import type { GrupoAnunciosDetalhe } from '@/types/google-ads'
import { LinhaGrupoDetalhe } from './linha-grupo-detalhe'

interface Props {
  grupos: GrupoAnunciosDetalhe[]
  onAbrirModal: (id: string) => void
}

type SortCol = 'investimento' | 'cliques' | 'conversoes' | 'ctr' | 'roas' | 'qualityScore' | 'custoConversao'

const thStyle: React.CSSProperties = {
  padding: '8px 10px',
  fontSize: 10,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: 'var(--ws-text-3)',
  fontWeight: 500,
  whiteSpace: 'nowrap',
}

const thRight: React.CSSProperties = { ...thStyle, textAlign: 'right', cursor: 'pointer' }

export function TabelaGrupos({ grupos, onAbrirModal }: Props) {
  const [sortCol, setSortCol] = useState<SortCol>('investimento')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  function handleSort(col: SortCol) {
    if (col === sortCol) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('desc') }
  }

  const sorted = [...grupos].sort((a, b) => {
    const m = sortDir === 'asc' ? 1 : -1
    switch (sortCol) {
      case 'cliques':        return (b.cliques - a.cliques) * m
      case 'conversoes':     return (b.conversoes - a.conversoes) * m
      case 'ctr':            return (b.ctr - a.ctr) * m
      case 'roas':           return (b.roas - a.roas) * m
      case 'qualityScore':   return (b.qualityScoreMedio - a.qualityScoreMedio) * m
      case 'custoConversao': return (a.custoConversao - b.custoConversao) * m
      default:               return (b.investimento - a.investimento) * m
    }
  })

  function ind(col: SortCol) {
    return sortCol === col ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''
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
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)', zIndex: 1 }} />
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 1100 }}>
        <thead>
          <tr style={{ background: 'rgba(62,91,255,0.04)', borderBottom: '1px solid var(--ws-divider)' }}>
            <th style={{ ...thStyle, textAlign: 'left', minWidth: 260 }}>Grupo</th>
            <th style={{ ...thStyle, textAlign: 'left' }}>Estratégia</th>
            <th style={{ ...thStyle, textAlign: 'left' }}>Status</th>
            <th style={thRight} onClick={() => handleSort('investimento')}>Invest.{ind('investimento')}</th>
            <th style={thRight} onClick={() => handleSort('cliques')}>Cliques{ind('cliques')}</th>
            <th style={{ ...thRight, cursor: 'default' }}>Impressões</th>
            <th style={thRight} onClick={() => handleSort('conversoes')}>Conv.{ind('conversoes')}</th>
            <th style={thRight} onClick={() => handleSort('ctr')}>CTR{ind('ctr')}</th>
            <th style={{ ...thRight, cursor: 'default' }}>CPC</th>
            <th style={thRight} onClick={() => handleSort('roas')}>ROAS{ind('roas')}</th>
            <th style={{ ...thRight, cursor: 'default' }}>Taxa Conv.</th>
            <th style={thRight} onClick={() => handleSort('custoConversao')}>Custo/Conv.{ind('custoConversao')}</th>
            <th style={thRight} onClick={() => handleSort('qualityScore')}>QS{ind('qualityScore')}</th>
            <th style={{ ...thRight, cursor: 'default' }}>IS</th>
            <th style={{ ...thRight, cursor: 'default' }}>Keywords</th>
            <th style={{ ...thRight, cursor: 'default' }}>Anúncios</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(grupo => (
            <LinhaGrupoDetalhe
              key={grupo.id}
              grupo={grupo}
              onAbrirModal={onAbrirModal}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
