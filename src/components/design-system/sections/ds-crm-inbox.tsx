'use client'
import { useState, useMemo, useRef, useEffect } from 'react'
import {
  ArchiveRestore,
  MoreVertical,
  Search,
  Filter,
  ArrowUpDown,
  X,
  ChevronDown,
  Tag,
  Users,
  Briefcase,
  Network,
} from 'lucide-react'

// ─── Tipos ────────────────────────────────────────────────────────────────────

type AvatarVariant = 'azul' | 'roxo' | 'verde' | 'ambar'
type Canal = 'whatsapp' | 'instagram' | 'facebook'
type EtiquetaVariant = 'indicacoes' | 'primeiro-atendimento' | 'follow-up' | 'vip' | 'urgente'
type PainelAberto = 'busca' | 'filtro' | 'ordenacao' | null
type AbaId = 'novos' | 'meus' | 'outros'
type NivelUsuario = 'admin' | 'gerente' | 'atendente'
type StatusConversa = 'novo' | 'em-atendimento' | 'concluido'

// Tipos de agente que pode estar conduzindo a conversa
type AgenteAtualTipo = 'ia-comercial' | 'ia-sdr' | 'ia-suporte' | 'humano'

interface Etiqueta {
  label: string
  variant: EtiquetaVariant
}

export interface CardConversaData {
  id: string
  nome: string
  iniciais: string
  avatarVariant: AvatarVariant
  canal: Canal
  timestamp: string
  preview: string
  badgeCount?: number
  etiquetas: Etiqueta[]
  equipe: string
  equipeVariant?: 'comercial' | 'posVenda' | 'suporte'
  ativo?: boolean
  // ── Agente atual ──────────────────────────────────
  agenteAtual: AgenteAtualTipo
  agenteLabel?: string             // nome customizado (ex: 'Agente SRD', 'Dra. Ana Lima')
  // ── Campos para filtros de aba + permissões ──
  status: StatusConversa
  responsavelId?: string       // ID do atendente responsável (undefined = não atribuído)
  responsavelNome?: string
  equipeIds: string[]          // equipes a que a conversa pertence
}

interface UsuarioAtual {
  id: string
  nome: string
  nivel: NivelUsuario
  equipeIds: string[]          // equipes do usuário
}

interface ToolbarProps {
  filtroLeitura: 'todas' | 'nao-lidas'
  setFiltroLeitura: (v: 'todas' | 'nao-lidas') => void
  painelAberto: PainelAberto
  setPainelAberto: (v: PainelAberto) => void
  ordemSelecionada: 'ultimas' | 'antigos'
  setOrdemSelecionada: (v: 'ultimas' | 'antigos') => void
  buscaTexto: string
  setBuscaTexto: (v: string) => void
  categoriaBusca: string
  setCategoriaBusca: (v: string) => void
  apenasMinhasEquipes: boolean
  setApenasMinhasEquipes: (v: boolean) => void
}

interface BarraAbasProps {
  aba: AbaId
  setAba: (v: AbaId) => void
  contagens: Record<AbaId, number>
}

// ─── Usuário atual (mock — em produção vem do auth context) ───────────────────
//
// Regras de nível:
//   admin      → vê TODAS as conversas de TODAS as equipes
//   gerente    → vê TODAS as conversas das equipes que gerencia
//   atendente  → Novos: conversas sem responsável da sua equipe
//                Meus: conversas atribuídas a ele
//                Outros: conversas da sua equipe atribuídas a outros
//
// Para testar outro nível, altere o campo `nivel` abaixo:

const USUARIO_ATUAL: UsuarioAtual = {
  id: 'ana-lima',
  nome: 'Dra. Ana Lima',
  nivel: 'atendente', // 'admin' | 'gerente' | 'atendente'
  equipeIds: ['comercial'],
}

// ─── Dados mock ───────────────────────────────────────────────────────────────

const CARDS: CardConversaData[] = [
  // ── NOVOS (sem responsável) ──────────────────────
  {
    id: 'conv-1',
    nome: 'Anthony',
    iniciais: 'AN',
    avatarVariant: 'azul',
    canal: 'whatsapp',
    timestamp: 'há 6 meses',
    preview: 'Posso saber se você...',
    badgeCount: 3,
    etiquetas: [
      { label: 'Indicações', variant: 'indicacoes' },
      { label: 'Primeiro Atendimento', variant: 'primeiro-atendimento' },
    ],
    equipe: 'Comercial',
    equipeVariant: 'comercial',
    ativo: true,
    agenteAtual: 'ia-comercial',
    status: 'novo',
    responsavelId: undefined,
    equipeIds: ['comercial'],
  },
  {
    id: 'conv-2',
    nome: 'Maria Clara',
    iniciais: 'MC',
    avatarVariant: 'roxo',
    canal: 'instagram',
    timestamp: '14:32',
    preview: 'Oi, quero saber sobre o implante',
    badgeCount: 1,
    etiquetas: [{ label: 'Primeiro Atendimento', variant: 'primeiro-atendimento' }],
    equipe: 'Comercial',
    equipeVariant: 'comercial',
    agenteAtual: 'ia-comercial',
    status: 'novo',
    responsavelId: undefined,
    equipeIds: ['comercial'],
  },
  {
    id: 'conv-3',
    nome: 'Lucas Mendes',
    iniciais: 'LM',
    avatarVariant: 'verde',
    canal: 'facebook',
    timestamp: '09:15',
    preview: 'Vocês fazem lente de contato dental?',
    badgeCount: 2,
    etiquetas: [{ label: 'Primeiro Atendimento', variant: 'primeiro-atendimento' }],
    equipe: 'Comercial',
    equipeVariant: 'comercial',
    agenteAtual: 'ia-sdr',
    status: 'novo',
    responsavelId: undefined,
    equipeIds: ['comercial'],
  },
  {
    id: 'conv-4',
    nome: 'Sandra Vieira',
    iniciais: 'SV',
    avatarVariant: 'ambar',
    canal: 'whatsapp',
    timestamp: '08:44',
    preview: 'Bom dia! Gostaria de agendar uma consulta',
    etiquetas: [{ label: 'Urgente', variant: 'urgente' }],
    equipe: 'Suporte',
    equipeVariant: 'suporte',
    agenteAtual: 'ia-suporte',
    status: 'novo',
    responsavelId: undefined,
    equipeIds: ['suporte'],
  },

  // ── MEUS (atribuídos ao usuário atual) ───────────
  {
    id: 'conv-5',
    nome: 'João Paulo',
    iniciais: 'JP',
    avatarVariant: 'verde',
    canal: 'whatsapp',
    timestamp: '11:20',
    preview: 'Tem horário pra amanhã?',
    etiquetas: [{ label: 'Follow-up', variant: 'follow-up' }],
    equipe: 'Comercial',
    equipeVariant: 'comercial',
    agenteAtual: 'humano',
    agenteLabel: 'Dra. Ana Lima',
    status: 'em-atendimento',
    responsavelId: 'ana-lima',
    responsavelNome: 'Dra. Ana Lima',
    equipeIds: ['comercial'],
  },
  {
    id: 'conv-6',
    nome: 'Carla Souza',
    iniciais: 'CS',
    avatarVariant: 'roxo',
    canal: 'whatsapp',
    timestamp: 'Ontem',
    preview: 'Obrigada pelo atendimento, doutora!',
    etiquetas: [{ label: 'VIP', variant: 'vip' }],
    equipe: 'Comercial',
    equipeVariant: 'comercial',
    agenteAtual: 'humano',
    agenteLabel: 'Dra. Ana Lima',
    status: 'em-atendimento',
    responsavelId: 'ana-lima',
    responsavelNome: 'Dra. Ana Lima',
    equipeIds: ['comercial'],
  },
  {
    id: 'conv-7',
    nome: 'Rafaela Dias',
    iniciais: 'RD',
    avatarVariant: 'azul',
    canal: 'instagram',
    timestamp: '2 dias',
    preview: 'Posso remarcar pro dia 15?',
    badgeCount: 1,
    etiquetas: [{ label: 'Primeiro Atendimento', variant: 'primeiro-atendimento' }],
    equipe: 'Comercial',
    equipeVariant: 'comercial',
    agenteAtual: 'ia-sdr',
    status: 'em-atendimento',
    responsavelId: 'ana-lima',
    responsavelNome: 'Dra. Ana Lima',
    equipeIds: ['comercial'],
  },

  // ── OUTROS (atribuídos a outros atendentes) ─────────────────
  {
    id: 'conv-8',
    nome: 'Pedro Torres',
    iniciais: 'PT',
    avatarVariant: 'azul',
    canal: 'whatsapp',
    timestamp: 'Ontem',
    preview: 'Ainda não recebi o retorno',
    etiquetas: [{ label: 'Urgente', variant: 'urgente' }],
    equipe: 'Suporte',
    equipeVariant: 'suporte',
    agenteAtual: 'humano',
    agenteLabel: 'Dr. Carlos',
    status: 'em-atendimento',
    responsavelId: 'carlos-med',
    responsavelNome: 'Dr. Carlos',
    equipeIds: ['suporte'],
  },
  {
    id: 'conv-9',
    nome: 'Fernanda Lima',
    iniciais: 'FL',
    avatarVariant: 'ambar',
    canal: 'whatsapp',
    timestamp: '3 dias',
    preview: 'Quero fazer a revisão do protocolo',
    etiquetas: [{ label: 'Follow-up', variant: 'follow-up' }],
    equipe: 'Comercial',
    equipeVariant: 'comercial',
    agenteAtual: 'ia-comercial',
    status: 'em-atendimento',
    responsavelId: 'joao-rec',
    responsavelNome: 'Dr. João',
    equipeIds: ['comercial'],
  },
  {
    id: 'conv-10',
    nome: 'Bruno Alves',
    iniciais: 'BA',
    avatarVariant: 'verde',
    canal: 'whatsapp',
    timestamp: '5 dias',
    preview: 'Preciso do laudo pra o convênio',
    etiquetas: [{ label: 'Indicações', variant: 'indicacoes' }],
    equipe: 'Comercial',
    equipeVariant: 'comercial',
    agenteAtual: 'humano',
    agenteLabel: 'Dr. João',
    status: 'em-atendimento',
    responsavelId: 'joao-rec',
    responsavelNome: 'Dr. João',
    equipeIds: ['comercial'],
  },
]

// ─── Helpers de estilo ────────────────────────────────────────────────────────

const AVATAR_STYLES: Record<AvatarVariant, { bg: string; color: string }> = {
  azul:  { bg: '#B5D4F4', color: '#0C447C' },
  roxo:  { bg: '#CECBF6', color: '#3C3489' },
  verde: { bg: '#C0DD97', color: '#27500A' },
  ambar: { bg: '#FAC775', color: '#633806' },
}

const CANAL_COLORS: Record<Canal, string> = {
  whatsapp:  '#1D9E75',
  instagram: '#993556',
  facebook:  '#185FA5',
}

const ETIQUETA_STYLES: Record<EtiquetaVariant, { bg: string; color: string }> = {
  'indicacoes':           { bg: 'rgba(59,109,17,0.12)', color: '#5a9a1f' },
  'primeiro-atendimento': { bg: 'rgba(24,95,165,0.12)', color: '#4a9ae6' },
  'follow-up':            { bg: 'rgba(99,56,6,0.12)',   color: '#c4850a' },
  'vip':                  { bg: 'rgba(60,52,137,0.12)', color: '#8b7ef8' },
  'urgente':              { bg: 'rgba(163,45,45,0.12)', color: '#e05555' },
}

const EQUIPE_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  comercial: { bg: 'rgba(24,95,165,0.12)', color: '#4a9ae6', border: 'rgba(24,95,165,0.20)' },
  posVenda:  { bg: 'rgba(60,52,137,0.12)', color: '#8b7ef8', border: 'rgba(60,52,137,0.20)' },
  suporte:   { bg: 'rgba(99,56,6,0.12)',   color: '#c4850a', border: 'rgba(99,56,6,0.20)' },
}

// Mapeamento visual por tipo de agente
const AGENTE_STYLES: Record<AgenteAtualTipo, { cor: string; icone: string; labelPadrao: string }> = {
  'ia-comercial': { cor: '#4a9ae6', icone: '🤖', labelPadrao: 'Agente Comercial' },
  'ia-sdr':       { cor: '#8b7ef8', icone: '🤖', labelPadrao: 'Agente SDR'        },
  'ia-suporte':   { cor: '#c4850a', icone: '🤖', labelPadrao: 'Agente Suporte'    },
  'humano':       { cor: '#5a9a1f', icone: '👤', labelPadrao: 'Humano'             },
}

// ─── Lógica de permissões por nível ───────────────────────────────────────────
//
// Primeira camada: filtra quais conversas o usuário pode VER.
// Segunda camada: dentro das visíveis, classifica em novos/meus/outros.

/** Filtra cards pelo nível de acesso do usuário */
function filtrarPorNivel(cards: CardConversaData[], usuario: UsuarioAtual): CardConversaData[] {
  switch (usuario.nivel) {
    case 'admin':
      // Admin vê tudo, sem restrição de equipe
      return cards
    case 'gerente':
      // Gerente vê todas as conversas das equipes que gerencia
      return cards.filter(c =>
        c.equipeIds.some(eq => usuario.equipeIds.includes(eq))
      )
    case 'atendente':
      // Atendente vê:
      //   - Conversas sem responsável da sua equipe (novos)
      //   - Conversas atribuídas a ele (meus)
      //   - Conversas da sua equipe atribuídas a outros (outros)
      return cards.filter(c =>
        c.equipeIds.some(eq => usuario.equipeIds.includes(eq)) ||
        c.responsavelId === usuario.id
      )
  }
}

/** Classifica os cards visíveis por aba */
function classificarPorAba(
  cards: CardConversaData[],
  aba: AbaId,
  userId: string,
): CardConversaData[] {
  switch (aba) {
    case 'novos':
      // Conversas novas: sem responsável atribuído
      return cards.filter(c => c.status === 'novo' && !c.responsavelId)
    case 'meus':
      // Minhas conversas: atribuídas ao usuário atual
      return cards.filter(c => c.responsavelId === userId)
    case 'outros':
      // Outros: atribuídas a outro atendente (não novos, não meus)
      return cards.filter(c =>
        c.responsavelId != null &&
        c.responsavelId !== userId
      )
  }
}

/** Conta conversas por aba (para os badges) */
function contarPorAba(cards: CardConversaData[], userId: string): Record<AbaId, number> {
  return {
    novos:  cards.filter(c => c.status === 'novo' && !c.responsavelId).length,
    meus:   cards.filter(c => c.responsavelId === userId).length,
    outros: cards.filter(c => c.responsavelId != null && c.responsavelId !== userId).length,
  }
}

/** Formata contagem para exibição (ex: 1200 → "1.2k") */
function formatarContagem(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`
  return String(n)
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function AvatarDot({ canal, parentBg }: { canal: Canal; parentBg: string }) {
  return (
    <div style={{
      position: 'absolute', bottom: -1, right: -1,
      width: 12, height: 12, borderRadius: '50%',
      background: CANAL_COLORS[canal],
      border: `2px solid ${parentBg}`,
    }} />
  )
}

function Avatar({ iniciais, variant, canal, parentBg }: {
  iniciais: string; variant: AvatarVariant; canal: Canal; parentBg: string
}) {
  const s = AVATAR_STYLES[variant]
  return (
    <div style={{ position: 'relative', flexShrink: 0, overflow: 'visible' }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: s.bg, color: s.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, fontWeight: 600,
      }}>{iniciais}</div>
      <AvatarDot canal={canal} parentBg={parentBg} />
    </div>
  )
}

function BadgeContador({ count }: { count: number }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(255,92,141,0.15)', border: '1px solid rgba(255,92,141,0.25)',
      color: '#ff5c8d', borderRadius: 9999, padding: '1px 5px',
      fontSize: 9, fontWeight: 700, minWidth: 16, lineHeight: 1.4,
    }}>{count}</span>
  )
}

function EtiquetaPill({ et }: { et: Etiqueta }) {
  const s = ETIQUETA_STYLES[et.variant]
  return (
    <span style={{
      background: s.bg, color: s.color, borderRadius: 9999,
      padding: '1px 6px', fontSize: 10, fontWeight: 500, whiteSpace: 'nowrap',
    }}>{et.label}</span>
  )
}

function EquipeTag({ label, variant }: { label: string; variant?: string }) {
  const key = variant ?? 'comercial'
  const s = EQUIPE_STYLES[key] ?? EQUIPE_STYLES.comercial
  return (
    <span style={{
      background: s.bg, color: s.color,
      border: `0.5px solid ${s.border}`,
      borderRadius: 9999, padding: '1px 6px',
      fontSize: 10, fontWeight: 500, whiteSpace: 'nowrap',
    }}>{label}</span>
  )
}

function CardConversa({ data, onSelect }: { data: CardConversaData; onSelect?: () => void }) {
  const bgCard = data.ativo ? 'var(--ws-card-active)' : 'var(--ws-glass-bg)'
  const bgHover = 'var(--ws-card-hover)'
  return (
    <div style={{
      display: 'flex', gap: 10, padding: '10px 12px',
      background: bgCard,
      borderBottom: '1px solid var(--ws-divider)',
      borderLeft: data.ativo ? '3px solid #3E5BFF' : '3px solid transparent',
      cursor: 'pointer',
      transition: 'background 120ms',
    }}
      onClick={onSelect}
      onMouseEnter={e => { if (!data.ativo) e.currentTarget.style.background = bgHover }}
      onMouseLeave={e => { if (!data.ativo) e.currentTarget.style.background = bgCard }}
    >
      <Avatar iniciais={data.iniciais} variant={data.avatarVariant} canal={data.canal} parentBg={bgCard} />
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Linha 1 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--ws-text-1)', flexShrink: 0 }}>{data.nome}</span>
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 10, color: 'var(--ws-text-3)', whiteSpace: 'nowrap' }}>{data.timestamp}</span>
          {data.badgeCount != null && <BadgeContador count={data.badgeCount} />}
        </div>
        {/* Linha 2 */}
        <div style={{
          fontSize: 11, color: 'var(--ws-text-2)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          marginBottom: 4,
        }}>{data.preview}</div>
        {/* Linha 3 — etiquetas + equipe */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
          {data.etiquetas.map(et => <EtiquetaPill key={et.label} et={et} />)}
          <EquipeTag label={data.equipe} variant={data.equipeVariant} />
        </div>
        {/* Linha 4 — agente atual */}
        {(() => {
          const ag = AGENTE_STYLES[data.agenteAtual]
          const label = data.agenteLabel ?? ag.labelPadrao
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 10 }}>{ag.icone}</span>
              <span style={{
                fontSize: 10,
                color: ag.cor,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {data.agenteAtual === 'humano' ? `Atendido por ${label}` : `Atendido por ${label}`}
              </span>
            </div>
          )
        })()}
      </div>
    </div>
  )
}

// ─── Barra de Abas (componente controlado) ────────────────────────────────────

function BarraAbas({ aba, setAba, contagens }: BarraAbasProps) {
  const ABAS: { id: AbaId; label: string; corBadge: 'red' | 'gray' }[] = [
    { id: 'novos',  label: 'Novos',  corBadge: 'red'  },
    { id: 'meus',   label: 'Meus',   corBadge: 'gray' },
    { id: 'outros', label: 'Outros', corBadge: 'gray' },
  ]

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      {/* Linha 1 — abas (pills) */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '6px 8px',
        background: 'var(--ws-glass-bg)',
        border: '1px solid var(--ws-glass-border)',
        borderRadius: 10,
        width: '100%', flexWrap: 'nowrap',
      }}>
        {ABAS.map(a => {
          const isActive = aba === a.id
          const count = contagens[a.id]
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => setAba(a.id)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '3px 10px', borderRadius: 9999, cursor: 'pointer',
                fontSize: 11, fontWeight: isActive ? 500 : 400,
                border: isActive ? '1px solid rgba(62,91,255,0.25)' : '1px solid transparent',
                background: isActive ? 'var(--ws-card-active)' : 'transparent',
                color: isActive ? '#3E5BFF' : 'var(--ws-text-3)',
                transition: 'all 120ms',
                boxShadow: isActive ? '0 2px 8px rgba(14,20,42,0.10)' : 'none',
              }}
            >
              {a.label}
              {count > 0 && (
                <span style={
                  a.corBadge === 'red'
                    ? { background: 'rgba(255,92,141,0.15)', border: '1px solid rgba(255,92,141,0.25)', color: '#ff5c8d', borderRadius: 9999, padding: '1px 5px', fontSize: 9, fontWeight: 700 }
                    : { background: 'rgba(14,20,42,0.08)', border: '1px solid rgba(14,20,42,0.15)', color: 'var(--ws-text-3)', borderRadius: 9999, padding: '1px 5px', fontSize: 9, fontWeight: 700 }
                }>{formatarContagem(count)}</span>
              )}
            </button>
          )
        })}

        <span style={{ flex: '1 1 auto' }} />

        {/* Arquivados */}
        <button
          type="button"
          title="Arquivados"
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 26, height: 26, borderRadius: 6, border: 'none',
            background: 'transparent', cursor: 'pointer', color: 'var(--ws-text-3)',
            transition: 'background 120ms',
            flexShrink: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(14,20,42,0.06)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <ArchiveRestore size={14} />
        </button>

        {/* Opções */}
        <button
          type="button"
          title="Nova conversa / Opções"
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 26, height: 26, borderRadius: 6, border: 'none',
            background: 'transparent', cursor: 'pointer', color: 'var(--ws-text-3)',
            transition: 'background 120ms',
            flexShrink: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(14,20,42,0.06)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <MoreVertical size={14} />
        </button>
      </div>
    </div>
  )
}

// ─── Constantes da Toolbar ────────────────────────────────────────────────────

const BUSCA_CATEGORIAS = [
  { id: 'abertos',    label: 'Abertos' },
  { id: 'novos',      label: 'Novos' },
  { id: 'meus',       label: 'Meus' },
  { id: 'outros',     label: 'Outros' },
  { id: 'contatos',   label: 'Contatos' },
  { id: 'grupos',     label: 'Grupos' },
  { id: 'concluidos', label: 'Concluídos' },
]

const FILTRO_ITEMS = [
  { icon: <Network size={16} />,   label: 'Canais' },
  { icon: <Tag size={16} />,       label: 'Etiquetas' },
  { icon: <Users size={16} />,     label: 'Usuários' },
  { icon: <Briefcase size={16} />, label: 'Equipes' },
]

// ─── Toolbar de Visualização (componente controlado) ──────────────────────────

function ToolbarVisualizacao({
  filtroLeitura, setFiltroLeitura,
  painelAberto, setPainelAberto,
  ordemSelecionada, setOrdemSelecionada,
  buscaTexto, setBuscaTexto,
  categoriaBusca, setCategoriaBusca,
  apenasMinhasEquipes, setApenasMinhasEquipes,
}: ToolbarProps) {

  function togglePainel(p: PainelAberto) {
    setPainelAberto(painelAberto === p ? null : p)
  }

  const iconBtnBase: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 30, height: 30, borderRadius: 8, border: 'none',
    background: 'transparent', cursor: 'pointer', color: 'var(--ws-text-3)',
    transition: 'background 120ms',
  }

  return (
    <div>
      {/* ── Linha principal ─────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '6px 8px',
        background: 'var(--ws-glass-bg)',
        border: '1px solid var(--ws-glass-border)',
        borderRadius: painelAberto === 'busca' ? '10px 10px 0 0' : 10,
        position: 'relative', zIndex: 2,
      }}>
        {/* Pills leitura */}
        {(['todas', 'nao-lidas'] as const).map(id => {
          const isActive = filtroLeitura === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => setFiltroLeitura(id)}
              style={{
                padding: '4px 12px', borderRadius: 9999, cursor: 'pointer',
                fontSize: 12, fontWeight: isActive ? 500 : 400,
                border: isActive ? '1px solid #185FA5' : '1px solid transparent',
                background: isActive ? '#185FA5' : 'transparent',
                color: isActive ? '#E6F1FB' : 'var(--ws-text-3)',
                transition: 'all 120ms',
              }}
            >{id === 'todas' ? 'Todas' : 'Não lidas'}</button>
          )
        })}

        <span style={{ flex: 1 }} />

        {/* Lupa */}
        <button
          type="button"
          title="Buscar"
          onClick={() => togglePainel('busca')}
          style={{
            ...iconBtnBase,
            background: painelAberto === 'busca' ? 'rgba(62,91,255,0.08)' : 'transparent',
            color: painelAberto === 'busca' ? '#3E5BFF' : 'var(--ws-text-3)',
          }}
          onMouseEnter={e => { if (painelAberto !== 'busca') e.currentTarget.style.background = 'rgba(14,20,42,0.06)' }}
          onMouseLeave={e => { if (painelAberto !== 'busca') e.currentTarget.style.background = 'transparent' }}
        >
          <Search size={16} />
        </button>

        {/* Filtro */}
        <button
          type="button"
          title="Filtros"
          onClick={() => togglePainel('filtro')}
          style={{
            ...iconBtnBase,
            background: painelAberto === 'filtro' ? 'rgba(62,91,255,0.08)' : 'transparent',
            color: painelAberto === 'filtro' ? 'var(--ws-blue)' : 'var(--ws-text-3)',
            border: painelAberto === 'filtro' ? '1px solid var(--ws-blue)' : 'none',
          }}
          onMouseEnter={e => { if (painelAberto !== 'filtro') e.currentTarget.style.background = 'rgba(14,20,42,0.06)' }}
          onMouseLeave={e => { if (painelAberto !== 'filtro') e.currentTarget.style.background = 'transparent' }}
        >
          <Filter size={16} />
        </button>

        {/* Ordenação */}
        <button
          type="button"
          title="Ordenar"
          onClick={() => togglePainel('ordenacao')}
          style={{
            ...iconBtnBase,
            background: painelAberto === 'ordenacao' ? 'rgba(62,91,255,0.08)' : 'transparent',
            color: painelAberto === 'ordenacao' ? '#3E5BFF' : 'var(--ws-text-3)',
          }}
          onMouseEnter={e => { if (painelAberto !== 'ordenacao') e.currentTarget.style.background = 'rgba(14,20,42,0.06)' }}
          onMouseLeave={e => { if (painelAberto !== 'ordenacao') e.currentTarget.style.background = 'transparent' }}
        >
          <ArrowUpDown size={16} />
        </button>
      </div>

      {/* ── Painel de busca (inline) ────────────────────── */}
      {painelAberto === 'busca' && (
        <div style={{
          border: '1px solid var(--ws-glass-border)', borderTop: 'none',
          borderRadius: '0 0 10px 10px',
          background: 'var(--ws-surface, #ffffff)',
          padding: 12,
        }}>
          {/* Input controlado */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: 6,
              background: 'var(--ws-glass-bg)', border: '1px solid var(--ws-divider)',
              borderRadius: 8, padding: '5px 10px',
            }}>
              <Search size={14} style={{ color: 'var(--ws-text-3)', flexShrink: 0 }} />
              <input
                value={buscaTexto}
                onChange={e => setBuscaTexto(e.target.value)}
                placeholder="Buscar conversas..."
                autoFocus
                style={{
                  flex: 1, border: 'none', background: 'transparent',
                  fontSize: 12, color: 'var(--ws-text-1)', outline: 'none',
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => { setBuscaTexto(''); setPainelAberto(null) }}
              style={{ ...iconBtnBase }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Pills de categoria (interativas) */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none', marginBottom: 16 }}>
            {BUSCA_CATEGORIAS.map(p => {
              const isActive = categoriaBusca === p.id
              return (
                <span
                  key={p.id}
                  onClick={() => setCategoriaBusca(p.id)}
                  style={{
                    padding: '3px 10px', borderRadius: 9999, fontSize: 11,
                    whiteSpace: 'nowrap', cursor: 'pointer',
                    background: isActive ? '#534AB7' : 'var(--ws-glass-bg)',
                    color: isActive ? '#EEEDFE' : 'var(--ws-text-3)',
                    border: isActive ? '1px solid #534AB7' : '1px solid transparent',
                    transition: 'all 120ms',
                  }}
                >{p.label}</span>
              )
            })}
          </div>

          {/* Estado vazio */}
          {!buscaTexto.trim() && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '16px 0' }}>
              <Search size={24} style={{ color: 'var(--ws-text-3)', opacity: 0.4 }} />
              <span style={{ fontSize: 12, color: 'var(--ws-text-3)' }}>Digite para iniciar a busca.</span>
            </div>
          )}
        </div>
      )}

      {/* ── Dropdown de ordenação ───────────────────────── */}
      {painelAberto === 'ordenacao' && (
        <div style={{
          position: 'absolute', right: 0, top: 42, zIndex: 100,
          background: 'var(--ws-surface)', border: '1px solid var(--ws-glass-border)',
          borderRadius: 10, padding: '8px 0',
          boxShadow: 'var(--ws-glass-shadow)',
          minWidth: 230,
        }}>
          <div style={{ padding: '4px 14px 8px', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ws-text-3)' }}>
            Ordenar por:
          </div>
          {([
            { id: 'ultimas' as const, label: 'Últimas interações primeiro', icon: '↕' },
            { id: 'antigos' as const, label: 'Mais antigos primeiro',       icon: '🕐' },
          ]).map(op => {
            const sel = ordemSelecionada === op.id
            return (
              <div
                key={op.id}
                onClick={() => { setOrdemSelecionada(op.id); setPainelAberto(null) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 14px', cursor: 'pointer', fontSize: 12,
                  color: 'var(--ws-text-1)',
                  transition: 'background 100ms',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(14,20,42,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: 14 }}>{op.icon}</span>
                <span style={{ flex: 1 }}>{op.label}</span>
                <div style={{
                  width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
                  background: sel ? '#185FA5' : 'transparent',
                  border: `2px solid ${sel ? '#185FA5' : 'rgba(14,20,42,0.25)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {sel && <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff' }} />}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Dropdown de filtros ─────────────────────────── */}
      {painelAberto === 'filtro' && (
        <div style={{
          position: 'absolute', right: 0, top: 42, zIndex: 110,
          width: 250,
          background: 'var(--ws-surface-2)',
          border: '1px solid var(--ws-glass-border)',
          borderRadius: 16,
          padding: 10,
          boxShadow: 'var(--ws-glass-shadow)',
          display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          {/* Toggle row */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 12px', background: 'var(--ws-surface)', borderRadius: 12,
            marginBottom: 2,
          }}>
            <span style={{ flex: 1, fontSize: 12, color: 'var(--ws-text-2)', fontWeight: 500 }}>Apenas minhas equipes</span>
            <div
              onClick={() => setApenasMinhasEquipes(!apenasMinhasEquipes)}
              style={{
                width: 32, height: 18, borderRadius: 9999,
                background: apenasMinhasEquipes ? '#185FA5' : '#D1D5DB',
                position: 'relative', cursor: 'pointer',
                transition: 'background 200ms',
              }}
            >
              <div style={{
                position: 'absolute', top: '50%',
                transform: 'translateY(-50%)',
                left: apenasMinhasEquipes ? 16 : 2,
                width: 14, height: 14, borderRadius: '50%', background: '#fff',
                boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                transition: 'left 200ms',
              }} />
            </div>
          </div>

          {/* Itens do Filtro */}
          {FILTRO_ITEMS.map(item => (
            <div
              key={item.label}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px', background: 'var(--ws-surface)', borderRadius: 12,
                cursor: 'pointer', fontSize: 13, color: 'var(--ws-text-1)',
                transition: 'background 120ms',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--ws-glass-bg-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--ws-surface)'}
            >
              <span style={{ color: 'var(--ws-text-2)', display: 'flex' }}>{item.icon}</span>
              <span style={{ flex: 1, fontWeight: 500 }}>{item.label}</span>
              <ChevronDown size={16} style={{ color: 'var(--ws-text-3)' }} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Lista integrada (reutilizável no Chat) ───────────────────────────────────
//
// CrmListaConversas é o container de estado. Centraliza:
//   1. Aba selecionada (novos / meus / outros)
//   2. Busca, filtros, ordenação
//
// Pipeline de filtragem:
//   ALL_CARDS → filtrarPorNivel → contarPorAba (badges)
//   → classificarPorAba → busca texto → leitura → equipe → ordenação
//
// Pronto para backend: substituir CARDS por dados da API e
// USUARIO_ATUAL pelo contexto de autenticação.

interface CrmListaConversasProps {
  /** ID da conversa ativa (controlado externamente, ex: pelo chat) */
  conversaAtivaId?: string
  /** Callback quando o usuário seleciona uma conversa */
  onSelectConversa?: (conversaId: string) => void
}

export function CrmListaConversas({ conversaAtivaId, onSelectConversa }: CrmListaConversasProps = {}) {
  // ─── Estado centralizado ──────────────────────────────────────
  const [aba, setAba] = useState<AbaId>('novos')
  const [filtroLeitura, setFiltroLeitura] = useState<'todas' | 'nao-lidas'>('todas')
  const [painelAberto, setPainelAberto] = useState<PainelAberto>(null)
  const [ordemSelecionada, setOrdemSelecionada] = useState<'ultimas' | 'antigos'>('antigos')
  const [buscaTexto, setBuscaTexto] = useState('')
  const [categoriaBusca, setCategoriaBusca] = useState('abertos')
  const [apenasMinhasEquipes, setApenasMinhasEquipes] = useState(false)

  // ─── Click-outside para fechar dropdowns ──────────────────────
  const toolbarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (painelAberto !== 'filtro' && painelAberto !== 'ordenacao') return

    function handleClickOutside(e: MouseEvent) {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setPainelAberto(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [painelAberto])

  // ─── Camada 1: Permissões por nível ───────────────────────────
  const cardsVisiveis = useMemo(
    () => filtrarPorNivel(CARDS, USUARIO_ATUAL),
    [], // CARDS e USUARIO_ATUAL são constantes — dependências estáveis
  )

  // ─── Contagens para badges das abas ───────────────────────────
  const contagens = useMemo(
    () => contarPorAba(cardsVisiveis, USUARIO_ATUAL.id),
    [cardsVisiveis],
  )

  // ─── Camada 2: Pipeline de filtragem ─────────────────────────
  const cardsFiltrados = useMemo(() => {
    // 1. Classificar por aba
    let resultado = classificarPorAba(cardsVisiveis, aba, USUARIO_ATUAL.id)

    // 2. Busca por texto
    if (buscaTexto.trim()) {
      const termo = buscaTexto.trim().toLowerCase()
      resultado = resultado.filter(c =>
        c.nome.toLowerCase().includes(termo) ||
        c.preview.toLowerCase().includes(termo) ||
        c.etiquetas.some(e => e.label.toLowerCase().includes(termo)) ||
        c.equipe.toLowerCase().includes(termo) ||
        (c.responsavelNome ?? '').toLowerCase().includes(termo)
      )
    }

    // 3. Filtro de leitura
    if (filtroLeitura === 'nao-lidas') {
      resultado = resultado.filter(c => c.badgeCount != null && c.badgeCount > 0)
    }

    // 4. Filtro "apenas minhas equipes"
    if (apenasMinhasEquipes) {
      resultado = resultado.filter(c =>
        c.equipeIds.some(eq => USUARIO_ATUAL.equipeIds.includes(eq))
      )
    }

    // 5. Ordenação
    if (ordemSelecionada === 'ultimas') {
      resultado.reverse()
    }

    return resultado
  }, [cardsVisiveis, aba, buscaTexto, filtroLeitura, apenasMinhasEquipes, ordemSelecionada])

  // Derivações
  const buscaAtiva = painelAberto === 'busca' && buscaTexto.trim().length > 0
  const semResultados = cardsFiltrados.length === 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* Barra de Abas (filtro por aba) */}
      <div style={{ padding: '8px 8px 4px', flexShrink: 0 }}>
        <BarraAbas aba={aba} setAba={setAba} contagens={contagens} />
      </div>

      {/* Toolbar de Visualização */}
      <div ref={toolbarRef} style={{ padding: '0 8px 4px', flexShrink: 0, position: 'relative' }}>
        <ToolbarVisualizacao
          filtroLeitura={filtroLeitura}
          setFiltroLeitura={setFiltroLeitura}
          painelAberto={painelAberto}
          setPainelAberto={setPainelAberto}
          ordemSelecionada={ordemSelecionada}
          setOrdemSelecionada={setOrdemSelecionada}
          buscaTexto={buscaTexto}
          setBuscaTexto={setBuscaTexto}
          categoriaBusca={categoriaBusca}
          setCategoriaBusca={setCategoriaBusca}
          apenasMinhasEquipes={apenasMinhasEquipes}
          setApenasMinhasEquipes={setApenasMinhasEquipes}
        />
      </div>

      {/* Cards de Conversa (filtrados) */}
      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none' }}>
        {semResultados ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 8, padding: '40px 16px',
          }}>
            <Search size={28} style={{ color: 'var(--ws-text-3)', opacity: 0.3 }} />
            <span style={{ fontSize: 13, color: 'var(--ws-text-3)', textAlign: 'center' }}>
              {buscaAtiva
                ? `Nenhum resultado para "${buscaTexto}"`
                : 'Nenhuma conversa nesta categoria'
              }
            </span>
          </div>
        ) : (
          cardsFiltrados.map(c => (
            <CardConversa
              key={c.id}
              data={{
                ...c,
                ativo: conversaAtivaId != null ? c.id === conversaAtivaId : c.ativo,
              }}
              onSelect={() => onSelectConversa?.(c.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function DSCrmInbox() {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ws-text-1)', marginBottom: 6 }}>
          💬 CRM — Inbox
        </h2>
        <p style={{ fontSize: 14, color: 'var(--ws-text-2)', lineHeight: 1.6 }}>
          Componentes de navegação e listagem de conversas do módulo CRM.
          Barra de abas, toolbar com busca/filtros/ordenação e cards de conversa.
        </p>
      </div>

      <div style={{
        background: 'var(--ws-glass-bg)', border: '1px solid var(--ws-glass-border)',
        borderRadius: 'var(--ws-radius-lg)', backdropFilter: 'blur(16px)',
        boxShadow: 'var(--ws-glass-shadow)', padding: '16px 24px',
        position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
        }} />

        {/* BARRA DE ABAS + TOOLBAR DE VISUALIZAÇÃO + CARDS DE CONVERSA */}
        <section>
          <div style={{
            maxWidth: 380,
            border: '1px solid var(--ws-glass-border)',
            borderRadius: 10,
            overflow: 'hidden',
            position: 'relative',
            height: 430,
          }}>
            <CrmListaConversas />
          </div>
        </section>

        {/* DOCUMENTAÇÃO PARA AGENTES */}
        <div style={{ borderTop: '1px solid var(--ws-divider)', paddingTop: 16, marginTop: 4 }}>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ws-text-3)', marginBottom: 12 }}>Documentação para Agentes</div>
          <pre style={{
            fontSize: 12, background: 'rgba(14,20,42,0.04)', padding: 16,
            borderRadius: 8, color: 'var(--ws-text-2)', fontFamily: 'monospace',
            overflowX: 'auto', border: '1px solid var(--ws-divider)',
          }} className="dark:bg-white/5">
{`MÓDULO: CRM — Inbox

ARQUITETURA DE PERMISSÕES:
  admin     → vê TODAS as conversas de TODAS as equipes
  gerente   → vê conversas das equipes que gerencia
  atendente → vê conversas da sua equipe + atribuídas a ele

ABAS:
  Novos   → status='novo', sem responsável atribuído
  Meus    → responsavelId = usuário logado
  Outros  → responsável ≠ usuário logado (outro atendente)

PIPELINE DE FILTRAGEM:
  1. filtrarPorNivel  → remove conversas fora do acesso
  2. contarPorAba     → calcula badges dinâmicos
  3. classificarPorAba→ filtra pela aba selecionada
  4. busca texto      → nome, preview, etiquetas, equipe
  5. filtro leitura   → todas / não-lidas (badgeCount > 0)
  6. filtro equipe    → toggle "apenas minhas equipes"
  7. ordenação        → últimas / mais antigos primeiro

ESTADO:
  CrmListaConversas → owner de todo o estado
  BarraAbas         → recebe aba, setAba, contagens
  ToolbarVisualizacao → recebe todos os filtros como props`}
          </pre>
        </div>
      </div>
    </div>
  )
}
