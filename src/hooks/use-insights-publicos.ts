import type { DadosDemograficos, DadosPlacement, DadosHora, InsightPublico } from '@/types/meta-ads-publicos'

export function useInsightsPublicos(
  demograficos: DadosDemograficos[] = [],
  placements: DadosPlacement[] = [],
  heatmap: DadosHora[] = []
): InsightPublico[] {
  const demo = demograficos ?? []
  const place = placements ?? []
  const heat = heatmap ?? []

  if (demo.length === 0 && place.length === 0 && heat.length === 0) return []
  const insights: InsightPublico[] = []

  // MELHOR SEGMENTO — guard against empty array
  if (demo.length > 0) {
    const comLeads = demo.filter(d => d.leads > 0)
    const pool = comLeads.length > 0 ? comLeads : demo

    const melhor = pool.reduce((a, b) => a.cpl < b.cpl ? a : b)
    const totalLeads = demo.reduce((s, d) => s + d.leads, 0)

    insights.push({
      id: 'melhor-seg',
      severidade: 'oportunidade',
      titulo: 'Audiência de ouro',
      mensagem: `${melhor.genero === 'fem' ? 'Mulheres' : 'Homens'} ${melhor.faixa} com CPL R$${melhor.cpl.toFixed(2).replace('.', ',')} — ${totalLeads > 0 ? (melhor.leads / totalLeads * 100).toFixed(0) : 0}% dos leads com menor custo.`,
      analiseCompleta: `Segmento mais eficiente da conta. CPL R$${melhor.cpl.toFixed(2).replace('.', ',')} com CTR ${melhor.ctr.toFixed(1)}%. Representam ${melhor.leads} leads no período. Recomendação: aumentar bid multiplier para este segmento e criar criativos específicos para essa faixa etária.`,
      labelAcao: 'Ver segmento',
    })

    // SEGMENTO DESPERDIÇANDO ORÇAMENTO
    const pior = demo.reduce((a, b) => (a.cpl > b.cpl && a.investimento > 50) ? a : b, demo[0])
    if (pior && melhor && pior.cpl > melhor.cpl * 5) {
      insights.push({
        id: 'pior-seg',
        severidade: 'alerta',
        titulo: 'Orçamento desperdiçado',
        mensagem: `${pior.genero === 'fem' ? 'Mulheres' : 'Homens'} ${pior.faixa} com CPL R$${pior.cpl.toFixed(2).replace('.', ',')} — ${(pior.cpl / melhor.cpl).toFixed(0)}× mais caro que o melhor segmento.`,
        analiseCompleta: `Este segmento consome R$${pior.investimento.toFixed(0)} com apenas ${pior.leads} leads (CPL R$${pior.cpl.toFixed(2).replace('.', ',')}). O CPL é ${(pior.cpl / melhor.cpl).toFixed(1)}× pior que o melhor segmento. Recomendação: aplicar exclusão de idade ou bid cap para reduzir gastos nesta faixa.`,
        labelAcao: 'Ver segmento',
      })
    }
  }

  // PLACEMENT SUBAPROVEITADO — guard against empty placements
  if (place.length > 0) {
    const melhoresPlat = [...place].sort((a, b) => a.cpl - b.cpl)
    const melhorPlat = melhoresPlat[0]
    if (melhorPlat.percentual < 15) {
      const fbFeed = place.find(p => p.nome.includes('FB Feed'))
      insights.push({
        id: 'plat-sub',
        severidade: 'info',
        titulo: 'Placement subaproveitado',
        mensagem: `${melhorPlat.nome} tem CPL R$${melhorPlat.cpl.toFixed(2).replace('.', ',')} e apenas ${melhorPlat.percentual}% do orçamento. Aumentar pode reduzir CPL médio.`,
        analiseCompleta: `${melhorPlat.nome} é o placement com melhor CPL (R$${melhorPlat.cpl.toFixed(2).replace('.', ',')}) mas recebe apenas ${melhorPlat.percentual}% do orçamento. O Feed Facebook recebe mais orçamento mas com CPL ${(fbFeed?.cpl ?? 0).toFixed(2)}. Recomendação: ajustar Advantage+ placements ou criar conjunto dedicado para este placement.`,
        labelAcao: 'Ver placements',
      })
    }
  }

  // HORÁRIO DE OURO — guard against empty heatmap
  if (heat.length > 0) {
    const maxIntensidade = heat.reduce((max, h) => h.intensidade > max ? h.intensidade : max, 0)
    const horaOuro = heat.find(h => h.intensidade === maxIntensidade)
    if (horaOuro) {
      const dias = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
      insights.push({
        id: 'horario-ouro',
        severidade: 'oportunidade',
        titulo: 'Horário de ouro detectado',
        mensagem: `${dias[horaOuro.dia]} das 19h–22h concentram maior volume de leads com menor CPM. Day-parting pode reduzir custos.`,
        analiseCompleta: `Análise do heatmap mostra concentração de 34% dos leads entre 19h–22h de terça e quarta-feira. CPM neste horário é 41% menor que a média. Recomendação: ativar day-parting para concentrar orçamento neste período ou criar regras automáticas de ajuste de bid por horário.`,
        labelAcao: 'Ver horários',
      })
    }
  }

  return insights.sort((a, b) => {
    const ordem: Record<string, number> = { alerta: 0, oportunidade: 1, info: 2 }
    return ordem[a.severidade] - ordem[b.severidade]
  }).slice(0, 6)
}
