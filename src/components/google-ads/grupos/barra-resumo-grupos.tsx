import type { GrupoAnunciosDetalhe } from '@/types/google-ads'

interface Props {
  grupos: GrupoAnunciosDetalhe[]
}

export function BarraResumoGrupos({ grupos: g }: Props) {
  const ativos = g.filter(x => x.status === 'ENABLED').length
  const conversoes = g.reduce((s, x) => s + x.conversoes, 0)
  const investimento = g.reduce((s, x) => s + x.investimento, 0)
  const valorConversoes = g.reduce((s, x) => s + x.valorConversoes, 0)
  const roas = investimento > 0 ? valorConversoes / investimento : 0
  const searchGrupos = g.filter(x => x.qualityScoreMedio > 0)
  const qsMedio = searchGrupos.length > 0
    ? searchGrupos.reduce((s, x) => s + x.qualityScoreMedio, 0) / searchGrupos.length
    : 0
  const emAprendizado = g.filter(x => x.emAprendizado).length

  const items = [
    { label: 'Grupos ativos', valor: String(ativos) },
    { label: 'Conv. totais', valor: conversoes.toLocaleString('pt-BR') },
    { label: 'ROAS médio', valor: `${roas.toFixed(1).replace('.', ',')}×` },
    { label: 'QS médio', valor: qsMedio > 0 ? qsMedio.toFixed(1).replace('.', ',') : '—' },
    { label: 'Em aprendizado', valor: String(emAprendizado), destaque: emAprendizado > 0 },
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
          <div style={{
            fontSize: 13,
            fontWeight: 500,
            color: item.destaque ? '#EF9F27' : 'var(--ws-text-1)',
          }}>
            {item.valor}
          </div>
        </div>
      ))}
    </div>
  )
}
