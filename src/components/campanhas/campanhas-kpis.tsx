'use client'

import React from 'react'
import { Users, DollarSign, Target, Wallet } from 'lucide-react'

interface CampanhasKpisProps {
  metrics: {
    totalLeads: number
    totalInvestido: number
    mediaConversao: number
    custoPorFechamento: number
  }
}

export function CampanhasKpis({ metrics }: CampanhasKpisProps) {
  const getConvColor = (val: number) => {
    if (val >= 20) return 'var(--ws-green)'
    if (val >= 10) return 'var(--gold)'
    return 'var(--ws-coral)'
  }

  const kpis = [
    {
      label: 'Total Leads',
      value: metrics.totalLeads,
      icon: Users,
      color: 'var(--ws-text-1)',
      sub: 'leads recebidos'
    },
    {
      label: 'Total Investido',
      value: `R$ ${metrics.totalInvestido.toLocaleString()}`,
      icon: DollarSign,
      color: 'var(--ws-blue)',
      sub: 'investimento global'
    },
    {
      label: 'Taxa de Conversão',
      value: `${metrics.mediaConversao.toFixed(1)}%`,
      icon: Target,
      color: getConvColor(metrics.mediaConversao),
      sub: 'leads ganhos / total'
    },
    {
      label: 'Custo por Fechamento',
      value: `R$ ${metrics.custoPorFechamento.toLocaleString()}`,
      icon: Wallet,
      color: metrics.custoPorFechamento > 350 ? 'var(--ws-coral)' : 'var(--ws-green)',
      sub: 'meta: R$350,00'
    }
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 12,
      marginBottom: 24,
    }}>
      {kpis.map((kpi, idx) => {
        // Lógica de cor específica para CPF se for o card de Custo por Fechamento
        const isCPF = kpi.label === 'Custo por Fechamento'
        const custoFechamento = metrics.custoPorFechamento
        
        const corValue = isCPF 
          ? (custoFechamento === 0 ? 'var(--ws-text-1)'
            : custoFechamento <= 350 ? 'var(--ws-green)' 
            : custoFechamento <= 600 ? 'var(--ws-gold)' 
            : 'var(--ws-coral)')
          : kpi.color

        return (
          <div 
            key={idx}
            style={{
              background: 'var(--ws-glass-bg)',
              border: '1px solid var(--ws-glass-border)',
              borderRadius: 'var(--ws-radius-lg)',
              backdropFilter: 'blur(16px)',
              boxShadow: 'var(--ws-glass-shadow)',
              padding: '18px 20px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Linha de brilho OBRIGATÓRIA */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 1,
              background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.8),transparent)',
              pointerEvents: 'none',
            }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ 
                fontSize: '10px', 
                textTransform: 'uppercase', 
                letterSpacing: '0.06em',
                color: 'var(--ws-text-3)',
                fontWeight: 700
              }}>
                {kpi.label}
              </span>
              <div style={{ color: corValue, opacity: 0.8 }}>
                <kpi.icon size={14} />
              </div>
            </div>

            <div style={{ fontSize: '20px', fontWeight: 500, color: 'var(--ws-text-1)', marginBottom: 4 }}>
              {kpi.value}
            </div>
            
            <div style={{ fontSize: '11px', color: 'var(--ws-text-3)', fontWeight: 400 }}>
              {kpi.sub}
            </div>
          </div>
        )
      })}
    </div>
  )
}
