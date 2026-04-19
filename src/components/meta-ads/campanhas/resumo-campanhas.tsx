'use client'
import { useState, useEffect } from 'react'
import { ResumoCampanhas } from '@/types/meta-ads-campanhas'

interface Props {
  resumo: ResumoCampanhas
}

interface CardProps {
  label: string
  valor: string
  sub: string
  deltaColor?: string
}

function Card({ label, valor, sub, deltaColor, isCTR = false }: CardProps & { isCTR?: boolean }) {
  // Parsing sub to identify if it's a delta or a label
  const isDelta = sub.includes('%') || sub.includes('pp')
  
  return (
    <div 
      className="group"
      style={{
        background: 'var(--ws-glass-bg, rgba(255,255,255,0.72))',
        border: '1px solid var(--ws-glass-border, rgba(255,255,255,0.40))',
        borderRadius: '12px',
        padding: '12px 14px',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 4px 16px rgba(14,20,42,0.08), 0 1px 4px rgba(14,20,42,0.06)',
        position: 'relative',
        overflow: 'hidden',
        minWidth: 0,
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-1px)'
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(14,20,42,0.12), 0 2px 8px rgba(14,20,42,0.08)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(14,20,42,0.08), 0 1px 4px rgba(14,20,42,0.06)'
      }}
    >
      {/* Shine Line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)',
        pointerEvents: 'none'
      }} />

      <div style={{
        fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.07em',
        color: '#8892b0', marginBottom: 4,
      }}>
        {label}
      </div>
      
      <div style={{ 
        fontSize: 20, fontWeight: 700, 
        color: '#0E142A', letterSpacing: '-0.02em',
        lineHeight: 1.1 
      }}>
        {valor}
      </div>

      {isDelta ? (
        <div style={{ 
          fontSize: 11, fontWeight: 500, 
          color: deltaColor || '#8892b0', 
          marginTop: 3 
        }}>
          {sub}
        </div>
      ) : (
        <div style={{ 
          fontSize: 10, color: '#8892b0', 
          marginTop: 2,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
        }} title={sub}>
          {sub}
        </div>
      )}
    </div>
  )
}

export function ResumoCampanhasComp({ resumo }: Props) {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const fmtBRL = (n: number) => n.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
  const fmtK = (n: number) => n >= 1000
    ? (n / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + 'K'
    : n.toLocaleString('pt-BR')

  // Helper for color coding deltas
  // Positivo é bom para Leads, Investimento (crescimento), CTR
  // Negativo é bom para CPL
  const getDeltaColor = (sub: string, invert: boolean = false) => {
    if (!sub.includes('%') && !sub.includes('pp')) return '#8892b0'
    const isNegative = sub.includes('-')
    if (invert) return isNegative ? '#0fa856' : '#FF5C8D'
    return isNegative ? '#FF5C8D' : '#0fa856'
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(6, 1fr)',
      gap: isMobile ? 6 : 10,
      marginBottom: 16,
    }}>
      <Card
        label="Campanhas ativas"
        valor={String(resumo.campanhasAtivas)}
        sub={`${resumo.campanhasAtivas} de ${resumo.totalCampanhas} total`}
      />
      <Card
        label="Investimento total"
        valor={`R$ ${fmtBRL(resumo.investimentoTotal)}`}
        sub="+12.0% vs ant."
        deltaColor={getDeltaColor("+12.0%")}
      />
      <Card
        label="Leads totais"
        valor={fmtK(resumo.leadsTotal)}
        sub="+23.4% vs ant."
        deltaColor={getDeltaColor("+23.4%")}
      />
      <Card
        label="CPL médio"
        valor={`R$ ${fmtBRL(resumo.cplMedio)}`}
        sub="-8.2% vs ant."
        deltaColor={getDeltaColor("-8.2%", true)}
      />
      <Card
        label="CTR médio"
        valor={`${resumo.ctrMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}%`}
        sub="+0,42pp"
        deltaColor="#0fa856"
        isCTR
      />
      <Card
        label="Melhor CPL"
        valor={`R$ ${fmtBRL(resumo.melhorCpl)}`}
        sub={resumo.melhorCplNome}
      />
    </div>
  )
}

