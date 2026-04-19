'use client'
import { useState } from 'react'
import { FiltrosCampanhas } from '@/types/meta-ads-campanhas'
import { FiltrosCampanhasComp } from './filtros-campanhas'
import { ResumoCampanhasComp } from './resumo-campanhas'
import { TabelaHierarquica } from './tabela-hierarquica'
import { useMetaCampanhas } from '@/hooks/use-meta-campanhas'

interface Props { dataInicio: string; dataFim: string }

export function AbaCampanhas({ dataInicio, dataFim }: Props) {
  const [filtros, setFiltros] = useState<FiltrosCampanhas>({
    busca: '',
    objetivo: 'todos',
    status: 'todos',
    plataformas: ['facebook', 'instagram', 'whatsapp'],
  })

  const { campanhas, resumo } = useMetaCampanhas(filtros, dataInicio, dataFim)

  return (
    <div>
      <FiltrosCampanhasComp filtros={filtros} onChange={setFiltros} />
      <ResumoCampanhasComp resumo={resumo} />
      <TabelaHierarquica campanhas={campanhas} />
    </div>
  )
}
