'use client'

import { InfoTooltip } from '@/components/ui/info-tooltip'
import type { CampanhaGoogle } from '@/types/google-ads'

interface Props {
  campanhas: CampanhaGoogle[]
}

const IMPRESSION_SHARE_DIAGRAM = `
  <div style="font-size:10px;color:#666;display:flex;flex-direction:column;gap:5px">
    <div style="display:flex;height:8px;border-radius:3px;overflow:hidden;gap:2px">
      <div style="flex:62;background:#3E5BFF;border-radius:2px"></div>
      <div style="flex:8;background:#ef9f27;border-radius:2px"></div>
      <div style="flex:30;background:#FF5C8D;border-radius:2px"></div>
    </div>
    <div style="display:flex;flex-direction:column;gap:3px">
      <div style="display:flex;align-items:center;gap:5px">
        <div style="width:10px;height:10px;background:#3E5BFF;border-radius:2px"></div>
        <span>Capturado = seu IS atual</span>
      </div>
      <div style="display:flex;align-items:center;gap:5px">
        <div style="width:10px;height:10px;background:#ef9f27;border-radius:2px"></div>
        <span>Perdido por orçamento → aumentar budget</span>
      </div>
      <div style="display:flex;align-items:center;gap:5px">
        <div style="width:10px;height:10px;background:#FF5C8D;border-radius:2px"></div>
        <span>Perdido por rank → melhorar QS ou bid</span>
      </div>
    </div>
  </div>
`

function BarraIS({ label, valor, cor, corTexto }: { label: string; valor: number; cor: string; corTexto: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
      <span style={{ fontSize: 10, color: 'var(--ws-text-3)', minWidth: 70 }}>{label}</span>
      <div style={{ flex: 1, height: 6, background: 'rgba(14,20,42,0.08)', borderRadius: 3 }}>
        <div style={{ width: `${Math.max(valor * 100, 0.5)}%`, height: '100%', background: cor, borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 500, color: corTexto, minWidth: 35, textAlign: 'right' }}>{(valor * 100).toFixed(0)}%</span>
    </div>
  )
}

export function ImpressionShare({ campanhas }: Props) {
  const searchCamps = campanhas.filter(c => c.tipo === 'SEARCH' && c.impressionShare > 0)

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
          <div style={{ fontSize: 13, fontWeight: 500 }}>Impression Share</div>
          <div style={{ fontSize: 11, color: 'var(--ws-text-2)' }}>Análise de perda de visibilidade por campanha</div>
        </div>
        <InfoTooltip
          title="Impression Share"
          description="% das impressões disponíveis que seus anúncios capturam. O restante é perdido por orçamento baixo ou rank insuficiente."
          diagram={IMPRESSION_SHARE_DIAGRAM}
        />
      </div>

      {searchCamps.length === 0 && (
        <div style={{ fontSize: 12, color: 'var(--ws-text-3)', textAlign: 'center', padding: '24px 0' }}>
          Nenhuma campanha Search com dados de IS no filtro atual.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {searchCamps.map(c => (
          <div key={c.id}>
            <div style={{ fontSize: 11, fontWeight: 500, marginBottom: 8, color: 'var(--ws-text-1)' }}>
              {c.nome.length > 40 ? c.nome.substring(0, 40) + '…' : c.nome}
            </div>
            <BarraIS label="Capturado" valor={c.impressionShare} cor="#3E5BFF" corTexto="var(--ws-text-1)" />
            <BarraIS label="Perdido orç." valor={c.isPeridoBudget} cor="#ef9f27" corTexto="#EF9F27" />
            <BarraIS label="Perdido rank" valor={c.isPerdidoRank} cor="#FF5C8D" corTexto="#FF5C8D" />
            <div style={{ fontSize: 10, color: 'var(--ws-text-3)', marginTop: 4 }}>Top absoluto: {(c.absoluteTopIS * 100).toFixed(0)}%</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--ws-divider)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {[
          { cor: '#3E5BFF', label: 'Capturado' },
          { cor: '#ef9f27', label: 'Perdido orçamento' },
          { cor: '#FF5C8D', label: 'Perdido rank' },
        ].map(({ cor, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 8, height: 8, background: cor, borderRadius: 1, display: 'inline-block' }} />
            <span style={{ fontSize: 10, color: 'var(--ws-text-3)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
