'use client'

import { InfoTooltip } from '@/components/ui/info-tooltip'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { DadosDemograficos, MetricaPublicos } from '@/types/meta-ads-publicos'

interface Props {
  demograficos: DadosDemograficos[]
  metrica: MetricaPublicos
}

const FAIXAS = ['18–24', '25–34', '35–44', '45–54', '55–64', '65+']
const GENEROS: Array<{ chave: 'masc' | 'fem'; label: string }> = [
  { chave: 'masc', label: 'Masc' },
  { chave: 'fem', label: 'Fem' },
]

const SUBTITULOS: Record<MetricaPublicos, string> = {
  leads: 'Volume de leads por segmento demográfico',
  cpl: 'CPL por segmento — verde = eficiente, vermelho = caro',
  investimento: 'Distribuição de investimento por segmento',
  ctr: 'CTR por segmento demográfico',
}

const COR_GRADIENTE = [
  { bg: '#501313', txt: '#f09595' },
  { bg: '#a32d2d', txt: '#f7c1c1' },
  { bg: '#ef9f27', txt: '#412402' },
  { bg: '#faeeda', txt: '#633806' },
  { bg: '#97c459', txt: '#27500a' },
  { bg: '#3b6d11', txt: '#eaf3de' },
  { bg: '#27500a', txt: '#c0dd97' },
]

const MAPA_DEMOGRAFICO_DIAGRAM = `
  <div style="font-size:10px;color:#666">
    <div style="display:grid;grid-template-columns:50px repeat(3,1fr);gap:2px;margin-bottom:4px">
      <div></div>
      <div style="text-align:center;font-size:9px;color:#999">18–34</div>
      <div style="text-align:center;font-size:9px;color:#999">35–54</div>
      <div style="text-align:center;font-size:9px;color:#999">55+</div>
      <div style="font-size:9px;color:#999">Fem.</div>
      <div style="background:#27500a;border-radius:2px;height:18px;display:flex;align-items:center;justify-content:center;color:#c0dd97;font-size:9px">R$0,24</div>
      <div style="background:#ef9f27;border-radius:2px;height:18px;display:flex;align-items:center;justify-content:center;color:#412402;font-size:9px">R$0,98</div>
      <div style="background:#501313;border-radius:2px;height:18px;display:flex;align-items:center;justify-content:center;color:#f09595;font-size:9px">R$7,20</div>
      <div style="font-size:9px;color:#999">Masc.</div>
      <div style="background:#3b6d11;border-radius:2px;height:18px;display:flex;align-items:center;justify-content:center;color:#eaf3de;font-size:9px">R$0,32</div>
      <div style="background:#faeeda;border-radius:2px;height:18px;display:flex;align-items:center;justify-content:center;color:#633806;font-size:9px">R$1,20</div>
      <div style="background:#a32d2d;border-radius:2px;height:18px;display:flex;align-items:center;justify-content:center;color:#f7c1c1;font-size:9px">R$4,20</div>
    </div>
    <div style="font-size:9px;color:#999">Ponto azul = melhor segmento da conta</div>
  </div>
`

function calcularCorHeatmap(valor: number, min: number, max: number, metrica: MetricaPublicos) {
  const t = (valor - min) / (max - min || 1)
  
  // Para CPL, quanto menor, melhor (quente). Mas o usuário pediu "fluxo" = vermelho.
  // Vamos seguir a escala de "calor": Baixo volume = Verde Frio, Alto volume = Vermelho Quente.
  // Para CPL: Baixo CPL = Verde Frio (eficiente), Alto CPL = Vermelho Quente (alerta/caro).
  const p = t

  if (p <= 0.25) return { bg: 'rgba(15, 168, 86, 0.12)', txt: 'var(--ws-text-1)' } 
  if (p <= 0.50) return { bg: 'rgba(245, 166, 35, 0.4)', txt: 'var(--ws-text-1)' }
  if (p <= 0.80) return { bg: 'rgba(255, 92, 141, 0.75)', txt: '#fff' }
  return { bg: 'rgba(163, 45, 45, 0.95)', txt: '#fff' }
}

function obterValor(d: DadosDemograficos, metrica: MetricaPublicos): number {
  switch (metrica) {
    case 'leads': return d.leads
    case 'cpl': return d.cpl
    case 'investimento': return d.investimento
    case 'ctr': return d.ctr
  }
}

function formatarValor(d: DadosDemograficos, metrica: MetricaPublicos): string {
  switch (metrica) {
    case 'leads': return d.leads.toString()
    case 'cpl': return `R$${d.cpl.toFixed(2).replace('.', ',')}`
    case 'investimento': return `R$${d.investimento.toFixed(0)}`
    case 'ctr': return `${d.ctr.toFixed(1)}%`
  }
}

export function MapaCalorDemografico({ demograficos, metrica }: Props) {
  if (!demograficos || demograficos.length === 0) {
    return (
      <div style={{
        background: 'var(--ws-glass-bg)',
        border: '1px solid var(--ws-glass-border)',
        borderRadius: 'var(--ws-radius-lg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: 'var(--ws-glass-shadow)',
        padding: '16px 20px',
        position: 'relative',
        height: '100%',
        minHeight: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--ws-text-2)',
        fontSize: 13,
      }}>
        Nenhum dado demográfico disponível no momento.
      </div>
    )
  }

  const valores = demograficos.map(d => obterValor(d, metrica))
  const min = Math.min(...valores)
  const max = Math.max(...valores)

  const melhor = demograficos.reduce((a, b) => a.cpl < b.cpl ? a : b)

  function celula(genero: 'masc' | 'fem', faixa: string) {
    const d = demograficos.find(x => x.genero === genero && x.faixa === faixa)
    if (!d) return null
    const val = obterValor(d, metrica)
    const cor = calcularCorHeatmap(val, min, max, metrica)
    const ehMelhor = d.genero === melhor.genero && d.faixa === melhor.faixa

    return (
      <TooltipProvider key={`${genero}-${faixa}`} delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <td
              style={{
                background: cor.bg,
                color: cor.txt,
                padding: '8px',
                textAlign: 'center',
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'opacity 150ms',
                position: 'relative',
                minWidth: 70,
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              {formatarValor(d, metrica)}
              {ehMelhor && (
                <span
                  style={{
                    display: 'inline-block',
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#0f2744',
                    marginLeft: 4,
                    verticalAlign: 'middle',
                  }}
                />
              )}
            </td>
          </TooltipTrigger>
          <TooltipContent style={{ background: '#0f2744', color: '#fff', border: 'none', fontSize: 11, borderRadius: 6 }}>
            <div>{genero === 'fem' ? 'Feminino' : 'Masculino'} {faixa}</div>
            <div>CPL R${d.cpl.toFixed(2).replace('.', ',')} · {d.leads} leads · CTR {d.ctr.toFixed(1)}%</div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div style={{
      background: 'var(--ws-glass-bg)',
      border: '1px solid var(--ws-glass-border)',
      borderRadius: 'var(--ws-radius-lg)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      boxShadow: 'var(--ws-glass-shadow)',
      padding: '16px 20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
      }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ws-text-1)' }}>Mapa de calor — idade × gênero</div>
          <div style={{ fontSize: 11, color: 'var(--ws-text-2)' }}>{SUBTITULOS[metrica]}</div>
        </div>
        <InfoTooltip
          title="Mapa de calor — idade × gênero"
          description="Cada célula mostra a métrica selecionada por segmento. Verde = melhor desempenho. Vermelho = pior."
          diagram={MAPA_DEMOGRAFICO_DIAGRAM}
        />
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ width: 50, fontSize: 10, color: 'var(--ws-text-2)', padding: '4px 8px' }} />
              {FAIXAS.map(f => (
                <th key={f} style={{ fontSize: 10, color: 'var(--ws-text-2)', padding: '4px 8px', textAlign: 'center', fontWeight: 400 }}>
                  {f}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {GENEROS.map(({ chave, label }) => (
              <tr key={chave}>
                <td style={{ fontSize: 11, color: 'var(--ws-text-2)', padding: '4px 8px', fontWeight: 500 }}>{label}</td>
                {FAIXAS.map(faixa => celula(chave, faixa))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, fontSize: 10, color: 'var(--ws-text-2)' }}>
        <span>Baixo vol. / CPL</span>
        <div style={{ display: 'flex', gap: 2 }}>
          <div style={{ width: 14, height: 8, background: 'rgba(15, 168, 86, 0.12)', borderRadius: 1 }} />
          <div style={{ width: 14, height: 8, background: 'rgba(245, 166, 35, 0.4)', borderRadius: 1 }} />
          <div style={{ width: 14, height: 8, background: 'rgba(255, 92, 141, 0.75)', borderRadius: 1 }} />
          <div style={{ width: 14, height: 8, background: 'rgba(163, 45, 45, 0.95)', borderRadius: 1 }} />
        </div>
        <span>Alto vol. / CPL</span>
        <span style={{ marginLeft: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#0f2744' }} />
          Melhor segmento
        </span>
      </div>
    </div>
  )
}
