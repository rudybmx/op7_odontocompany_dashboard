'use client'
import { useState } from 'react'
import { TriangleAlert, TrendingUp, Info, ChevronRight, ChevronDown } from 'lucide-react'

type InsightTipo = 'alerta' | 'oportunidade' | 'info'

interface Insight {
  tipo: InsightTipo
  titulo: string
  mensagem: string
  acao: string
}

const INSIGHTS: Insight[] = [
  {
    tipo: 'alerta',
    titulo: 'Fadiga criativa detectada',
    mensagem: 'O anúncio "Morar bem em SP" atingiu frequência 4.2. CTR caiu 38% nos últimos 7 dias. Público saturado.',
    acao: 'Ver anúncio',
  },
  {
    tipo: 'oportunidade',
    titulo: 'Segmento subexplorado',
    mensagem: 'Mulheres 25-34 têm CPL R$ 18,20 — 43% abaixo da média. Aumentar budget nesse segmento pode gerar +180 leads/mês.',
    acao: 'Ajustar orçamento',
  },
  {
    tipo: 'info',
    titulo: 'Meta Advantage+ otimizando',
    mensagem: 'A campanha Broad está em fase de aprendizado. Estabilização prevista em 3-5 dias. Não pausar durante esse período.',
    acao: 'Ver detalhes',
  },
  {
    tipo: 'alerta',
    titulo: 'Orçamento diário esgotado',
    mensagem: 'Meta Ads — Lookalike atingiu 100% do budget às 14h. Campanhas pausadas por 10h. Considerar aumentar o limite diário.',
    acao: 'Ajustar budget',
  },
  {
    tipo: 'oportunidade',
    titulo: 'Horário de pico identificado',
    mensagem: 'Terça e quarta entre 19h-22h concentram 38% dos leads com menor CPL. Agendar maior investimento nesses períodos.',
    acao: 'Configurar agendamento',
  },
]

const TIPO_CONFIG = {
  alerta: {
    border: '#FF5C8D',
    iconBg: 'rgba(255,92,141,0.12)',
    color: '#c2004f',
    label: 'ALERTA',
    Icon: TriangleAlert,
  },
  oportunidade: {
    border: '#0fa856',
    iconBg: 'rgba(15,168,86,0.12)',
    color: '#007a40',
    label: 'OPORTUNIDADE',
    Icon: TrendingUp,
  },
  info: {
    border: '#3E5BFF',
    iconBg: 'rgba(62,91,255,0.12)',
    color: '#2340c4',
    label: 'INFO',
    Icon: Info,
  },
}

function InsightCard({ insight }: { insight: Insight }) {
  const cfg = TIPO_CONFIG[insight.tipo]
  const { Icon } = cfg

  return (
    <div style={{
      borderLeft: `3px solid ${cfg.border}`,
      background: 'var(--ws-glass-bg)',
      border: `1px solid var(--ws-glass-border)`,
      borderLeftColor: cfg.border,
      borderRadius: 'var(--ws-radius-md)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      boxShadow: 'var(--ws-glass-shadow-sm)',
      padding: '12px 14px',
      display: 'flex', gap: 12, alignItems: 'flex-start',
    }}>
      {/* Ícone */}
      <div style={{
        width: 28, height: 28, borderRadius: 6, background: cfg.iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        marginTop: 1,
      }}>
        <Icon size={14} color={cfg.border} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: cfg.color }}>{cfg.label}</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--ws-text-2)', lineHeight: 1.5, marginBottom: 6 }}>
          <strong style={{ color: 'var(--ws-text-1)', fontWeight: 500 }}>{insight.titulo}:</strong>{' '}
          {insight.mensagem}
        </div>
        <button type="button" style={{
          display: 'inline-flex', alignItems: 'center', gap: 3,
          fontSize: 10, fontWeight: 700, color: cfg.color,
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        }}>
          {insight.acao} <ChevronRight size={10} />
        </button>
      </div>
    </div>
  )
}

export function DSInsightsIA() {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? INSIGHTS : INSIGHTS.slice(0, 2)

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ws-text-1)', marginBottom: 6 }}>Insights IA</h2>
        <p style={{ fontSize: 14, color: 'var(--ws-text-2)', lineHeight: 1.6 }}>
          Painel de insights com 3 tipos: Alerta (coral), Oportunidade (verde), Info (azul).
          Borda esquerda colorida identifica o tipo.
        </p>
      </div>

      <div style={{
        background: 'var(--ws-glass-bg)', border: '1px solid var(--ws-glass-border)',
        borderRadius: 'var(--ws-radius-lg)', backdropFilter: 'blur(16px)',
        boxShadow: 'var(--ws-glass-shadow)', padding: 20,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)' }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ws-text-1)' }}>Insights IA</div>
            <span style={{
              fontSize: 9, fontWeight: 600,
              background: 'var(--ws-purple-soft)', border: '1px solid rgba(122,90,248,0.20)',
              borderRadius: 9999, padding: '2px 8px', color: 'var(--ws-purple)',
            }}>{INSIGHTS.length} insights</span>
          </div>
          <span style={{ fontSize: 10, color: 'var(--ws-text-3)' }}>Atualizado às 14:32</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {visible.map((insight, i) => (
            <InsightCard key={i} insight={insight} />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          style={{
            marginTop: 12, width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            padding: '8px', borderRadius: 'var(--ws-radius-md)',
            background: 'var(--ws-glass-bg)', border: '1px solid var(--ws-glass-border)',
            cursor: 'pointer', fontSize: 11, fontWeight: 500, color: 'var(--ws-blue)',
            transition: 'var(--ws-transition)',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--ws-glass-bg-hover)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--ws-glass-bg)')}
        >
          {expanded ? (
            <><ChevronDown size={13} /> Recolher</>
          ) : (
            <><ChevronDown size={13} /> Ver mais {INSIGHTS.length - 2} insights</>
          )}
        </button>
      </div>
    </div>
  )
}
