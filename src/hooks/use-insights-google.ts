import type { CampanhaGoogle, InsightGoogle } from '@/types/google-ads'

export function useInsightsGoogle(campanhas: CampanhaGoogle[]): InsightGoogle[] {
  const insights: InsightGoogle[] = []

  const searchCamps = campanhas.filter(c => c.tipo === 'SEARCH' && c.isPerdidoRank > 0.25)
  searchCamps.forEach(c => {
    insights.push({
      id: `rank-${c.id}`, campanhaId: c.id,
      severidade: 'alerta',
      titulo: 'Impression Share perdido por rank',
      mensagem: `${c.nome.substring(0,35)}... perdendo ${(c.isPerdidoRank * 100).toFixed(0)}% das impressões por Quality Score ou bid baixo.`,
      analiseCompleta: `A campanha ${c.nome} tem Impression Share de ${(c.impressionShare * 100).toFixed(0)}% mas perde ${(c.isPerdidoRank * 100).toFixed(0)}% por rank insuficiente. Quality Score médio: ${c.qualityScoreMedio.toFixed(1)}/10. Para melhorar: revisar relevância do anúncio, melhorar landing page e aumentar bid nas palavras-chave com QS < 5.`,
      labelAcao: 'Ver campanha',
    })
  })

  const budgetLoss = campanhas.filter(c => c.isPeridoBudget > 0.10)
  budgetLoss.forEach(c => {
    insights.push({
      id: `budget-${c.id}`, campanhaId: c.id,
      severidade: 'info',
      titulo: 'Impression Share perdido por orçamento',
      mensagem: `${c.nome.substring(0,35)}... perdendo ${(c.isPeridoBudget * 100).toFixed(0)}% das impressões por orçamento esgotado antes do fim do dia.`,
      analiseCompleta: `A campanha está limitada por orçamento — perde ${(c.isPeridoBudget * 100).toFixed(0)}% das impressões diárias. Orçamento atual: R$${c.orcamentoDiario}/dia. Aumentar para R$${(c.orcamentoDiario * 1.3).toFixed(0)}/dia pode recuperar essas impressões sem impactar o CPC médio de forma significativa.`,
      labelAcao: 'Ver campanha',
    })
  })

  const altaRoas = campanhas.filter(c => c.roas > 30 && c.status === 'ENABLED')
  altaRoas.forEach(c => {
    insights.push({
      id: `roas-${c.id}`, campanhaId: c.id,
      severidade: 'oportunidade',
      titulo: 'Alto ROAS — oportunidade de escala',
      mensagem: `${c.nome.substring(0,35)}... com ROAS ${c.roas.toFixed(1)}× — retorno excelente. Aumentar orçamento pode amplificar resultados.`,
      analiseCompleta: `ROAS de ${c.roas.toFixed(1)}× está acima do benchmark do setor (tipicamente 3–5× para odontologia). Cada R$1 investido retorna R$${c.roas.toFixed(2)} em valor de conversão. Recomendação: aumentar orçamento diário em 20–30% e monitorar se o ROAS se mantém acima de 15× após a escala.`,
      labelAcao: 'Escalar campanha',
    })
  })

  const qsBaixo = campanhas.filter(c => c.qualityScoreMedio > 0 && c.qualityScoreMedio < 5)
  qsBaixo.forEach(c => {
    insights.push({
      id: `qs-${c.id}`, campanhaId: c.id,
      severidade: 'alerta',
      titulo: 'Quality Score crítico',
      mensagem: `${c.nome.substring(0,35)}... com QS médio ${c.qualityScoreMedio.toFixed(1)}/10 — anúncios pagando mais por posições inferiores.`,
      analiseCompleta: `Quality Score médio de ${c.qualityScoreMedio.toFixed(1)}/10 indica desalinhamento entre palavras-chave, anúncios e landing page. QS baixo aumenta o CPC em até 50% e reduz a posição do anúncio. Verificar: relevância do texto do anúncio com a keyword, velocidade e conteúdo da landing page, e CTR esperado das keywords.`,
      labelAcao: 'Ver palavras-chave',
    })
  })

  return insights
    .sort((a, b) => {
      const ordem: Record<string, number> = { alerta: 0, oportunidade: 1, info: 2 }
      return ordem[a.severidade] - ordem[b.severidade]
    })
    .slice(0, 6)
}
