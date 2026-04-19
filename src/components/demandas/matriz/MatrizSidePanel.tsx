'use client'

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { InfoTooltip } from '@/components/ui/info-tooltip'
import { calcCanalMetrics, calcMonthMetrics, formatBRL, MONTH_LABELS } from '@/lib/matriz-utils'
import type { MatrizPlan } from '@/types/matriz'

interface MatrizSidePanelProps {
  plan: MatrizPlan
}

function tooltipCurrencyFormatter(
  value: string | number | readonly (string | number)[] | undefined
): string {
  return typeof value === 'number' ? formatBRL(value) : '—'
}

function formatCompactCurrency(value: number): string {
  if (value === 0) return 'R$0'
  if (value >= 1000) return `R$${(value / 1000).toFixed(0)}k`
  return `R$${value}`
}

export default function MatrizSidePanel({ plan }: MatrizSidePanelProps) {
  const canalMetrics = calcCanalMetrics(plan.rows)
  const monthMetrics = calcMonthMetrics(plan.rows)
  const areaData = monthMetrics.map((monthMetric) => ({
    month: MONTH_LABELS[monthMetric.month - 1],
    meta: plan.rows.find((row) => row.canal === 'meta')?.months.find((month) => month.month === monthMetric.month)?.aprovado ?? 0,
    google: plan.rows.find((row) => row.canal === 'google')?.months.find((month) => month.month === monthMetric.month)?.aprovado ?? 0,
    tiktok: plan.rows.find((row) => row.canal === 'tiktok')?.months.find((month) => month.month === monthMetric.month)?.aprovado ?? 0,
    linkedin: plan.rows.find((row) => row.canal === 'linkedin')?.months.find((month) => month.month === monthMetric.month)?.aprovado ?? 0,
  }))

  return (
    <aside
      className="w-[340px] shrink-0 p-4"
      style={{
        background: 'var(--ws-glass-bg)',
        border: '1px solid var(--ws-glass-border)',
        borderRadius: 14,
        backdropFilter: 'blur(16px)',
        boxShadow: 'var(--ws-glass-shadow)',
      }}
    >
      <div className="flex flex-col gap-6">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[10px] uppercase tracking-[0.05em] text-muted-foreground/70">Distribuição aprovada</div>
            <InfoTooltip
              title="Distribuição aprovada"
              description="Participação de cada canal no total de verba aprovada para o ano."
            />
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={canalMetrics}
                  dataKey="totalAprovado"
                  nameKey="canal"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  isAnimationActive={false}
                >
                  {canalMetrics.map((entry) => (
                    <Cell key={entry.canal} fill={plan.rows.find((row) => row.canal === entry.canal)?.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={tooltipCurrencyFormatter}
                  contentStyle={{ borderRadius: 8, border: '1px solid rgba(15,39,68,0.10)', background: '#0f2744', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 space-y-2">
            {canalMetrics.map((metric) => {
              const row = plan.rows.find((entry) => entry.canal === metric.canal)
              return (
                <div key={metric.canal} className="flex items-center justify-between gap-3 text-[12px]">
                  <div className="flex items-center gap-2 text-foreground/70">
                    <span className="inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: row?.color }} />
                    {row?.label}
                  </div>
                  <div className="text-right">
                    <div className="tabular-nums text-foreground">{formatBRL(metric.totalAprovado)}</div>
                    <div className="tabular-nums text-muted-foreground">{metric.percentualDoTotal.toFixed(0)}%</div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[10px] uppercase tracking-[0.05em] text-muted-foreground/70">Evolução mensal aprovada</div>
            <InfoTooltip
              title="Evolução mensal aprovada"
              description="Investimento aprovado acumulado por canal ao longo do ano."
            />
          </div>
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData}>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'rgba(15,39,68,0.55)' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={formatCompactCurrency} tick={{ fontSize: 11, fill: 'rgba(15,39,68,0.55)' }} axisLine={false} tickLine={false} />
                <RechartsTooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid rgba(15,39,68,0.10)', background: '#0f2744', color: '#fff' }}
                />
                {plan.rows.map((row) => (
                  <Area
                    key={row.canal}
                    type="monotone"
                    dataKey={row.canal}
                    stackId="1"
                    stroke={row.color}
                    fill={row.color}
                    fillOpacity={0.2}
                    isAnimationActive={false}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[10px] uppercase tracking-[0.05em] text-muted-foreground/70">Aprovado vs realizado</div>
            <InfoTooltip
              title="Aprovado vs realizado"
              description="Comparativo entre verba aprovada e efetivamente realizada por canal."
            />
          </div>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={canalMetrics} layout="vertical" margin={{ left: 10, right: 18 }}>
                <XAxis type="number" tickFormatter={formatCompactCurrency} tick={{ fontSize: 11, fill: 'rgba(15,39,68,0.55)' }} axisLine={false} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="canal"
                  tickFormatter={(value: string) => plan.rows.find((row) => row.canal === value)?.label ?? value}
                  tick={{ fontSize: 11, fill: 'rgba(15,39,68,0.60)' }}
                  axisLine={false}
                  tickLine={false}
                  width={92}
                />
                <RechartsTooltip
                  formatter={tooltipCurrencyFormatter}
                  contentStyle={{ borderRadius: 8, border: '1px solid rgba(15,39,68,0.10)', background: '#0f2744', color: '#fff' }}
                />
                <Bar dataKey="totalAprovado" fill="rgba(15,39,68,0.18)" isAnimationActive={false} radius={[0, 4, 4, 0]} />
                <Bar dataKey="totalRealizado" isAnimationActive={false} radius={[0, 4, 4, 0]}>
                  {canalMetrics.map((entry) => (
                    <Cell key={entry.canal} fill={plan.rows.find((row) => row.canal === entry.canal)?.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </aside>
  )
}
