'use client'

import { useState } from 'react'
import { FiltrosCriativos as FiltrosCriativosType } from '@/types/meta-ads-criativos'
import { useMetaCriativos } from '@/hooks/use-meta-criativos'
import { useInsightsCriativos } from '@/hooks/use-insights-criativos'
import { ImageIcon } from 'lucide-react'
import { FiltrosCriativos } from './filtros-criativos'
import { InsightsCriativos } from './insights-criativos'
import { FunilAtencao } from './funil-atencao'
import { GridCriativos } from './grid-criativos'
import { ModalPreview } from './modal-preview'
import { ModalDetalhe } from './modal-detalhe'
import { Comparador } from './comparador'

interface Props { dataInicio: string; dataFim: string }

export function AbaCriativos({ dataInicio, dataFim }: Props) {
  const [filtros, setFiltros] = useState<FiltrosCriativosType>({
    tipo: 'todos',
    status: 'todos',
    ordenarPor: 'score',
    colunas: 5,
  })
  const [comparadorAtivo, setComparadorAtivo] = useState(false)
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set())
  const [criativoDetalheId, setCriativoDetalheId] = useState<string | null>(null)
  const [criativoPreviewId, setCriativoPreviewId] = useState<string | null>(null)

  const { criativos } = useMetaCriativos(filtros, dataInicio, dataFim)
  const insights = useInsightsCriativos(criativos)

  const criativoDetalhe = criativos.find(c => c.id === criativoDetalheId) ?? null
  const criativoPreview = criativos.find(c => c.id === criativoPreviewId) ?? null
  const insightDoDetalhe = insights.find(i => i.criativoId === criativoDetalheId) ?? null

  function handleCardClick(id: string) {
    if (comparadorAtivo) {
      setSelecionados(prev => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else if (next.size < 3) next.add(id)
        return next
      })
    } else {
      setCriativoDetalheId(id)
    }
  }

  return (
    <div>
      <FiltrosCriativos
        filtros={filtros}
        onChange={setFiltros}
        comparadorAtivo={comparadorAtivo}
        onToggleComparador={() => {
          setComparadorAtivo(v => !v)
          setSelecionados(new Set())
        }}
      />

      {/* Insights — só aparece se tiver dados */}
      <InsightsCriativos
        insights={insights}
        onAbrirDetalhe={setCriativoDetalheId}
      />

      {/* Funil — só aparece se tiver vídeos */}
      <FunilAtencao criativos={criativos} />

      {/* Comparador */}
      {comparadorAtivo && selecionados.size >= 2 && (
        <Comparador
          criativos={criativos.filter(c => selecionados.has(c.id))}
          onFechar={() => { setComparadorAtivo(false); setSelecionados(new Set()) }}
        />
      )}

      {/* Banner âmbar quando comparador ativo e menos de 2 selecionados */}
      {comparadorAtivo && selecionados.size < 2 && criativos.length > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 16px', marginBottom: 16,
          background: 'rgba(239,159,39,0.08)',
          border: '1px solid rgba(239,159,39,0.25)',
          borderRadius: 'var(--ws-radius-md)',
          fontSize: 12, color: '#854f0b', fontWeight: 500,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          Selecione ao menos 2 criativos para comparar
          ({selecionados.size} de 2 selecionados)
        </div>
      )}

      {/* Grid — sempre renderiza, mostra estado vazio internamente */}
      <GridCriativos
        criativos={criativos}
        colunas={filtros.colunas}
        comparadorAtivo={comparadorAtivo}
        selecionados={selecionados}
        onCardClick={handleCardClick}
        onAbrirPreview={setCriativoPreviewId}
        onColunasChange={(n) => setFiltros(f => ({ ...f, colunas: n }))}
      />

      <ModalPreview
        criativo={criativoPreview}
        aberto={!!criativoPreviewId}
        onFechar={() => setCriativoPreviewId(null)}
        onAbrirDetalhe={(id) => {
          setCriativoPreviewId(null)
          setCriativoDetalheId(id)
        }}
      />

      <ModalDetalhe
        criativo={criativoDetalhe}
        insight={insightDoDetalhe}
        aberto={!!criativoDetalheId}
        onFechar={() => setCriativoDetalheId(null)}
        onAbrirPreview={(id) => {
          setCriativoDetalheId(null)
          setCriativoPreviewId(id)
        }}
      />
    </div>
  )
}
