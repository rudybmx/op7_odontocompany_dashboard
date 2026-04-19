import { FolderOpen } from 'lucide-react'
import type { GrupoAnuncios, TipoCampanha } from '@/types/google-ads'
import { BadgeStatusGoogle } from './badge-status-google'

interface Props {
  grupo: GrupoAnuncios
  tipo: TipoCampanha
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
  if (v >= 100000) return `${(v / 1000).toFixed(0)}K`
  return v.toLocaleString('pt-BR')
}

const tdNum: React.CSSProperties = {
  textAlign: 'right',
  padding: '6px 10px',
  fontVariantNumeric: 'tabular-nums',
  fontSize: 12,
}

export function LinhaGrupo({ grupo, tipo }: Props) {
  const isTipoComQS = tipo === 'SEARCH'
  const pausada = grupo.status === 'PAUSED'

  return (
    <tr
      style={{
        background: 'rgba(62,91,255,0.02)',
        borderBottom: '1px solid var(--ws-divider)',
        opacity: pausada ? 0.65 : 1,
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(62,91,255,0.03)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(62,91,255,0.02)' }}
    >
      {/* Espaço do expand (sem botão) */}
      <td style={{ width: 32 }} />

      {/* Nome indentado */}
      <td style={{ padding: '6px 10px', paddingLeft: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <FolderOpen size={12} style={{ color: 'var(--ws-text-3)', flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--ws-text-1)' }}>
            {grupo.nome.length > 45 ? grupo.nome.substring(0, 45) + '...' : grupo.nome}
          </span>
        </div>
        <div style={{ fontSize: 9, color: 'var(--ws-text-3)', marginTop: 1, paddingLeft: 17 }}>
          {grupo.keywordsAtivas > 0 ? `${grupo.keywordsAtivas} keywords` : 'Asset Group'} · Grupo
        </div>
      </td>

      {/* Status */}
      <td style={{ padding: '6px 10px' }}>
        <BadgeStatusGoogle status={grupo.status} />
      </td>

      {/* Investimento */}
      <td style={tdNum}>{fmtMoeda(grupo.investimento)}</td>

      {/* Cliques */}
      <td style={{ ...tdNum, color: grupo.cliques > 1000 ? 'var(--ws-gold)' : undefined }}>
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
        {isTipoComQS && grupo.qualityScoreMedio > 0 ? (
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
      <td style={tdNum}>
        <span style={{ color: 'var(--ws-text-3)', fontSize: 11 }}>—</span>
      </td>
    </tr>
  )
}
