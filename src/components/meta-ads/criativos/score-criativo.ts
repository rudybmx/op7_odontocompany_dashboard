export function calcularScoreCriativo(c: {
  cpl: number
  ctr: number
  leads: number
  frequencia: number
  hookRate: number | null
  holdRate: number | null
  diasAtivo: number
  status: string
}): number {
  let score = 0

  // CPL (35pts)
  if (c.cpl <= 0.50) score += 35
  else if (c.cpl <= 1.00) score += 28
  else if (c.cpl <= 2.00) score += 18
  else if (c.cpl <= 5.00) score += 8

  // CTR (20pts)
  if (c.ctr >= 3.0) score += 20
  else if (c.ctr >= 2.0) score += 14
  else if (c.ctr >= 1.0) score += 7

  // Leads (15pts)
  if (c.leads >= 200) score += 15
  else if (c.leads >= 50) score += 10
  else if (c.leads >= 10) score += 5

  // Hook Rate (15pts — só vídeos)
  if (c.hookRate !== null) {
    if (c.hookRate >= 35) score += 15
    else if (c.hookRate >= 25) score += 10
    else if (c.hookRate >= 15) score += 5
  } else {
    score += 8
  }

  // Hold Rate (10pts — só vídeos)
  if (c.holdRate !== null) {
    if (c.holdRate >= 50) score += 10
    else if (c.holdRate >= 40) score += 7
    else if (c.holdRate >= 25) score += 3
  } else {
    score += 5
  }

  // Frequência (5pts)
  if (c.frequencia <= 2.0) score += 5
  else if (c.frequencia <= 2.5) score += 3
  else if (c.frequencia > 3.5) score -= 5

  // Penalizações
  if (c.status === 'fadiga') score = Math.round(score * 0.6)
  if (c.diasAtivo > 45) score = Math.round(score * 0.85)

  return Math.min(Math.max(score, 0), 100)
}
