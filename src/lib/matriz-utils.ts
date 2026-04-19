import type { Canal, CanalMetrics, CanalRow, MonthMetrics } from '@/types/matriz'

export const MONTH_LABELS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

export const CANAL_CONFIG: Record<Canal, { label: string; color: string; icon: string }> = {
  meta: { label: 'Meta Ads', color: '#1877F2', icon: 'M' },
  google: { label: 'Google Ads', color: '#EA4335', icon: 'G' },
  tiktok: { label: 'TikTok Ads', color: '#010101', icon: 'T' },
  linkedin: { label: 'LinkedIn Ads', color: '#0A66C2', icon: 'L' },
}

export function formatBRL(value: number): string {
  if (value === 0) return '—'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatPct(value: number, decimals = 1): string {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(decimals).replace('.', ',')}%`
}

export function getMoMVariation(row: CanalRow, currentMonth: number): number {
  const current = row.months.find((month) => month.month === currentMonth)?.realizado ?? 0
  const previous = row.months.find((month) => month.month === currentMonth - 1)?.realizado ?? 0
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

export function calcCanalMetrics(rows: CanalRow[]): CanalMetrics[] {
  const totalAprovadoGeral = rows.reduce(
    (accumulator, row) => accumulator + row.months.reduce((sum, month) => sum + month.aprovado, 0),
    0
  )

  return rows.map((row) => {
    const totalAprovado = row.months.reduce((sum, month) => sum + month.aprovado, 0)
    const totalRealizado = row.months.reduce((sum, month) => sum + month.realizado, 0)
    const lastNonZeroMonth = [...row.months].reverse().find((month) => month.realizado > 0)?.month ?? 1

    return {
      canal: row.canal,
      totalAprovado,
      totalRealizado,
      percentualDoTotal: totalAprovadoGeral > 0 ? (totalAprovado / totalAprovadoGeral) * 100 : 0,
      variacaoMoM: getMoMVariation(row, lastNonZeroMonth),
      execucao: totalAprovado > 0 ? (totalRealizado / totalAprovado) * 100 : 0,
    }
  })
}

export function calcMonthMetrics(rows: CanalRow[]): MonthMetrics[] {
  return Array.from({ length: 12 }, (_, index) => {
    const month = index + 1
    const totalAprovado = rows.reduce(
      (sum, row) => sum + (row.months.find((entry) => entry.month === month)?.aprovado ?? 0),
      0
    )
    const totalRealizado = rows.reduce(
      (sum, row) => sum + (row.months.find((entry) => entry.month === month)?.realizado ?? 0),
      0
    )

    return {
      month,
      totalAprovado,
      totalRealizado,
      execucao: totalAprovado > 0 ? (totalRealizado / totalAprovado) * 100 : 0,
    }
  })
}

export function getExecucaoColor(pct: number): string {
  if (pct >= 95) return '#3b6d11'
  if (pct >= 80) return '#854f0b'
  return '#a32d2d'
}

export function getExecucaoArrow(pct: number): string {
  if (pct >= 95) return '↑'
  if (pct >= 80) return '→'
  return '↓'
}

export function deepCloneRows<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}
