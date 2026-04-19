import { CANAL_CONFIG } from '@/lib/matriz-utils'
import type { Canal, CanalRow, MatrizPlan, MonthValue } from '@/types/matriz'

const CLIENTS = [
  {
    id: 'lumie',
    name: 'Clínica Estética Lumié',
    updatedAt: '2025-04-10',
    updatedBy: 'Fernanda Reis',
    values: {
      meta: [3800, 4200, 4500, 4800, 5200, 5400, 5600, 6000, 6200, 7000, 7600, 8000],
      google: [2100, 2200, 2400, 2500, 2600, 2800, 3000, 3100, 3200, 3400, 3600, 3800],
      tiktok: [700, 800, 900, 1200, 1300, 1400, 1500, 1500, 1600, 1700, 1800, 1800],
      linkedin: [500, 500, 600, 700, 700, 800, 800, 850, 900, 900, 950, 1000],
    },
  },
  {
    id: 'bravo',
    name: 'Auto Peças Bravo',
    updatedAt: '2025-04-09',
    updatedBy: 'Marcos Dutra',
    values: {
      meta: [4200, 4500, 4700, 5000, 5400, 5800, 6000, 6200, 6500, 7000, 7400, 7800],
      google: [2500, 2600, 2800, 3000, 3100, 3200, 3300, 3400, 3600, 3800, 3900, 4000],
      tiktok: [500, 700, 900, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900],
      linkedin: [400, 500, 500, 600, 600, 700, 700, 700, 800, 800, 900, 900],
    },
  },
  {
    id: 'viva',
    name: 'Colégio Viva',
    updatedAt: '2025-04-08',
    updatedBy: 'Ana Lima',
    values: {
      meta: [3200, 3600, 3900, 4200, 4500, 5000, 5300, 5600, 5900, 6500, 7000, 7600],
      google: [1800, 2000, 2200, 2400, 2600, 2800, 3000, 3200, 3300, 3500, 3700, 3900],
      tiktok: [600, 700, 800, 900, 1000, 1100, 1200, 1200, 1300, 1400, 1500, 1600],
      linkedin: [1200, 1400, 1500, 1700, 1800, 2000, 2200, 2400, 2600, 2800, 3000, 3200],
    },
  },
  {
    id: 'apex',
    name: 'Imobiliária Apex',
    updatedAt: '2025-04-10',
    updatedBy: 'Juliana Park',
    values: {
      meta: [4500, 5000, 5400, 5800, 6200, 6500, 6800, 7000, 7200, 7600, 7900, 8200],
      google: [2200, 2400, 2600, 2800, 3000, 3200, 3300, 3500, 3600, 3800, 3900, 4000],
      tiktok: [800, 900, 1100, 1300, 1400, 1500, 1700, 1700, 1800, 1900, 2000, 2000],
      linkedin: [1500, 1700, 1800, 2200, 2400, 2600, 2800, 3000, 3200, 3400, 3600, 3800],
    },
  },
] as const

const PERFORMANCE_FACTORS: Record<Canal, number[]> = {
  meta: [0.97, 1.12, 0.99, 0.94],
  google: [0.91, 1.04, 0.88, 1.02],
  tiktok: [0.82, 0.76, 0.68, 0],
  linkedin: [0.95, 0.87, 1.03, 0.9],
}

function buildMonths(canal: Canal, approvedValues: readonly number[]): MonthValue[] {
  return approvedValues.map((aprovado, index) => {
    const month = index + 1
    const realizedFactor = PERFORMANCE_FACTORS[canal][index]
    const realizado = month > 4 ? 0 : Math.round(aprovado * realizedFactor / 10) * 10

    return {
      month,
      aprovado,
      realizado,
    }
  })
}

function buildRow(canal: Canal, approvedValues: readonly number[]): CanalRow {
  return {
    canal,
    label: CANAL_CONFIG[canal].label,
    color: CANAL_CONFIG[canal].color,
    months: buildMonths(canal, approvedValues),
  }
}

export const matrizPlans: MatrizPlan[] = CLIENTS.map((client) => ({
  id: `matriz-${client.id}-2025`,
  clientId: client.id,
  clientName: client.name,
  year: 2025,
  rows: [
    buildRow('meta', client.values.meta),
    buildRow('google', client.values.google),
    buildRow('tiktok', client.values.tiktok),
    buildRow('linkedin', client.values.linkedin),
  ],
  updatedAt: client.updatedAt,
  updatedBy: client.updatedBy,
}))

export const matrizClients = matrizPlans.map((plan) => ({
  id: plan.clientId,
  name: plan.clientName,
}))

export const matrizYears = [2024, 2025, 2026]
