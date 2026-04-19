'use client'
import { useState } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

const IDADES = ['18-24', '25-34', '35-44', '45-54', '55+']
const GENEROS = ['Masculino', 'Feminino', 'Indefinido']
const DIAS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

type Metrica = 'leads' | 'cpl' | 'invest' | 'ctr'

// Dados simulados demográfico
const DEMO_DATA = {
  leads:  [[42, 78, 12], [89, 124, 8], [67, 98, 5], [34, 56, 3], [18, 29, 2]],
  cpl:    [[38.2, 24.1, 42.0], [22.5, 19.8, 35.0], [29.1, 25.4, 40.0], [35.6, 28.9, 45.0], [48.2, 38.5, 55.0]],
  invest: [[1603, 1880, 504], [2002, 2455, 280], [1949, 2489, 200], [1210, 1618, 135], [867, 1117, 110]],
  ctr:    [[2.1, 3.4, 1.2], [3.8, 4.2, 1.8], [2.9, 3.1, 1.5], [2.2, 2.8, 1.1], [1.8, 2.2, 0.9]],
}

// Heatmap horários (simplificado)
const HORA_DATA: number[][] = DIAS.map((_, d) =>
  Array.from({ length: 24 }, (__, h) => {
    const peak = d < 5 ? (h >= 8 && h <= 22 ? Math.random() : Math.random() * 0.3) : (h >= 10 && h <= 20 ? Math.random() * 0.7 : Math.random() * 0.2)
    return parseFloat(peak.toFixed(3))
  })
)

function calcularCorHeatmap(v: number, min: number, max: number, invertido = false): string {
  const range = max - min || 1
  let t = (v - min) / range
  if (invertido) t = 1 - t

  const stops = [
    [39, 80, 10],   // verde escuro
    [59, 109, 17],  // verde médio
    [151, 196, 89], // verde claro
    [250, 238, 218],// neutro
    [239, 159, 39], // âmbar
    [163, 45, 45],  // vermelho
    [80, 19, 19],   // vermelho escuro
  ]

  const idx = t * (stops.length - 1)
  const i = Math.min(Math.floor(idx), stops.length - 2)
  const f = idx - i
  const [r1, g1, b1] = stops[i]
  const [r2, g2, b2] = stops[i + 1]

  const r = Math.round(r1 + (r2 - r1) * f)
  const g = Math.round(g1 + (g2 - g1) * f)
  const b = Math.round(b1 + (b2 - b1) * f)
  return `rgb(${r},${g},${b})`
}

const METRICA_LABELS: Record<Metrica, string> = {
  leads: 'Leads', cpl: 'CPL (R$)', invest: 'Investimento (R$)', ctr: 'CTR (%)',
}
const METRICA_INVERTIDO: Record<Metrica, boolean> = {
  leads: false, cpl: true, invest: false, ctr: false,
}

export function DSHeatmap() {
  const [metrica, setMetrica] = useState<Metrica>('leads')
  const data = DEMO_DATA[metrica]
  const flat = data.flat()
  const min = Math.min(...flat)
  const max = Math.max(...flat)
  const inv = METRICA_INVERTIDO[metrica]

  // melhor = menor cpl, maior leads
  let bestI = 0, bestJ = 0
  let bestVal = inv ? Infinity : -Infinity
  data.forEach((row, i) => row.forEach((v, j) => {
    if (inv ? v < bestVal : v > bestVal) { bestVal = v; bestI = i; bestJ = j }
  }))

  function fmtVal(v: number) {
    if (metrica === 'cpl' || metrica === 'invest') return `R$ ${v.toFixed(2)}`
    if (metrica === 'ctr') return `${v.toFixed(1)}%`
    return String(Math.round(v))
  }

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ws-text-1)', marginBottom: 6 }}>Heatmaps</h2>
        <p style={{ fontSize: 14, color: 'var(--ws-text-2)', lineHeight: 1.6 }}>
          Heatmap demográfico (Idade × Gênero) e heatmap de horários (Dia × Hora).
          Ponto azul marca o melhor segmento.
        </p>
      </div>

      {/* Heatmap demográfico */}
      <div style={{
        background: 'var(--ws-glass-bg)', border: '1px solid var(--ws-glass-border)',
        borderRadius: 'var(--ws-radius-lg)', backdropFilter: 'blur(16px)',
        boxShadow: 'var(--ws-glass-shadow)', padding: 20,
        position: 'relative', overflow: 'hidden', marginBottom: 20,
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ws-text-1)' }}>Heatmap Demográfico — Idade × Gênero</div>
            <div style={{ fontSize: 11, color: 'var(--ws-text-3)' }}>Ponto azul = melhor segmento. Mais verde = melhor performance.</div>
          </div>
          {/* Toggle métricas */}
          <div style={{ display: 'flex', gap: 4, background: 'var(--ws-glass-bg)', border: '1px solid var(--ws-glass-border)', borderRadius: 8, padding: 3 }}>
            {(['leads', 'cpl', 'invest', 'ctr'] as Metrica[]).map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setMetrica(m)}
                style={{
                  padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer',
                  fontSize: 10, fontWeight: 600, transition: 'var(--ws-transition)',
                  background: metrica === m ? 'rgba(62,91,255,0.12)' : 'transparent',
                  color: metrica === m ? 'var(--ws-blue)' : 'var(--ws-text-3)',
                }}
              >{METRICA_LABELS[m]}</button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'separate', borderSpacing: 3 }}>
            <thead>
              <tr>
                <th style={{ fontSize: 10, color: 'var(--ws-text-3)', padding: '0 8px 4px', textAlign: 'left', fontWeight: 400, whiteSpace: 'nowrap' }}>Faixa \ Gênero</th>
                {GENEROS.map(g => (
                  <th key={g} style={{ fontSize: 10, color: 'var(--ws-text-3)', padding: '0 4px 4px', fontWeight: 600, whiteSpace: 'nowrap' }}>{g}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {IDADES.map((idade, i) => (
                <tr key={idade}>
                  <td style={{ fontSize: 11, color: 'var(--ws-text-2)', paddingRight: 8, fontWeight: 500, whiteSpace: 'nowrap' }}>{idade}</td>
                  {GENEROS.map((_, j) => {
                    const v = data[i][j]
                    const bg = calcularCorHeatmap(v, min, max, inv)
                    const isBest = i === bestI && j === bestJ
                    return (
                      <Tooltip key={j} delayDuration={0}>
                        <TooltipTrigger asChild>
                          <td style={{
                            width: 80, height: 44, borderRadius: 6,
                            background: bg, cursor: 'pointer',
                            position: 'relative', textAlign: 'center',
                            fontSize: 12, fontWeight: 600,
                            color: 'rgba(255,255,255,0.9)',
                            textShadow: '0 1px 2px rgba(0,0,0,0.4)',
                          }}>
                            {fmtVal(v)}
                            {isBest && (
                              <div style={{
                                position: 'absolute', top: 3, right: 3,
                                width: 8, height: 8, borderRadius: '50%',
                                background: '#3E5BFF',
                                boxShadow: '0 0 6px #3E5BFF',
                              }} />
                            )}
                          </td>
                        </TooltipTrigger>
                        <TooltipContent style={{ background: 'rgba(14,20,42,0.92)', color: '#fff', border: 'none', fontSize: 11, borderRadius: 6 }}>
                          {idade} · {GENEROS[j]}: {fmtVal(v)}
                          {isBest && ' ⭐ Melhor segmento'}
                        </TooltipContent>
                      </Tooltip>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Heatmap horários */}
      <div style={{
        background: 'var(--ws-glass-bg)', border: '1px solid var(--ws-glass-border)',
        borderRadius: 'var(--ws-radius-lg)', backdropFilter: 'blur(16px)',
        boxShadow: 'var(--ws-glass-shadow)', padding: 20,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)' }} />
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ws-text-1)', marginBottom: 4 }}>Mapa de Calor — Dia × Hora</div>
        <div style={{ fontSize: 11, color: 'var(--ws-text-3)', marginBottom: 14 }}>Mais escuro = mais leads. Pico: terça-quinta à noite.</div>

        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: 500 }}>
            {/* Hora labels */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 3, marginLeft: 34 }}>
              {Array.from({ length: 24 }, (_, h) => (
                <div key={h} style={{ flex: 1, textAlign: 'center', fontSize: 8, color: 'var(--ws-text-3)' }}>
                  {h % 4 === 0 ? `${h}h` : ''}
                </div>
              ))}
            </div>

            {DIAS.map((dia, d) => (
              <div key={dia} style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
                <div style={{ fontSize: 10, color: 'var(--ws-text-3)', width: 28, textAlign: 'right', flexShrink: 0 }}>{dia}</div>
                {Array.from({ length: 24 }, (_, h) => {
                  const intensity = HORA_DATA[d][h]
                  const alpha = 0.06 + intensity * 0.93
                  const leads = Math.round(intensity * 180)
                  return (
                    <Tooltip key={h} delayDuration={0}>
                      <TooltipTrigger asChild>
                        <div style={{
                          flex: 1, height: 20, borderRadius: 2,
                          background: `rgba(62,91,255,${alpha.toFixed(3)})`,
                          cursor: 'pointer',
                        }} />
                      </TooltipTrigger>
                      <TooltipContent style={{ background: 'rgba(14,20,42,0.92)', color: '#fff', border: 'none', fontSize: 11, borderRadius: 6 }}>
                        {dia} às {h}h: ~{leads} leads
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </div>
            ))}

            {/* Legenda */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, marginLeft: 34 }}>
              <span style={{ fontSize: 9, color: 'var(--ws-text-3)' }}>Baixo</span>
              {[0.06, 0.28, 0.50, 0.72, 0.94].map(a => (
                <div key={a} style={{ width: 20, height: 12, borderRadius: 2, background: `rgba(62,91,255,${a})` }} />
              ))}
              <span style={{ fontSize: 9, color: 'var(--ws-text-3)' }}>Alto</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
