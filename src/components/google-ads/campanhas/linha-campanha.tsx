import { ChevronRight } from 'lucide-react'
import type { CampanhaGoogle, GrupoAnuncios } from '@/types/google-ads'
import { BadgeTipoCampanha } from './badge-tipo-campanha'
import { BadgeStatusGoogle } from './badge-status-google'

interface Props {
  campanha: CampanhaGoogle
  grupos: GrupoAnuncios[]
  expandido: boolean
  onToggle: () => void
}

function corCtr(v: number) { return v >= 5 ? '#3b6d11' : v >= 2 ? '#854f0b' : '#a32d2d' }
function corCpc(v: number) { return v <= 1 ? '#3b6d11' : v <= 3 ? '#854f0b' : '#a32d2d' }
function corRoas(v: number) { return v > 30 ? '#3b6d11' : v >= 10 ? '#854f0b' : '#a32d2d' }
function corTaxaConv(v: number) { return v >= 4 ? '#3b6d11' : v >= 2 ? '#854f0b' : '#a32d2d' }
function corCustoConv(v: number) { return v <= 20 ? '#3b6d11' : v <= 50 ? '#854f0b' : '#a32d2d' }

function fmtMoeda(v: number) {
  return `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function fmtNum(v: number) {
  return v.toLocaleString('pt-BR')
}

function fmtImpressoes(v: number) {
  if (v >= 100000) return `${(v / 1000).toFixed(0)}K`
  return v.toLocaleString('pt-BR')
}

const tdNum: React.CSSProperties = {
  textAlign: 'right',
  padding: '9px 10px',
  fontVariantNumeric: 'tabular-nums',
  fontSize: 12,
}

export function LinhaCampanha({ campanha, grupos, expandido, onToggle }: Props) {
  const isTipoComQS = campanha.tipo === 'SEARCH'
  const pausada = campanha.status === 'PAUSED'

  return (
    <tr
      style={{
        background: expandido ? 'rgba(62,91,255,0.03)' : 'transparent',
        borderBottom: '1px solid var(--ws-divider)',
        opacity: pausada ? 0.65 : 1,
        cursor: 'default',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(62,91,255,0.03)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = expandido ? 'rgba(62,91,255,0.03)' : 'transparent' }}
    >
      {/* Expand toggle */}
      <td style={{ width: 32, paddingLeft: 8 }}>
        <button
          onClick={onToggle}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ws-text-3)', display: 'flex', alignItems: 'center' }}
        >
          <ChevronRight size={14} style={{
            transform: expandido ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 150ms ease',
          }} />
        </button>
      </td>

      {/* Nome */}
      <td style={{ padding: '9px 10px', minWidth: 280 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <BadgeTipoCampanha tipo={campanha.tipo} />
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--ws-text-1)' }}>
            {campanha.nome.length > 45 ? campanha.nome.substring(0, 45) + '...' : campanha.nome}
          </span>
        </div>
        <div style={{ fontSize: 10, color: 'var(--ws-text-3)', marginTop: 2 }}>
          {grupos.length} grupo{grupos.length !== 1 ? 's' : ''} de anúncios
        </div>
      </td>

      {/* Status */}
      <td style={{ padding: '9px 10px' }}>
        <BadgeStatusGoogle status={campanha.status} />
      </td>

      {/* Investimento */}
      <td style={tdNum}>{fmtMoeda(campanha.investimento)}</td>

      {/* Cliques */}
      <td style={{ ...tdNum, color: campanha.cliques > 1000 ? 'var(--ws-gold)' : undefined }}>
        {fmtNum(campanha.cliques)}
      </td>

      {/* Impressões */}
      <td style={{ ...tdNum, color: 'var(--ws-text-3)' }}>
        {fmtImpressoes(campanha.impressoes)}
      </td>

      {/* Conv. */}
      <td style={{ ...tdNum, color: 'var(--ws-gold)' }}>{fmtNum(campanha.conversoes)}</td>

      {/* CTR */}
      <td style={{ ...tdNum, color: corCtr(campanha.ctr) }}>
        {campanha.ctr.toFixed(1).replace('.', ',')}%
      </td>

      {/* CPC */}
      <td style={{ ...tdNum, color: corCpc(campanha.cpcMedio) }}>
        {fmtMoeda(campanha.cpcMedio)}
      </td>

      {/* ROAS */}
      <td style={{ ...tdNum, color: corRoas(campanha.roas) }}>
        {campanha.roas.toFixed(1).replace('.', ',')}×
      </td>

      {/* Taxa Conv. */}
      <td style={{ ...tdNum, color: corTaxaConv(campanha.taxaConversao) }}>
        {campanha.taxaConversao.toFixed(1).replace('.', ',')}%
      </td>

      {/* Custo/Conv. */}
      <td style={{ ...tdNum, color: corCustoConv(campanha.custoConversao) }}>
        {fmtMoeda(campanha.custoConversao)}
      </td>

      {/* QS */}
      <td style={tdNum}>
        {isTipoComQS ? (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 3,
            padding: '2px 7px',
            borderRadius: 10,
            fontSize: 10,
            fontWeight: 500,
            background: campanha.qualityScoreMedio >= 7 ? '#eaf3de' : campanha.qualityScoreMedio >= 4 ? '#faeeda' : '#fcebeb',
            color: campanha.qualityScoreMedio >= 7 ? '#3b6d11' : campanha.qualityScoreMedio >= 4 ? '#854f0b' : '#a32d2d',
          }}>
            {campanha.qualityScoreMedio.toFixed(1)}/10
          </span>
        ) : (
          <span style={{ color: 'var(--ws-text-3)', fontSize: 11 }}>—</span>
        )}
      </td>

      {/* IS */}
      <td style={{ ...tdNum, minWidth: 80 }}>
        {isTipoComQS ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ fontSize: 10, fontWeight: 500 }}>
              {(campanha.impressionShare * 100).toFixed(0)}%
            </div>
            <div style={{ display: 'flex', height: 4, borderRadius: 2, overflow: 'hidden', background: 'rgba(14,20,42,0.08)' }}>
              <div style={{ width: `${campanha.impressionShare * 100}%`, background: '#3E5BFF' }} />
              <div style={{ width: `${campanha.isPeridoBudget * 100}%`, background: '#ef9f27' }} />
              <div style={{ width: `${campanha.isPerdidoRank * 100}%`, background: '#a32d2d' }} />
            </div>
          </div>
        ) : (
          <span style={{ color: 'var(--ws-text-3)', fontSize: 11 }}>—</span>
        )}
      </td>
    </tr>
  )
}
