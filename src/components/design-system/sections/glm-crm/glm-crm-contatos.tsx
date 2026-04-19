'use client'
import { memo } from 'react'
import type { AvatarVariant, Canal, StageId } from './types'
import {
  AVATAR_STYLES,
  CANAL_META,
  STAGE_STYLES,
} from './constants'
import { CONTATOS_TABELA, CONTATOS_STATS } from './data'
import { Avatar } from './components/avatar'
import { CanalPill } from './components/canal-pill'
import { StagePill } from './components/stage-pill'

// ─── Sub-componentes memoizados ──────────────────────────────────────────────

const AvatarSmall = memo(function AvatarSmall({ iniciais, variant }: { iniciais: string; variant: AvatarVariant }) {
  const s = AVATAR_STYLES[variant]
  return (
    <div style={{
      width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
      background: s.bg, color: s.color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 10, fontWeight: 600,
    }}>{iniciais}</div>
  )
})

const ContatoRow = memo(function ContatoRow({ c }: { c: typeof CONTATOS_TABELA[number] }) {
  return (
    <tr
      style={{ borderBottom: '1px solid var(--ws-divider)', transition: 'background 100ms' }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(62,91,255,0.03)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <td style={{ padding: '9px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AvatarSmall iniciais={c.iniciais} variant={c.avatarVariant} />
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--ws-text-1)' }}>{c.nome}</span>
        </div>
      </td>
      <td style={{ padding: '9px 12px', fontSize: 12, color: 'var(--ws-text-2)', whiteSpace: 'nowrap' }}>
        {c.telefone}
      </td>
      <td style={{ padding: '9px 12px' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {c.canais.map(canal => <CanalPill key={canal} canal={canal} />)}
        </div>
      </td>
      <td style={{ padding: '9px 12px' }}>
        {c.campanha
          ? (
            <span style={{
              background: '#EEEDFE', color: '#3C3489',
              borderRadius: 9999, padding: '2px 8px',
              fontSize: 10, fontWeight: 500,
            }}>{c.campanhaLabel}</span>
          )
          : <span style={{ fontSize: 12, color: 'var(--ws-text-3)' }}>&mdash; org&acirc;nico</span>
        }
      </td>
      <td style={{ padding: '9px 12px' }}>
        <StagePill stage={c.stage} />
      </td>
      <td style={{ padding: '9px 12px', fontSize: 12, whiteSpace: 'nowrap' }}>
        {c.atribuidoA
          ? <span style={{ color: 'var(--ws-text-2)' }}>{c.atribuidoA}</span>
          : <span style={{ color: '#BA7517' }}>Sem atrib.</span>
        }
      </td>
      <td style={{ padding: '9px 12px', fontSize: 12, color: 'var(--ws-text-3)', whiteSpace: 'nowrap' }}>
        {c.primeiroContato}
      </td>
      <td style={{ padding: '9px 12px' }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', fontSize: 12, color: '#185FA5', fontWeight: 500 }}>
            Abrir
          </button>
          <button type="button" style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', fontSize: 12, color: 'var(--ws-text-2)' }}>
            Ver
          </button>
        </div>
      </td>
    </tr>
  )
})

const StatCards = memo(function StatCards() {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
      background: 'var(--ws-glass-bg)', border: '1px solid var(--ws-glass-border)',
      borderRadius: 10, overflow: 'hidden',
    }}>
      {CONTATOS_STATS.map((s, i) => (
        <div
          key={s.label}
          style={{
            padding: '14px 18px',
            borderLeft: i > 0 ? '0.5px solid var(--ws-divider)' : 'none',
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ws-text-3)', marginBottom: 4 }}>
            {s.label}
          </div>
          <div style={{ fontSize: 20, fontWeight: 500, color: s.cor, marginBottom: 3 }}>
            {s.valor}
          </div>
          <div style={{ fontSize: 10, color: 'var(--ws-text-2)' }}>
            {s.sub}
          </div>
        </div>
      ))}
    </div>
  )
})

const TabelaContatos = memo(function TabelaContatos() {
  const th: React.CSSProperties = {
    padding: '8px 12px', fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
    letterSpacing: '0.06em', color: 'var(--ws-text-3)', textAlign: 'left',
    background: 'rgba(62,91,255,0.04)',
    whiteSpace: 'nowrap', borderBottom: '1px solid var(--ws-divider)',
  }

  return (
    <div style={{
      background: 'var(--ws-glass-bg)', border: '1px solid var(--ws-glass-border)',
      borderRadius: 'var(--ws-radius-lg)', backdropFilter: 'blur(16px)',
      boxShadow: 'var(--ws-glass-shadow)', overflow: 'hidden',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
      }} />
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 750 }}>
          <thead>
            <tr>
              {['Contato', 'Telefone', 'Canal(is)', 'Campanha de origem', 'Stage', 'Atribu\u00eddo a', '1\u00ba contato', 'A\u00e7\u00f5es'].map(col => (
                <th key={col} style={th}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CONTATOS_TABELA.map(c => <ContatoRow key={c.nome} c={c} />)}
          </tbody>
        </table>
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px', borderTop: '1px solid var(--ws-divider)',
        fontSize: 12, color: 'var(--ws-text-3)',
      }}>
        <span>Mostrando 1&ndash;5 de 1.284 contatos</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {['Anterior', '1', '2', '3', '...', '215', 'Pr\u00f3xima'].map((p, i) => {
            const isPage = ['1', '2', '3', '215'].includes(p)
            const isActive = p === '1'
            const isNav = p === 'Anterior' || p === 'Pr\u00f3xima'
            return (
              <button
                key={`${p}-${i}`}
                type="button"
                style={{
                  padding: isNav ? '4px 10px' : '4px 8px',
                  borderRadius: 6, fontSize: 12, cursor: 'pointer',
                  border: isActive ? '1px solid rgba(62,91,255,0.30)' : '1px solid var(--ws-divider)',
                  background: isActive ? 'rgba(62,91,255,0.08)' : 'transparent',
                  color: isActive ? '#3E5BFF' : isPage ? 'var(--ws-text-2)' : 'var(--ws-text-3)',
                  fontWeight: isActive ? 500 : 400,
                  transition: 'background 100ms',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(14,20,42,0.04)' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
              >{p}</button>
            )
          })}
        </div>
      </div>
    </div>
  )
})

// ─── Componente principal ─────────────────────────────────────────────────────

export function GLMCrmContatos() {
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ws-text-1)', marginBottom: 6 }}>
          GLM CRM \u2014 Contatos
        </h2>
        <p style={{ fontSize: 14, color: 'var(--ws-text-2)', lineHeight: 1.6 }}>
          Vers\u00e3o refatorada: tipos e constantes compartilhadas, componentes memoizados, sem duplica\u00e7\u00e3o de AVATAR_STYLES / CANAL_META.
        </p>
      </div>

      <div style={{
        background: 'var(--ws-glass-bg)', border: '1px solid var(--ws-glass-border)',
        borderRadius: 'var(--ws-radius-lg)', backdropFilter: 'blur(16px)',
        boxShadow: 'var(--ws-glass-shadow)', padding: 32,
        position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', gap: 48,
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
        }} />

        <section>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ws-text-3)', marginBottom: 16 }}>
            Cards de Estat\u00edsticas \u2014 Contatos
          </div>
          <StatCards />
        </section>

        <section>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ws-text-3)', marginBottom: 16 }}>
            Linha de Contato \u2014 Tabela CRM
          </div>
          <TabelaContatos />
        </section>

        <div style={{ borderTop: '1px solid var(--ws-divider)', paddingTop: 16, marginTop: 4 }}>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ws-text-3)', marginBottom: 12 }}>Melhorias vs vers\u00e3o original</div>
          <pre style={{
            fontSize: 12, background: 'rgba(14,20,42,0.04)', padding: 16,
            borderRadius: 8, color: 'var(--ws-text-2)', fontFamily: 'monospace',
            overflowX: 'auto', border: '1px solid var(--ws-divider)',
          }} className="dark:bg-white/5">
{`REFACTORIZACOES EM CONTATOS:

1. AVATAR_STYLES, CANAL_META, STAGE_STYLES importados de constants.ts (sem duplicacao)
2. Mock data importado de data.ts (CONTATOS_TABELA, CONTATOS_STATS)
3. React.memo em AvatarSmall, ContatoRow, StatCards, TabelaContatos
4. CanalPill e StagePill importados de components/ (reuso)
5. Tipos compartilhados de types.ts`}
          </pre>
        </div>
      </div>
    </div>
  )
}