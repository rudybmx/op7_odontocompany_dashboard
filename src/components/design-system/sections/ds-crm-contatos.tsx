'use client'

// ─── Tipos ────────────────────────────────────────────────────────────────────

type AvatarVariant = 'azul' | 'roxo' | 'verde' | 'ambar'
type Canal = 'whatsapp' | 'instagram' | 'facebook'
type Stage = 'novo' | 'contato' | 'qualificado' | 'proposta' | 'fechado' | 'perdido'

interface ContatoData {
  nome: string
  iniciais: string
  avatarVariant: AvatarVariant
  telefone: string
  canais: Canal[]
  campanha?: string
  campanhaLabel?: string
  stage: Stage
  atribuidoA?: string
  primeiroContato: string
}

// ─── Dados mock ───────────────────────────────────────────────────────────────

const CONTATOS: ContatoData[] = [
  {
    nome: 'Maria Clara',
    iniciais: 'MC',
    avatarVariant: 'azul',
    telefone: '+55 41 99999-0001',
    canais: ['whatsapp'],
    campanha: 'Oral Sin · Video',
    campanhaLabel: 'Oral Sin · Video',
    stage: 'qualificado',
    atribuidoA: 'Fernanda N.',
    primeiroContato: '12 abr',
  },
  {
    nome: 'Rafael Silva',
    iniciais: 'RS',
    avatarVariant: 'roxo',
    telefone: '+55 11 98888-0002',
    canais: ['instagram'],
    campanha: 'ODC · Consulta',
    campanhaLabel: 'ODC · Consulta',
    stage: 'contato',
    atribuidoA: 'Carlos M.',
    primeiroContato: '12 abr',
  },
  {
    nome: 'João Paulo',
    iniciais: 'JP',
    avatarVariant: 'verde',
    telefone: '+55 41 97777-0003',
    canais: ['whatsapp', 'facebook'],
    campanha: 'HS · Promoção',
    campanhaLabel: 'HS · Promoção',
    stage: 'proposta',
    atribuidoA: 'Fernanda N.',
    primeiroContato: '10 abr',
  },
  {
    nome: 'Ana Lima',
    iniciais: 'AL',
    avatarVariant: 'ambar',
    telefone: '+55 21 96666-0004',
    canais: ['facebook'],
    campanha: undefined,
    stage: 'fechado',
    atribuidoA: 'Carlos M.',
    primeiroContato: '08 abr',
  },
  {
    nome: 'Beatriz F.',
    iniciais: 'BF',
    avatarVariant: 'azul',
    telefone: '+55 41 94444-0006',
    canais: ['instagram', 'whatsapp'],
    campanha: undefined,
    stage: 'novo',
    atribuidoA: undefined,
    primeiroContato: '12 abr',
  },
]

// ─── Helpers de estilo ────────────────────────────────────────────────────────

const AVATAR_STYLES: Record<AvatarVariant, { bg: string; color: string }> = {
  azul:  { bg: '#B5D4F4', color: '#0C447C' },
  roxo:  { bg: '#CECBF6', color: '#3C3489' },
  verde: { bg: '#C0DD97', color: '#27500A' },
  ambar: { bg: '#FAC775', color: '#633806' },
}

const CANAL_META: Record<Canal, { label: string; bg: string; color: string }> = {
  whatsapp:  { label: 'WA', bg: 'rgba(29,158,117,0.12)', color: '#1D9E75' },
  instagram: { label: 'IG', bg: 'rgba(153,53,86,0.12)',  color: '#993556' },
  facebook:  { label: 'FB', bg: 'rgba(24,95,165,0.12)',  color: '#185FA5' },
}

const STAGE_STYLES: Record<Stage, { bg: string; border: string; color: string; label: string }> = {
  novo:        { bg: 'rgba(14,20,42,0.08)',   border: 'rgba(14,20,42,0.15)',   color: 'var(--ws-text-2)', label: 'Novo' },
  contato:     { bg: 'rgba(62,91,255,0.12)',  border: 'rgba(62,91,255,0.25)',  color: '#2340c4',          label: 'Contato' },
  qualificado: { bg: '#B5D4F4',               border: '#85B7EB',               color: '#0C447C',          label: 'Qualificado' },
  proposta:    { bg: 'rgba(15,168,86,0.12)',  border: 'rgba(15,168,86,0.25)',  color: '#007a40',          label: 'Proposta' },
  fechado:     { bg: '#EAF3DE',               border: 'rgba(59,109,17,0.25)', color: '#3B6D11',           label: 'Fechado' },
  perdido:     { bg: 'rgba(255,92,141,0.12)', border: 'rgba(255,92,141,0.25)', color: '#c2004f',          label: 'Perdido' },
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function AvatarSmall({ iniciais, variant }: { iniciais: string; variant: AvatarVariant }) {
  const s = AVATAR_STYLES[variant]
  return (
    <div style={{
      width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
      background: s.bg, color: s.color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 10, fontWeight: 600,
    }}>{iniciais}</div>
  )
}

function CanalPill({ canal }: { canal: Canal }) {
  const m = CANAL_META[canal]
  return (
    <span style={{
      background: m.bg, color: m.color,
      borderRadius: 9999, padding: '1px 6px',
      fontSize: 10, fontWeight: 600,
    }}>{m.label}</span>
  )
}

function StagePill({ stage }: { stage: Stage }) {
  const s = STAGE_STYLES[stage]
  return (
    <span style={{
      background: s.bg, border: `1px solid ${s.border}`, color: s.color,
      borderRadius: 9999, padding: '2px 8px',
      fontSize: 10, fontWeight: 600,
    }}>{s.label}</span>
  )
}

// ─── Cards de Estatísticas ────────────────────────────────────────────────────

const STATS = [
  { label: 'Total de contatos',  valor: '1.284', sub: '+38 esta semana',       cor: 'var(--ws-text-1)' },
  { label: 'Leads ativos',       valor: '312',   sub: 'em acompanhamento',      cor: '#185FA5' },
  { label: 'Sem atribuição',     valor: '47',    sub: 'aguardando agente',       cor: '#BA7517' },
  { label: 'Fechados este mês',  valor: '28',    sub: 'taxa 9,0%',              cor: '#3B6D11' },
]

function StatCards() {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
      background: 'var(--ws-glass-bg)', border: '1px solid var(--ws-glass-border)',
      borderRadius: 10, overflow: 'hidden',
    }}>
      {STATS.map((s, i) => (
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
}

// ─── Tabela de Contatos ───────────────────────────────────────────────────────

const th: React.CSSProperties = {
  padding: '8px 12px', fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
  letterSpacing: '0.06em', color: 'var(--ws-text-3)', textAlign: 'left',
  background: 'rgba(62,91,255,0.04)',
  whiteSpace: 'nowrap', borderBottom: '1px solid var(--ws-divider)',
}

function ContatoRow({ c }: { c: ContatoData }) {
  return (
    <tr
      style={{ borderBottom: '1px solid var(--ws-divider)', transition: 'background 100ms' }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(62,91,255,0.03)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {/* Contato */}
      <td style={{ padding: '9px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AvatarSmall iniciais={c.iniciais} variant={c.avatarVariant} />
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--ws-text-1)' }}>{c.nome}</span>
        </div>
      </td>

      {/* Telefone */}
      <td style={{ padding: '9px 12px', fontSize: 12, color: 'var(--ws-text-2)', whiteSpace: 'nowrap' }}>
        {c.telefone}
      </td>

      {/* Canais */}
      <td style={{ padding: '9px 12px' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {c.canais.map(canal => <CanalPill key={canal} canal={canal} />)}
        </div>
      </td>

      {/* Campanha */}
      <td style={{ padding: '9px 12px' }}>
        {c.campanha
          ? (
            <span style={{
              background: '#EEEDFE', color: '#3C3489',
              borderRadius: 9999, padding: '2px 8px',
              fontSize: 10, fontWeight: 500,
            }}>{c.campanhaLabel}</span>
          )
          : (
            <span style={{ fontSize: 12, color: 'var(--ws-text-3)' }}>— orgânico</span>
          )
        }
      </td>

      {/* Stage */}
      <td style={{ padding: '9px 12px' }}>
        <StagePill stage={c.stage} />
      </td>

      {/* Atribuído a */}
      <td style={{ padding: '9px 12px', fontSize: 12, whiteSpace: 'nowrap' }}>
        {c.atribuidoA
          ? <span style={{ color: 'var(--ws-text-2)' }}>{c.atribuidoA}</span>
          : <span style={{ color: '#BA7517' }}>Sem atrib.</span>
        }
      </td>

      {/* 1º contato */}
      <td style={{ padding: '9px 12px', fontSize: 12, color: 'var(--ws-text-3)', whiteSpace: 'nowrap' }}>
        {c.primeiroContato}
      </td>

      {/* Ações */}
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
}

function TabelaContatos() {
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
              {['Contato', 'Telefone', 'Canal(is)', 'Campanha de origem', 'Stage', 'Atribuído a', '1º contato', 'Ações'].map(col => (
                <th key={col} style={th}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CONTATOS.map(c => <ContatoRow key={c.nome} c={c} />)}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px', borderTop: '1px solid var(--ws-divider)',
        fontSize: 12, color: 'var(--ws-text-3)',
      }}>
        <span>Mostrando 1–5 de 1.284 contatos</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {['Anterior', '1', '2', '3', '...', '215', 'Próxima'].map((p, i) => {
            const isPage = ['1','2','3','215'].includes(p)
            const isActive = p === '1'
            const isNav = p === 'Anterior' || p === 'Próxima'
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
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function DSCrmContatos() {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ws-text-1)', marginBottom: 6 }}>
          👥 CRM — Contatos
        </h2>
        <p style={{ fontSize: 14, color: 'var(--ws-text-2)', lineHeight: 1.6 }}>
          Cards de estatísticas e tabela de listagem de contatos com suporte a múltiplos canais,
          stages de pipeline e atribuição de agentes.
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

        {/* SEÇÃO 1 — Cards de Estatísticas */}
        <section>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ws-text-3)', marginBottom: 16 }}>
            Cards de Estatísticas — Contatos
          </div>
          <StatCards />
        </section>

        {/* SEÇÃO 2 — Tabela */}
        <section>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ws-text-3)', marginBottom: 16 }}>
            Linha de Contato — Tabela CRM
          </div>
          <TabelaContatos />
        </section>

        {/* DOCUMENTAÇÃO PARA AGENTES */}
        <div style={{ borderTop: '1px solid var(--ws-divider)', paddingTop: 16, marginTop: 4 }}>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ws-text-3)', marginBottom: 12 }}>Documentação para Agentes</div>
          <pre style={{
            fontSize: 12, background: 'rgba(14,20,42,0.04)', padding: 16,
            borderRadius: 8, color: 'var(--ws-text-2)', fontFamily: 'monospace',
            overflowX: 'auto', border: '1px solid var(--ws-divider)',
          }} className="dark:bg-white/5">
{`MÓDULO: CRM — Contatos
COMPONENTES: StatCard, CanalPill, StagePill, ContatoRow

ContatoRow props:
  nome: string
  iniciais: string
  avatarVariant: 'azul' | 'roxo' | 'verde' | 'ambar'
  telefone: string
  canais: Canal[]
  campanha?: string (undefined = orgânico)
  stage: Stage
  atribuidoA?: string (undefined = sem atribuição)
  primeiroContato: string

Canal: 'whatsapp' | 'instagram' | 'facebook'
Stage: 'novo' | 'contato' | 'qualificado' | 'proposta' | 'fechado' | 'perdido'

Regra multi-canal: um contato é um registro só.
Nunca duplicar contato por canal — exibir múltiplas CanalPills na mesma linha.`}
          </pre>
        </div>
      </div>
    </div>
  )
}
