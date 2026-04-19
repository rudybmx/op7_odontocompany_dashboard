import type { GrupoAnunciosDetalhe } from '@/types/google-ads'
import { BadgeTipoCampanha } from '../campanhas/badge-tipo-campanha'
import { BadgeStatusGoogle } from '../campanhas/badge-status-google'
import { BadgeEstrategia } from './badge-estrategia'
import { BadgeAdStrength } from './badge-ad-strength'
import { BadgeLearning } from './badge-learning'

interface Props {
  grupo: GrupoAnunciosDetalhe
  onAbrirModal: (id: string) => void
}

function corCtr(v: number) { return v >= 5 ? '#3b6d11' : v >= 2 ? '#854f0b' : '#a32d2d' }
function corCpc(v: number) { return v <= 1 ? '#3b6d11' : v <= 3 ? '#854f0b' : '#a32d2d' }
function corRoas(v: number) { return v > 30 ? '#3b6d11' : v >= 10 ? '#854f0b' : '#a32d2d' }
function corTaxaConv(v: number) { return v >= 4 ? '#3b6d11' : v >= 2 ? '#854f0b' : '#a32d2d' }
function corCustoConv(v: number) { return v <= 20 ? '#3b6d11' : v <= 50 ? '#854f0b' : '#a32d2d' }

function fmtMoeda(v: number) {
  return `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function fmtNum(v: number) { return v.toLocaleString('pt-BR') }

function fmtImpressoes(v: number) {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1).replace('.', ',')}M`
  if (v >= 100_000) return `${(v / 1_000).toFixed(0)}K`
  return v.toLocaleString('pt-BR')
}

const tdNum: React.CSSProperties = {
  textAlign: 'right',
  padding: '8px 10px',
  fontVariantNumeric: 'tabular-nums',
  fontSize: 12,
}

export function LinhaGrupoDetalhe({ grupo, onAbrirModal }: Props) {
  const isSearch = grupo.tipoCampanha === 'SEARCH'
  const pausada = grupo.status === 'PAUSED'

  return (
    <tr
      onClick={() => onAbrirModal(grupo.id)}
      style={{
        background: grupo.emAprendizado ? 'rgba(62,91,255,0.03)' : 'transparent',
        borderBottom: '1px solid var(--ws-divider)',
        opacity: pausada ? 0.65 : 1,
        cursor: 'pointer',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(62,91,255,0.03)' }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLTableRowElement).style.background =
          grupo.emAprendizado ? 'rgba(62,91,255,0.03)' : 'transparent'
      }}
    >
      {/* Grupo */}
      <td style={{ padding: '9px 10px', minWidth: 260 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, fontWeight: 500 }}>
            {grupo.nome.length > 42 ? grupo.nome.substring(0, 42) + '...' : grupo.nome}
          </span>
          {grupo.emAprendizado && <BadgeLearning diasAprendizado={grupo.diasAprendizado} />}
          {grupo.adStrength && <BadgeAdStrength strength={grupo.adStrength} />}
        </div>
        <div style={{ fontSize: 10, color: 'var(--ws-text-3)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
          <BadgeTipoCampanha tipo={grupo.tipoCampanha} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>
            {grupo.campanhaNome}
          </span>
        </div>
      </td>

      {/* Estratégia */}
      <td style={{ padding: '9px 10px' }}>
        <BadgeEstrategia estrategia={grupo.estrategiaLance} />
        {grupo.targetCpaMicros && (
          <div style={{ fontSize: 9, color: 'var(--ws-text-3)', marginTop: 2 }}>
            Target: R${(grupo.targetCpaMicros / 1_000_000).toFixed(2).replace('.', ',')}
          </div>
        )}
        {grupo.targetRoas && (
          <div style={{ fontSize: 9, color: 'var(--ws-text-3)', marginTop: 2 }}>
            Target: {(grupo.targetRoas / 100).toFixed(0)}% ROAS
          </div>
        )}
      </td>

      {/* Status */}
      <td style={{ padding: '9px 10px' }}>
        <BadgeStatusGoogle status={grupo.status} />
      </td>

      {/* Investimento */}
      <td style={tdNum}>{fmtMoeda(grupo.investimento)}</td>

      {/* Cliques */}
      <td style={{ ...tdNum, color: grupo.cliques > 500 ? 'var(--ws-gold)' : undefined }}>
        {fmtNum(grupo.cliques)}
      </td>

      {/* Impressões */}
      <td style={{ ...tdNum, color: 'var(--ws-text-3)' }}>
        {fmtImpressoes(grupo.impressoes)}
      </td>

      {/* Conv. */}
      <td style={{ ...tdNum, color: 'var(--ws-gold)' }}>{fmtNum(grupo.conversoes)}</td>

      {/* CTR */}
      <td style={{ ...tdNum, color: corCtr(grupo.ctr) }}>
        {grupo.ctr.toFixed(1).replace('.', ',')}%
      </td>

      {/* CPC */}
      <td style={{ ...tdNum, color: corCpc(grupo.cpcMedio) }}>
        {fmtMoeda(grupo.cpcMedio)}
      </td>

      {/* ROAS */}
      <td style={{ ...tdNum, color: corRoas(grupo.roas) }}>
        {grupo.roas.toFixed(1).replace('.', ',')}×
      </td>

      {/* Taxa Conv. */}
      <td style={{ ...tdNum, color: corTaxaConv(grupo.taxaConversao) }}>
        {grupo.taxaConversao.toFixed(1).replace('.', ',')}%
      </td>

      {/* Custo/Conv. */}
      <td style={{ ...tdNum, color: corCustoConv(grupo.custoConversao) }}>
        {fmtMoeda(grupo.custoConversao)}
      </td>

      {/* QS */}
      <td style={tdNum}>
        {isSearch && grupo.qualityScoreMedio > 0 ? (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '2px 7px',
            borderRadius: 10,
            fontSize: 10,
            fontWeight: 500,
            background: grupo.qualityScoreMedio >= 7 ? '#eaf3de' : grupo.qualityScoreMedio >= 4 ? '#faeeda' : '#fcebeb',
            color: grupo.qualityScoreMedio >= 7 ? '#3b6d11' : grupo.qualityScoreMedio >= 4 ? '#854f0b' : '#a32d2d',
          }}>
            {grupo.qualityScoreMedio.toFixed(1)}/10
          </span>
        ) : (
          <span style={{ color: 'var(--ws-text-3)', fontSize: 11 }}>—</span>
        )}
      </td>

      {/* IS */}
      <td style={{ ...tdNum, minWidth: 80 }}>
        {isSearch && grupo.impressionShare !== null ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ fontSize: 10, fontWeight: 500 }}>
              {(grupo.impressionShare * 100).toFixed(0)}%
            </div>
            <div style={{ display: 'flex', height: 4, borderRadius: 2, overflow: 'hidden', background: 'rgba(14,20,42,0.08)' }}>
              <div style={{ width: `${grupo.impressionShare * 100}%`, background: '#3E5BFF' }} />
              <div style={{ width: `${(grupo.isPerdidoBudget ?? 0) * 100}%`, background: '#ef9f27' }} />
              <div style={{ width: `${(grupo.isPerdidoRank ?? 0) * 100}%`, background: '#a32d2d' }} />
            </div>
          </div>
        ) : (
          <span style={{ color: 'var(--ws-text-3)', fontSize: 11 }}>—</span>
        )}
      </td>

      {/* Keywords */}
      <td style={{ ...tdNum, color: 'var(--ws-text-3)', fontSize: 11 }}>
        {grupo.keywordsAtivas > 0 || grupo.keywordsTotal > 0
          ? `${grupo.keywordsAtivas} / ${grupo.keywordsTotal}`
          : '—'}
      </td>

      {/* Anúncios */}
      <td style={{ ...tdNum, color: 'var(--ws-text-3)', fontSize: 11 }}>
        {grupo.anunciosAtivos > 0 ? grupo.anunciosAtivos : '—'}
      </td>
    </tr>
  )
}
