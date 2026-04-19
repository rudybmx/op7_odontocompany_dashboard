'use client'

import { useState } from 'react'
import { Layers } from 'lucide-react'
import type { FiltrosAnuncios } from '@/types/meta-ads-anuncios'
import { FiltrosAnunciosComp } from './filtros-anuncios'
import { InsightsIA } from './insights-ia'
import { KpiBarAnuncios } from './kpi-bar-anuncios'
import { TabelaHierarquica } from './tabela-hierarquica'
import { ModalAnuncio } from './modal-anuncio'
import { useMetaAnuncios } from '@/hooks/use-meta-anuncios'
import { useInsightsIA } from '@/hooks/use-insights-ia'

interface Props { dataInicio: string; dataFim: string }

export function AbaAnuncios({ dataInicio, dataFim }: Props) {
  const [filtros, setFiltros] = useState<FiltrosAnuncios>({
    campanha: 'todas',
    status: 'todos',
    tipo: 'todos',
    ordenarPor: 'score',
  })

  const [agrupar, setAgrupar] = useState(true)
  const [anuncioAbertoId, setAnuncioAbertoId] = useState<string | null>(null)

  const { anuncios } = useMetaAnuncios(filtros, dataInicio, dataFim)
  const { insights } = useInsightsIA()

  const anuncioAberto = anuncios.find(a => a.id === anuncioAbertoId) ?? null
  const insightDoAnuncio = insights.find(i => i.anuncioId === anuncioAbertoId) ?? null

  return (
    <div>
      <KpiBarAnuncios anuncios={anuncios} />

      <InsightsIA 
        insights={insights} 
        onAbrirAnuncio={setAnuncioAbertoId} 
      />

      <FiltrosAnunciosComp filtros={filtros} onChange={setFiltros} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        {/* Toggle agrupar por conjunto */}
        <button
          onClick={() => setAgrupar(v => !v)}
          title={agrupar ? 'Mostrar somente anúncios' : 'Agrupar por conjunto'}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '5px 12px',
            background: agrupar ? 'rgba(62,91,255,0.08)' : 'var(--ws-glass-bg)',
            border: `1px solid ${agrupar ? 'rgba(62,91,255,0.25)' : 'var(--ws-glass-border)'}`,
            backdropFilter: 'blur(10px)',
            borderRadius: 'var(--ws-radius-md)',
            cursor: 'pointer', fontSize: 11, fontWeight: 500,
            color: agrupar ? '#3E5BFF' : 'var(--ws-text-3)',
            transition: 'all 150ms',
          }}
          onMouseEnter={e => {
            if (!agrupar) {
              e.currentTarget.style.background = 'rgba(62,91,255,0.06)'
              e.currentTarget.style.color = '#3E5BFF'
            }
          }}
          onMouseLeave={e => {
            if (!agrupar) {
              e.currentTarget.style.background = 'var(--ws-glass-bg)'
              e.currentTarget.style.color = 'var(--ws-text-3)'
            }
          }}
        >
          <Layers size={13} />
          {agrupar ? 'Agrupado por conjunto' : 'Todos os anúncios'}
          {/* Ícone de check quando ativo */}
          {agrupar && (
            <span style={{
              width: 14, height: 14, borderRadius: '50%',
              background: '#3E5BFF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="8" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          )}
        </button>
      </div>

      <TabelaHierarquica 
        anuncios={anuncios} 
        agrupar={agrupar}
        onAbrirAnuncio={setAnuncioAbertoId} 
      />

      <ModalAnuncio
        anuncio={anuncioAberto}
        insight={insightDoAnuncio}
        aberto={!!anuncioAbertoId}
        onFechar={() => setAnuncioAbertoId(null)}
      />
    </div>
  )
}
