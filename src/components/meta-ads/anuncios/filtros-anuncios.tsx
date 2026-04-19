'use client'

import { FiltrosAnuncios } from '@/types/meta-ads-anuncios'
import { campanhasDisponiveis } from '@/hooks/use-meta-anuncios'

interface Props {
  filtros: FiltrosAnuncios
  onChange: (f: FiltrosAnuncios) => void
}

export function FiltrosAnunciosComp({ filtros, onChange }: Props) {
  const set = (patch: Partial<FiltrosAnuncios>) => onChange({ ...filtros, ...patch })

  const glassSelectStyle: React.CSSProperties = {
    height: '30px',
    fontSize: '12px',
    background: 'rgba(255, 255, 255, 0.72)',
    border: '1px solid rgba(255, 255, 255, 0.40)',
    borderRadius: '8px',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 2px 8px rgba(14, 20, 42, 0.08)',
    padding: '0 8px',
    color: '#0E142A',
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.2s ease',
  }

  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px', alignItems: 'center' }}>
      <select
        style={glassSelectStyle}
        value={filtros.campanha}
        onChange={e => set({ campanha: e.target.value })}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.90)'
          e.currentTarget.style.borderColor = 'rgba(62, 91, 255, 0.25)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.72)'
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.40)'
        }}
      >
        <option value="todas">Todas as campanhas</option>
        {campanhasDisponiveis.map(c => (
          <option key={c} value={c}>{c.length > 40 ? c.slice(0, 40) + '...' : c}</option>
        ))}
      </select>

      <select
        style={glassSelectStyle}
        value={filtros.status}
        onChange={e => set({ status: e.target.value })}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.90)'
          e.currentTarget.style.borderColor = 'rgba(62, 91, 255, 0.25)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.72)'
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.40)'
        }}
      >
        <option value="todos">Todos os status</option>
        <option value="ACTIVE">Ativa</option>
        <option value="PAUSED">Pausada</option>
        <option value="LEARNING">Aprendendo</option>
      </select>

      <select
        style={glassSelectStyle}
        value={filtros.tipo}
        onChange={e => set({ tipo: e.target.value })}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.90)'
          e.currentTarget.style.borderColor = 'rgba(62, 91, 255, 0.25)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.72)'
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.40)'
        }}
      >
        <option value="todos">Todos os tipos</option>
        <option value="IMAGE">Imagem</option>
        <option value="VIDEO">Vídeo</option>
        <option value="CAROUSEL">Carrossel</option>
      </select>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '11px', color: '#8892b0' }}>Ordenar por</span>
        <select
          style={glassSelectStyle}
          value={filtros.ordenarPor}
          onChange={e => set({ ordenarPor: e.target.value as FiltrosAnuncios['ordenarPor'] })}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.90)'
            e.currentTarget.style.borderColor = 'rgba(62, 91, 255, 0.25)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.72)'
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.40)'
          }}
        >
          <option value="score">Score IA</option>
          <option value="leads">Leads</option>
          <option value="cpl">CPL</option>
          <option value="ctr">CTR</option>
          <option value="frequencia">Frequência</option>
        </select>
      </div>
    </div>
  )
}
