'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, CreditCard } from 'lucide-react'
import { SiVisa, SiMastercard, SiPix } from 'react-icons/si'
import type { ContaAnuncio, TipoComparativo } from '@/types/meta-ads'
import { CardLeads } from './card-leads'
import { formatarMoeda, formatarNumeroCompacto, formatarPorcentagem } from '@/lib/formatar'
import { MiniGauge } from '@/components/ui/mini-gauge'

interface CartoesKpiProps {
  contas: ContaAnuncio[]
  comparativo: TipoComparativo
}

function calcularMediaPonderada(contas: ContaAnuncio[], numerador: keyof ContaAnuncio, denominador: keyof ContaAnuncio): number {
  const totalNum = contas.reduce((s, c) => s + (c[numerador] as number), 0)
  const totalDen = contas.reduce((s, c) => s + (c[denominador] as number), 0)
  return totalDen > 0 ? totalNum / totalDen : 0
}

function calcDelta(atual: number, anterior: number, invertido: boolean): { valor: string; positivo: boolean; neutro: boolean } {
  if (!anterior || anterior === 0) return { valor: '—', positivo: false, neutro: true }
  const pct = ((atual - anterior) / anterior) * 100
  const numeroInvertido = invertido ? pct < 0 : pct > 0
  return {
    valor: `${pct >= 0 ? '+' : ''}${pct.toFixed(1).replace('.', ',')}%`,
    positivo: numeroInvertido,
    neutro: Math.abs(pct) < 0.5,
  }
}

const LABEL_COMPARATIVO: Record<TipoComparativo, string> = {
  periodo_anterior: 'período ant.',
  mes_anterior: 'mês ant.',
  ano_anterior: 'ano ant.',
  nenhum: '',
}

function detectarBandeira(tipo?: string | null): 'visa' | 'mastercard' | 'outro' {
  if (!tipo || typeof tipo !== 'string') return 'outro'
  const t = tipo.toUpperCase()
  if (t.includes('VISA')) return 'visa'
  if (t.includes('MASTER')) return 'mastercard'
  return 'outro'
}

export function CartoesKpi({ contas, comparativo }: CartoesKpiProps) {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  const contasAtivas = contas.filter((c) => c.status === 'ACTIVE' || c.investimento > 0)

  const totalInvestimento = contasAtivas.reduce((s, c) => s + c.investimento, 0)
  const totalLeads = contasAtivas.reduce((s, c) => s + c.leads, 0)
  const totalAlcance = contasAtivas.reduce((s, c) => s + c.alcance, 0)
  const totalImpressoes = contasAtivas.reduce((s, c) => s + c.impressoes, 0)
  const totalCliques = contasAtivas.reduce((s, c) => s + (c.investimento / c.cpc), 0)

  const cpLMedio = totalInvestimento > 0 && totalLeads > 0 ? totalInvestimento / totalLeads : 0
  const ctrMedio = totalAlcance > 0 ? calcularMediaPonderada(contasAtivas, 'ctr', 'alcance') : 0
  const cpcMedio = totalCliques > 0 ? totalInvestimento / totalCliques : 0
  const cpmMedio = totalImpressoes > 0 ? (totalInvestimento / totalImpressoes) * 1000 : 0
  const freqMedia = totalAlcance > 0 ? totalImpressoes / totalAlcance : 0

  const temComparativo = comparativo !== 'nenhum' && contasAtivas.some((c) => c.periodoAnterior)

  const anterior = temComparativo
    ? {
        investimento: contasAtivas.reduce((s, c) => s + (c.periodoAnterior?.investimento ?? 0), 0),
        leads: contasAtivas.reduce((s, c) => s + (c.periodoAnterior?.leads ?? 0), 0),
        cpl: 0, ctr: 0, cpc: 0, cpm: 0, alcance: 0, impressoes: 0, frequencia: 0,
      }
    : null

  if (anterior) {
    const antLeads = contasAtivas.reduce((s, c) => s + (c.periodoAnterior?.leads ?? 0), 0)
    anterior.cpl = antLeads > 0 ? anterior.investimento / antLeads : 0
    const antAlcance = contasAtivas.reduce((s, c) => s + (c.periodoAnterior?.alcance ?? 0), 0)
    anterior.ctr = antAlcance > 0 ? calcularMediaPonderada(contasAtivas.map(c => ({ ...c, ctr: c.periodoAnterior?.ctr ?? 0, alcance: c.periodoAnterior?.alcance ?? 0 })), 'ctr', 'alcance') : 0
    const antCliques = contasAtivas.reduce((s, c) => s + (c.periodoAnterior ? c.periodoAnterior.investimento / Math.max(c.periodoAnterior.cpc, 0.01) : 0), 0)
    anterior.cpc = antCliques > 0 ? anterior.investimento / antCliques : 0
    anterior.cpm = anterior.impressoes > 0 ? (anterior.investimento / anterior.impressoes) * 1000 : 0
    anterior.frequencia = antAlcance > 0 ? anterior.impressoes / antAlcance : 0
  }

  const labelComp = LABEL_COMPARATIVO[comparativo]

  const kpis = [
    { label: 'Investimento', valor: formatarMoeda(totalInvestimento), chaveDelta: 'investimento' as const, invertido: false },
    { label: 'LEADS', valor: null, isLeads: true },
    { label: 'CPL', valor: formatarMoeda(cpLMedio), chaveDelta: 'cpl' as const, invertido: true },
    { label: 'CTR', valor: formatarPorcentagem(ctrMedio), chaveDelta: 'ctr' as const, invertido: false },
    { label: 'CPC', valor: formatarMoeda(cpcMedio), chaveDelta: 'cpc' as const, invertido: true },
    { label: 'CPM', valor: formatarMoeda(cpmMedio), chaveDelta: 'cpm' as const, invertido: true },
    { label: 'Frequência', valor: freqMedia.toLocaleString('pt-BR', { minimumFractionDigits: 2 }), chaveDelta: 'frequencia' as const, invertido: true },
    { label: 'Alcance', valor: formatarNumeroCompacto(totalAlcance), chaveDelta: 'alcance' as const, invertido: false },
    { label: 'Impressões', valor: formatarNumeroCompacto(totalImpressoes), chaveDelta: 'impressoes' as const, invertido: false },
  ]

  // === Card de Saldo ===
  const contaUnica = contas.length === 1 ? contas[0] : null
  const totalSaldo = contas.reduce((s, c) => s + c.saldo, 0)

  const isPrepayUnica = contaUnica?.isPrepay
  const limiteUnico = contaUnica?.limiteCartao ?? 0
  const ultimaRecarga = contaUnica?.ultimoValorRecarga
  const fundingType = contaUnica?.fundingSourceType
  const bandeira = detectarBandeira(fundingType)

  let mostrarAlerta = false
  if (contaUnica) {
    if (!isPrepayUnica && limiteUnico > 0) {
      mostrarAlerta = contaUnica.saldo / limiteUnico <= 0.10
    } else if (isPrepayUnica && ultimaRecarga && ultimaRecarga > 0) {
      mostrarAlerta = contaUnica.saldo / ultimaRecarga <= 0.10
    }
  }

  const pctBarra: number | null = (() => {
    if (!contaUnica) return null
    if (!isPrepayUnica && limiteUnico > 0)
      return Math.min(100, Math.max(0, (contaUnica.saldo / limiteUnico) * 100))
    if (isPrepayUnica && ultimaRecarga && ultimaRecarga > 0)
      return Math.min(100, Math.max(0, (contaUnica.saldo / ultimaRecarga) * 100))
    return null
  })()

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2.5 mb-4 items-stretch">

      {/* Card de Saldo Disponível */}
      <div
        style={{
          background: mostrarAlerta
            ? 'rgba(255,92,141,0.07)'
            : 'var(--ws-glass-bg, rgba(255,255,255,0.72))',
          border: mostrarAlerta
            ? '1px solid rgba(255,92,141,0.35)'
            : '1px solid var(--ws-glass-border, rgba(255,255,255,0.35))',
          borderRadius: '14px',
          padding: '16px 18px',
          backdropFilter: 'blur(16px)',
          boxShadow: 'var(--ws-glass-shadow, 0 8px 32px rgba(14,20,42,0.12))',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.2s ease',
        }}
      >
        {/* Shine */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)', pointerEvents: 'none' }} />

        {/* Ícone de pagamento */}
        {contaUnica && (
          <div style={{ position: 'absolute', top: '14px', right: '14px', opacity: 0.7 }}>
            {isPrepayUnica ? (
              <SiPix size={20} color="#32BCAD" />
            ) : bandeira === 'visa' ? (
              <SiVisa size={26} color="#1A1F71" />
            ) : bandeira === 'mastercard' ? (
              <SiMastercard size={26} />
            ) : (
              <CreditCard size={18} style={{ color: 'var(--ws-text-3)' }} />
            )}
          </div>
        )}

        {/* Label */}
        <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.07em', color: mostrarAlerta ? 'var(--ws-coral, #FF5C8D)' : 'var(--ws-text-3, #8892b0)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          Saldo disponível
          {mostrarAlerta && <AlertTriangle className="h-3 w-3" style={{ color: 'var(--ws-coral, #FF5C8D)' }} />}
        </div>

        {/* Valor */}
        <div style={{ fontSize: isMobile ? '1.1rem' : '26px', fontWeight: 700, color: mostrarAlerta ? 'var(--ws-coral, #FF5C8D)' : 'var(--ws-text-1, #0E142A)', letterSpacing: '-0.02em', lineHeight: 1, wordBreak: 'break-word' }}>
          {formatarMoeda(totalSaldo)}
        </div>

        {/* Limite ou recarga */}
        {contaUnica && (
          <div style={{ fontSize: '10px', color: 'var(--ws-text-3, #8892b0)', marginTop: '5px' }}>
            {!isPrepayUnica && limiteUnico > 0
              ? `Limite: ${formatarMoeda(limiteUnico)}`
              : isPrepayUnica && ultimaRecarga && ultimaRecarga > 0
                ? `Última recarga: ${formatarMoeda(ultimaRecarga)}`
                : !isPrepayUnica ? 'Cartão de crédito' : 'PIX'
            }
          </div>
        )}

        {/* Barra de progresso */}
        {pctBarra !== null && (
          <div style={{ marginTop: '10px', height: '4px', borderRadius: '2px', background: 'rgba(14,20,42,0.08)' }}>
            <div style={{
              height: '100%',
              borderRadius: '2px',
              width: `${pctBarra}%`,
              background: mostrarAlerta
                ? 'linear-gradient(90deg, #FF5C8D, #ff8fab)'
                : 'linear-gradient(90deg, #3E5BFF, #7A5AF8)',
              transition: 'width 0.4s ease',
            }} />
          </div>
        )}

        {/* Aviso crítico */}
        {mostrarAlerta && (
          <div style={{ marginTop: '8px', fontSize: '10px', fontWeight: 600, color: 'var(--ws-coral, #FF5C8D)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <AlertTriangle size={10} />
            Saldo crítico — abaixo de 10%
          </div>
        )}
      </div>

      {kpis.map((kpi) => {
        if ('isLeads' in kpi && kpi.isLeads) {
          return (
            <div key="leads">
              <CardLeads contas={contas} leadsAnterior={anterior?.leads} />
            </div>
          )
        }

        const isAlerta = 'alerta' in kpi ? kpi.alerta : false
        const cardMinHeight = '90px'

        let deltaComp: { valor: string; positivo: boolean; neutro: boolean } | null = null
        if (temComparativo && anterior && 'chaveDelta' in kpi && kpi.chaveDelta && anterior[kpi.chaveDelta] !== undefined) {
          const chave = kpi.chaveDelta
          const atualVal = chave === 'investimento' ? totalInvestimento
            : chave === 'cpl' ? cpLMedio
            : chave === 'ctr' ? ctrMedio
            : chave === 'cpc' ? cpcMedio
            : chave === 'cpm' ? cpmMedio
            : chave === 'frequencia' ? freqMedia
            : chave === 'alcance' ? totalAlcance
            : chave === 'impressoes' ? totalImpressoes
            : 0
          deltaComp = calcDelta(atualVal, anterior[chave] as number, 'invertido' in kpi ? kpi.invertido as boolean : false)
        }

        let valorAnteriorFormatado = ''
        if (deltaComp && temComparativo && anterior && 'chaveDelta' in kpi && kpi.chaveDelta && anterior[kpi.chaveDelta] !== undefined) {
          const chave = kpi.chaveDelta
          const ant = anterior[chave] as number
          if (chave === 'investimento' || chave === 'cpl' || chave === 'cpc' || chave === 'cpm') valorAnteriorFormatado = formatarMoeda(ant)
          else if (chave === 'ctr') valorAnteriorFormatado = formatarPorcentagem(ant)
          else if (chave === 'alcance' || chave === 'impressoes') valorAnteriorFormatado = formatarNumeroCompacto(ant)
          else if (chave === 'frequencia') valorAnteriorFormatado = ant.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
        }

        return (
          <div
            key={kpi.label}
            style={{
              background: 'var(--ws-glass-bg, rgba(255,255,255,0.72))',
              border: '1px solid var(--ws-glass-border, rgba(255,255,255,0.35))',
              borderRadius: '14px',
              padding: '16px 18px',
              backdropFilter: 'blur(16px)',
              boxShadow: 'var(--ws-glass-shadow, 0 8px 32px rgba(14,20,42,0.12), 0 2px 8px rgba(14,20,42,0.08))',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)"
              e.currentTarget.style.boxShadow = "var(--ws-glass-shadow-lg, 0 16px 48px rgba(14,20,42,0.18), 0 4px 16px rgba(14,20,42,0.10))"
              e.currentTarget.style.zIndex = "30"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = ""
              e.currentTarget.style.boxShadow = "var(--ws-glass-shadow, 0 8px 32px rgba(14,20,42,0.12), 0 2px 8px rgba(14,20,42,0.08))"
              e.currentTarget.style.zIndex = ""
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)', pointerEvents: 'none' }} />

            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--ws-text-3, #8892b0)', marginBottom: '8px' }} className="flex items-center gap-1">
              {kpi.label}
            </div>
            
            <div style={{ fontSize: isMobile ? '1.1rem' : '26px', fontWeight: 700, color: 'var(--ws-text-1, #0E142A)', letterSpacing: '-0.02em', lineHeight: 1, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
              {kpi.valor}
            </div>

            {kpi.label === 'Investimento' && temComparativo && anterior && anterior.investimento > 0 && (
              <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                <MiniGauge 
                  value={Math.round((totalInvestimento / anterior.investimento) * 100)}
                  size={44}
                  strokeWidth={3.5}
                  trend={totalInvestimento > anterior.investimento ? 'up' : 'down'}
                />
              </div>
            )}

            {kpi.label === 'CPL' && temComparativo && anterior && anterior.cpl > 0 && (
              <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                {(() => {
                  const variacao = ((cpLMedio - anterior.cpl) / anterior.cpl) * 100
                  const gaugeValue = Math.max(0, Math.min(100, 100 - variacao))
                  return (
                    <MiniGauge 
                      value={gaugeValue}
                      size={44}
                      strokeWidth={3.5}
                      trend={cpLMedio < anterior.cpl ? 'up' : 'down'}
                    />
                  )
                })()}
              </div>
            )}

            {'delta' in kpi && Boolean(kpi.delta) && (
              <div style={{ fontSize: '10px', color: 'var(--ws-text-3, #8892b0)', marginTop: '4px' }}>
                {String(kpi.delta)}
              </div>
            )}

            {deltaComp && (
              <>
                <div style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  marginTop: '12px',
                  color: deltaComp.neutro ? 'var(--ws-text-3, #8892b0)' : deltaComp.positivo ? 'var(--ws-green, #0fa856)' : 'var(--ws-coral, #FF5C8D)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                }}>
                  {deltaComp.neutro ? '' : deltaComp.positivo ? '↑' : '↓'} {deltaComp.valor}
                </div>
                {valorAnteriorFormatado && (
                  <div style={{ fontSize: '10px', color: 'var(--ws-text-3, #8892b0)', marginTop: '6px' }}>
                    Atual: <span style={{ fontWeight: 400 }}>{kpi.valor}</span> | Ant.: <span style={{ fontWeight: 400 }}>{valorAnteriorFormatado}</span>
                  </div>
                )}
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}