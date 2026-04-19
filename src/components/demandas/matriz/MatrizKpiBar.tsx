'use client'

import { Progress } from '@/components/ui/progress'
import { calcCanalMetrics, formatBRL, getExecucaoColor } from '@/lib/matriz-utils'
import type { MatrizPlan } from '@/types/matriz'

interface MatrizKpiBarProps {
  plan: MatrizPlan
}

export default function MatrizKpiBar({ plan }: MatrizKpiBarProps) {
  const metrics = calcCanalMetrics(plan.rows)
  const totalAprovado = metrics.reduce((sum, item) => sum + item.totalAprovado, 0)
  const totalRealizado = metrics.reduce((sum, item) => sum + item.totalRealizado, 0)
  const execucaoGeral = totalAprovado > 0 ? (totalRealizado / totalAprovado) * 100 : 0
  const canalLider = [...metrics].sort((left, right) => right.totalRealizado - left.totalRealizado)[0]
  const leaderRow = plan.rows.find((row) => row.canal === canalLider?.canal)

  const glassCard = {
    background: 'var(--ws-glass-bg)',
    border: '1px solid var(--ws-glass-border)',
    borderRadius: 14,
    backdropFilter: 'blur(16px)',
    boxShadow: 'var(--ws-glass-shadow-sm)',
  }

  return (
    <section className="grid gap-3 xl:grid-cols-4">
      <article className="p-4 transition-transform duration-200 hover:-translate-y-0.5" style={glassCard}>
        <div className="text-[10px] uppercase tracking-[0.05em] text-muted-foreground/70">Verba aprovada</div>
        <div className="mt-2 text-[24px] font-bold text-foreground">{formatBRL(totalAprovado)}</div>
        <div className="mt-1 text-[12px] text-muted-foreground">total anual</div>
      </article>

      <article className="p-4 transition-transform duration-200 hover:-translate-y-0.5" style={glassCard}>
        <div className="text-[10px] uppercase tracking-[0.05em] text-muted-foreground/70">Verba realizada</div>
        <div className="mt-2 text-[24px] font-bold text-foreground">{formatBRL(totalRealizado)}</div>
        <div className="mt-1 text-[12px] text-muted-foreground">total anual</div>
      </article>

      <article className="p-4 transition-transform duration-200 hover:-translate-y-0.5" style={glassCard}>
        <div className="text-[10px] uppercase tracking-[0.05em] text-muted-foreground/70">Execução geral</div>
        <div className="mt-2 text-[24px] font-bold text-foreground">{execucaoGeral.toFixed(1).replace('.', ',')}%</div>
        <div className="mt-3">
          <Progress
            value={execucaoGeral}
            indicatorClassName=""
            className="h-2.5"
          />
          <span
            className="pointer-events-none relative -mt-2 block h-2.5 rounded-full"
            style={{
              width: `${Math.max(0, Math.min(execucaoGeral, 100))}%`,
              backgroundColor: getExecucaoColor(execucaoGeral),
            }}
          />
        </div>
      </article>

      <article className="p-4 transition-transform duration-200 hover:-translate-y-0.5" style={glassCard}>
        <div className="text-[10px] uppercase tracking-[0.05em] text-muted-foreground/70">Canal líder</div>
        <div className="mt-2 flex items-center gap-2 text-[18px] font-semibold text-foreground">
          <span className="inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: leaderRow?.color }} />
          {leaderRow?.label ?? '—'}
        </div>
        <div className="mt-1 text-[12px] text-muted-foreground">{formatBRL(canalLider?.totalRealizado ?? 0)}</div>
      </article>
    </section>
  )
}
