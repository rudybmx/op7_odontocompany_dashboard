import type { CampanhaGoogle } from '@/types/google-ads'

interface Props {
  campanhas: CampanhaGoogle[]
}

function fmt(n: number) {
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

export function BarraResumo({ campanhas }: Props) {
  const investimento = campanhas.reduce((s, c) => s + c.investimento, 0)
  const cliques = campanhas.reduce((s, c) => s + c.cliques, 0)
  const conversoes = campanhas.reduce((s, c) => s + c.conversoes, 0)
  const impressoes = campanhas.reduce((s, c) => s + c.impressoes, 0)
  const ctr = impressoes > 0 ? (cliques / impressoes) * 100 : 0
  const valorConversoes = campanhas.reduce((s, c) => s + c.valorConversoes, 0)
  const roas = investimento > 0 ? valorConversoes / investimento : 0
  const searchCampanhas = campanhas.filter(c => c.tipo === 'SEARCH')
  const isMedia = searchCampanhas.length > 0
    ? searchCampanhas.reduce((s, c) => s + c.impressionShare, 0) / searchCampanhas.length
    : 0

  const items = [
    { label: 'Investimento', valor: `R$ ${fmt(investimento)}` },
    { label: 'Cliques', valor: fmt(cliques) },
    { label: 'Conversões', valor: fmt(conversoes) },
    { label: 'CTR', valor: `${ctr.toFixed(1).replace('.', ',')}%` },
    { label: 'ROAS', valor: `${roas.toFixed(1).replace('.', ',')}×` },
    { label: 'IS médio', valor: `${(isMedia * 100).toFixed(0)}%` },
  ]

  return (
    <div style={{
      background: 'var(--ws-glass-bg)',
      border: '1px solid var(--ws-glass-border)',
      borderRadius: 'var(--ws-radius-lg)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      boxShadow: 'var(--ws-glass-shadow)',
      padding: '12px 20px',
      marginBottom: 14,
      display: 'flex',
      flexWrap: 'wrap',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
      }} />
      {items.map((item, i) => (
        <div key={item.label} style={{
          padding: '0 16px',
          borderRight: i < items.length - 1 ? '1px solid var(--ws-divider)' : 'none',
        }}>
          <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ws-text-3)', marginBottom: 2 }}>
            {item.label}
          </div>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ws-text-1)' }}>
            {item.valor}
          </div>
        </div>
      ))}
    </div>
  )
}
