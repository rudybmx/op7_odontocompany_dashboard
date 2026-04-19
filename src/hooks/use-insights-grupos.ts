import type { GrupoAnunciosDetalhe, InsightGoogle } from '@/types/google-ads'

export function useInsightsGrupos(grupos: GrupoAnunciosDetalhe[]): InsightGoogle[] {
  const insights: InsightGoogle[] = []

  // APRENDIZADO — grupos em Smart Bidding learning
  grupos.filter(g => g.emAprendizado).forEach(g => {
    insights.push({
      id: `learning-${g.id}`,
      campanhaId: g.campanhaId,
      severidade: 'info',
      titulo: 'Grupo em fase de aprendizado',
      mensagem: `${g.nome.substring(0, 32)}... Smart Bidding aprendendo. Não otimizar por ~${g.diasAprendizado} dias.`,
      analiseCompleta: `O grupo está em fase de aprendizado do Smart Bidding. O algoritmo precisa de pelo menos 30 conversões em 30 dias para otimizar com precisão. Tem ${g.conversoes} conversões no período atual. Não faça alterações de lance, orçamento ou segmentação durante o aprendizado — isso reinicia o processo.`,
      labelAcao: 'Ver grupo',
    })
  })

  // QS BAIXO — grupos Search com QS médio < 5
  grupos.filter(g => g.qualityScoreMedio > 0 && g.qualityScoreMedio < 5).forEach(g => {
    insights.push({
      id: `qs-${g.id}`,
      campanhaId: g.campanhaId,
      severidade: 'alerta',
      titulo: 'Quality Score crítico no grupo',
      mensagem: `${g.nome.substring(0, 32)}... QS médio ${g.qualityScoreMedio.toFixed(1)}/10 — pagando mais por posições inferiores.`,
      analiseCompleta: `QS médio de ${g.qualityScoreMedio.toFixed(1)}/10 indica desalinhamento entre keywords, anúncios e landing page. Um QS baixo aumenta o CPC efetivo em até 50% e reduz posição do anúncio. Ações: (1) Revisar texto dos anúncios para incluir a keyword principal no título. (2) Verificar velocidade e relevância da landing page. (3) Considerar criar grupos com tema mais específico (STAGs — Single Theme Ad Groups).`,
      labelAcao: 'Ver keywords',
    })
  })

  // TARGET CPA — grupos com custo muito acima do target
  grupos.filter(g => {
    if (!g.targetCpaMicros) return false
    const targetCpa = g.targetCpaMicros / 1_000_000
    return g.custoConversao > targetCpa * 1.5 && g.conversoes >= 10
  }).forEach(g => {
    const targetCpa = (g.targetCpaMicros! / 1_000_000).toFixed(2).replace('.', ',')
    insights.push({
      id: `target-${g.id}`,
      campanhaId: g.campanhaId,
      severidade: 'alerta',
      titulo: 'Custo acima do target CPA',
      mensagem: `${g.nome.substring(0, 32)}... target R$${targetCpa} mas realizando R$${g.custoConversao.toFixed(2).replace('.', ',')}. Smart Bidding precisa de ajuste.`,
      analiseCompleta: `O grupo tem target CPA de R$${targetCpa} mas está realizando R$${g.custoConversao.toFixed(2).replace('.', ',')} — ${((g.custoConversao / (g.targetCpaMicros! / 1_000_000) - 1) * 100).toFixed(0)}% acima do target. Possíveis causas: target muito agressivo, QS baixo elevando leilão, ou sazonalidade. Recomendação: aumentar o target temporariamente em 20% para dar mais margem ao algoritmo e depois reduzir gradualmente.`,
      labelAcao: 'Ver grupo',
    })
  })

  // AD STRENGTH ruim no PMax
  grupos.filter(g => g.adStrength === 'POOR' || g.adStrength === 'AVERAGE').forEach(g => {
    insights.push({
      id: `strength-${g.id}`,
      campanhaId: g.campanhaId,
      severidade: 'info',
      titulo: 'Asset Group com força baixa',
      mensagem: `${g.nome.substring(0, 32)}... Ad Strength "${g.adStrength}" — adicionar mais assets pode melhorar distribuição.`,
      analiseCompleta: `Asset Group com Ad Strength ${g.adStrength}. O Google otimiza melhor grupos com força EXCELLENT ou GOOD. Para melhorar: adicionar pelo menos 5 headlines, 5 descriptions, 3+ imagens, 1 logo e 1 vídeo. Groups com EXCELLENT strength têm em média 12% mais conversões que AVERAGE no mesmo orçamento.`,
      labelAcao: 'Ver asset group',
    })
  })

  // OPORTUNIDADE — grupo com excelente ROAS e IS baixo
  grupos.filter(g => g.roas > 35 && g.impressionShare !== null && g.impressionShare < 0.5).forEach(g => {
    insights.push({
      id: `scale-${g.id}`,
      campanhaId: g.campanhaId,
      severidade: 'oportunidade',
      titulo: 'Grupo eficiente com baixa visibilidade',
      mensagem: `${g.nome.substring(0, 32)}... ROAS ${g.roas.toFixed(1)}× mas IS apenas ${((g.impressionShare ?? 0) * 100).toFixed(0)}%. Escalar pode multiplicar resultados.`,
      analiseCompleta: `ROAS de ${g.roas.toFixed(1)}× com Impression Share de apenas ${((g.impressionShare ?? 0) * 100).toFixed(0)}% significa que há muito espaço para crescer. Aumentar o lance ou orçamento pode capturar mais das impressões disponíveis sem degradar o ROAS significativamente neste nível de eficiência.`,
      labelAcao: 'Ver grupo',
    })
  })

  const ordem: Record<string, number> = { alerta: 0, oportunidade: 1, info: 2 }
  return insights
    .sort((a, b) => ordem[a.severidade] - ordem[b.severidade])
    .slice(0, 6)
}
