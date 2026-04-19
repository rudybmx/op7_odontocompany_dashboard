'use client'

import { InfoTooltip } from '@/components/ui/info-tooltip'
import type { BreakdownTipo } from '@/types/google-ads'
import { formatarMoeda } from '@/lib/formatar'

const BADGE_STYLES: Record<string, { bg: string; cor: string }> = {
  SEARCH: { bg: 'rgba(62,91,255,0.08)', cor: '#3E5BFF' },
  PERFORMANCE_MAX: { bg: 'rgba(15,168,86,0.08)', cor: '#0fa856' },
  DISPLAY: { bg: 'rgba(239,159,39,0.08)', cor: '#EF9F27' },
  VIDEO: { bg: 'rgba(255,92,141,0.08)', cor: '#FF5C8D' },
  SHOPPING: { bg: '#eeedfe', cor: '#3c3489' },
  DEMAND_GEN: { bg: '#e1f5ee', cor: '#0f6e56' },
}

interface Props {
  tipos: BreakdownTipo[]
}

const BREAKDOWN_CAMPANHAS_DIAGRAM = `
  <div style="font-size:10px;color:#666;display:flex;flex-direction:column;gap:4px">
    <div style="display:flex;align-items:center;gap:5px">
      <div style="width:10px;height:10px;background:rgba(62,91,255,0.08);border:1px solid #3E5BFF;border-radius:2px"></div>
      <span><b style="color:#3E5BFF">Search</b> — intenção alta, CTR alto</span>
    </div>
    <div style="display:flex;align-items:center;gap:5px">
      <div style="width:10px;height:10px;background:rgba(15,168,86,0.08);border:1px solid #0fa856;border-radius:2px"></div>
      <span><b style="color:#0fa856">Perf. Max</b> — multicanal, AI-driven</span>
    </div>
    <div style="display:flex;align-items:center;gap:5px">
      <div style="width:10px;height:10px;background:rgba(239,159,39,0.08);border:1px solid #EF9F27;border-radius:2px"></div>
      <span><b style="color:#EF9F27">Display</b> — remarketing visual</span>
    </div>
    <div style="display:flex;align-items:center;gap:5px">
      <div style="width:10px;height:10px;background:rgba(255,92,141,0.08);border:1px solid #FF5C8D;border-radius:2px"></div>
      <span><b style="color:#FF5C8D">Video</b> — YouTube, awareness</span>
    </div>
  </div>
`

export function BreakdownCampanhas({ tipos }: Props) {
  const maxInvest = Math.max(...tipos.map(t => t.investimento), 1)

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
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)' }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500 }}>Performance por tipo de campanha</div>
          <div style={{ fontSize: 11, color: 'var(--ws-text-2)' }}>Compara investimento, CTR e ROAS por tipo</div>
        </div>
        <InfoTooltip
          title="Performance por tipo de campanha"
          description="Compara Search, Performance Max, Display e Video em investimento, CTR e ROAS. Cada tipo serve um objetivo diferente."
          diagram={BREAKDOWN_CAMPANHAS_DIAGRAM}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--ws-text-3)', marginBottom: 10, fontWeight: 500 }}>Investimento por tipo</div>
          {tipos.map(t => {
            const badge = BADGE_STYLES[t.tipo] ?? { bg: '#f0f0f0', cor: '#666' }
            return (
              <div key={t.tipo} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 10, background: badge.bg, color: badge.cor, padding: '2px 6px', borderRadius: 3, fontWeight: 500 }}>{t.label}</span>
                  <span style={{ fontSize: 11, color: 'var(--ws-text-3)' }}>{t.conversoes} conv.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 6, background: 'rgba(14,20,42,0.08)', borderRadius: 3 }}>
                    <div style={{ width: `${(t.investimento / maxInvest) * 100}%`, height: '100%', background: t.cor === '#0f2744' ? '#3E5BFF' : t.cor === '#3b6d11' ? '#0fa856' : t.cor === '#a32d2d' ? '#FF5C8D' : t.cor, borderRadius: 3 }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 500, minWidth: 70, textAlign: 'right', color: 'var(--ws-text-1)' }}>{formatarMoeda(t.investimento)}</span>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, alignContent: 'start' }}>
          {tipos.map(t => {
            const badge = BADGE_STYLES[t.tipo] ?? { bg: '#f0f0f0', cor: '#666' }
            const roasCor = t.roas > 30 ? '#0fa856' : t.roas > 15 ? '#EF9F27' : '#FF5C8D'
            return (
              <div key={t.tipo} style={{ 
                background: 'rgba(14,20,42,0.03)', 
                border: '1px solid var(--ws-glass-border)', 
                borderRadius: 'var(--ws-radius-md)', 
                padding: '10px 12px' 
              }}>
                <div style={{ fontSize: 9, background: badge.bg, color: badge.cor, padding: '2px 5px', borderRadius: 3, fontWeight: 500, display: 'inline-block', marginBottom: 8 }}>{t.label}</div>
                <div style={{ fontSize: 11, color: 'var(--ws-text-3)' }}>CTR</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ws-text-1)', marginBottom: 4 }}>{t.ctr.toFixed(2).replace('.', ',')}%</div>
                <div style={{ fontSize: 11, color: 'var(--ws-text-3)' }}>ROAS</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: roasCor }}>{t.roas.toFixed(1).replace('.', ',')}×</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
