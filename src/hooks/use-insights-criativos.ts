import { Criativo, InsightCriativo } from '@/types/meta-ads-criativos'

export function useInsightsCriativos(criativos: Criativo[]): InsightCriativo[] {
  const insights: InsightCriativo[] = []

  criativos.forEach(c => {
    if (c.frequencia >= 3.5 && c.score < 30) {
      insights.push({
        id: `fadiga-${c.id}`, criativoId: c.id,
        severidade: 'alerta',
        titulo: 'Criativo esgotando',
        mensagem: `${c.nome.substring(0, 28)}... com ${c.diasAtivo} dias ativos e frequência ${c.frequencia.toFixed(1)}. Performance em queda.`,
        analiseCompleta: `Criativo com sinais claros de fadiga: frequência acumulada ${c.frequencia.toFixed(1)} acima do limite recomendado (3.5), ${c.diasAtivo} dias ativo. ${c.hookRate !== null ? `Hook Rate de ${c.hookRate}% muito abaixo do benchmark (25%). ` : ''}CPL R$${c.cpl.toFixed(2).replace('.', ',')} indica desalinhamento. Recomendação: substituir por criativo novo com abordagem diferente.`,
        labelAcao: 'Ver criativo',
      })
    }

    if (c.cpl <= 0.50 && c.ctr >= 3.0 && c.frequencia <= 2.0 && c.score >= 90) {
      insights.push({
        id: `top-${c.id}`, criativoId: c.id,
        severidade: 'oportunidade',
        titulo: 'Melhor criativo da conta',
        mensagem: `${c.nome.substring(0, 28)}... com CPL R$${c.cpl.toFixed(2).replace('.', ',')} e ${c.campanhas} campanha${c.campanhas !== 1 ? 's' : ''}. Duplicar em novas contas.`,
        analiseCompleta: `CPL agregado R$${c.cpl.toFixed(2).replace('.', ',')} é o mais eficiente da conta. ${c.hookRate !== null ? `Hook Rate ${c.hookRate}% acima do benchmark. Hold Rate ${c.holdRate}% excelente. ` : ''}Frequência saudável em ${c.frequencia.toFixed(1)}. Score IA ${c.score}/100. Vida útil estimada de mais ${Math.max(0, 45 - c.diasAtivo)} dias. Recomendação: duplicar este criativo em novas contas e conjuntos.`,
        labelAcao: 'Ver criativo',
      })
    }

    if (c.hookRate !== null && c.hookRate < 20) {
      insights.push({
        id: `hook-${c.id}`, criativoId: c.id,
        severidade: 'alerta',
        titulo: 'Hook Rate crítico',
        mensagem: `${c.nome.substring(0, 28)}... com Hook Rate ${c.hookRate}% — ${c.hookRate < 15 ? 'muito abaixo' : 'abaixo'} do benchmark (25%). Revisar os primeiros 3 segundos.`,
        analiseCompleta: `Hook Rate de ${c.hookRate}% significa que ${100 - c.hookRate}% das pessoas ignoram o anúncio nos primeiros 3 segundos. Meta benchmark: 25–35%. Hold Rate ${c.holdRate}% indica que mesmo quem para, não continua assistindo. O problema está nos primeiros 3 segundos — o hook não está parando o scroll. Recomendação: testar novas versões com abertura diferente (pergunta direta, dado surpreendente ou imagem de impacto).`,
        labelAcao: 'Ver criativo',
      })
    }

    if (c.diasAtivo >= 28 && c.diasAtivo < 40 && c.score >= 60) {
      insights.push({
        id: `vida-${c.id}`, criativoId: c.id,
        severidade: 'info',
        titulo: 'Preparar substituto',
        mensagem: `${c.nome.substring(0, 28)}... com ${c.diasAtivo} dias ativo e boa performance. Criar variação antes da fadiga chegar.`,
        analiseCompleta: `Criativo com ${c.diasAtivo} dias ativo e score ${c.score}/100. Performance ainda boa, mas criativos tipicamente começam a fatigar entre 30–45 dias. Frequência em ${c.frequencia.toFixed(1)} ainda controlada. Recomendação: criar 2–3 variações deste criativo agora para ter substitutos prontos quando a performance começar a cair.`,
        labelAcao: 'Ver criativo',
      })
    }
  })

  return insights
    .sort((a, b) => {
      const ordem: Record<string, number> = { alerta: 0, oportunidade: 1, info: 2 }
      return ordem[a.severidade] - ordem[b.severidade]
    })
    .slice(0, 6)
}
