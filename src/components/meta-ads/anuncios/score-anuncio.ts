export function calcularScore(a: {
  cpl: number
  ctr: number
  leads: number
  frequencia: number
  status: string
  tendencia: string
}): number {
  let score = 0

  // CPL (40 pontos)
  if (a.cpl <= 0.50) score += 40
  else if (a.cpl <= 1.00) score += 32
  else if (a.cpl <= 2.00) score += 20
  else if (a.cpl <= 5.00) score += 10

  // CTR (25 pontos)
  if (a.ctr >= 3.0) score += 25
  else if (a.ctr >= 2.0) score += 18
  else if (a.ctr >= 1.0) score += 10
  else if (a.ctr >= 0.5) score += 5

  // Volume de leads (20 pontos)
  if (a.leads >= 200) score += 20
  else if (a.leads >= 50) score += 14
  else if (a.leads >= 10) score += 8
  else if (a.leads >= 1) score += 3

  // Frequência (15 pontos)
  if (a.frequencia <= 2.0) score += 15
  else if (a.frequencia <= 2.5) score += 10
  else if (a.frequencia <= 3.0) score += 5
  else if (a.frequencia <= 3.5) score += 2

  // Penalizações
  if (a.status === 'PAUSED') score = Math.round(score * 0.7)
  if (a.tendencia === 'caindo') score = Math.round(score * 0.85)

  return Math.min(Math.max(score, 0), 100)
}
