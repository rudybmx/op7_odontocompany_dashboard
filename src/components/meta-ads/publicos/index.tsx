'use client'

import { useState } from 'react'
import { FiltrosPublicos } from './filtros-publicos'
import { InsightsPublicos } from './insights-publicos'
import { KpiPublicos } from './kpi-publicos'
import { MapaCalorDemografico } from './mapa-calor-demografico'
import { BreakdownPlacements } from './breakdown-placements'
import { BreakdownDispositivos } from './breakdown-dispositivos'
import { HeatmapHorarios } from './heatmap-horarios'
import { GeoPerformance } from './geo-performance'
import { GraficosDemograficos } from './graficos-demograficos'
import { useMetaPublicos } from '@/hooks/use-meta-publicos'
import { useInsightsPublicos } from '@/hooks/use-insights-publicos'
import type { FiltrosPublicos as FiltrosPublicosTipo } from '@/types/meta-ads-publicos'

interface Props { dataInicio: string; dataFim: string }

export function AbaPublicos({ dataInicio, dataFim }: Props) {
  const [filtros, setFiltros] = useState<FiltrosPublicosTipo>({
    campanha: 'todas',
    conjunto: 'todos',
    periodo: '30d',
    metrica: 'leads',
  })

  const dados = useMetaPublicos(filtros, dataInicio, dataFim)
  const insights = useInsightsPublicos(
    dados?.demograficos ?? [],
    dados?.placements ?? [],
    dados?.heatmapHoras ?? []
  )

  return (
    <div className="space-y-8 pb-8">
      <FiltrosPublicos filtros={filtros} onChange={setFiltros} />
      <InsightsPublicos insights={insights} />
      <KpiPublicos kpi={dados.kpi} />

      <MapaCalorDemografico
        demograficos={dados.demograficos}
        metrica={filtros.metrica}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <BreakdownPlacements placements={dados.placements} />
        <BreakdownDispositivos
          dispositivos={dados.dispositivos}
          sistemasOperacionais={dados.sistemaOperacional}
        />
      </div>

      <HeatmapHorarios heatmap={dados.heatmapHoras} />
      <GeoPerformance cidades={dados.cidades.filter(g => g.nome !== 'Unknown' && g.leads > 0)} />
      <GraficosDemograficos demograficos={dados.demograficos} />
    </div>
  )
}
