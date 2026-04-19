'use client'
import { useState, useMemo, useRef, useEffect, useCallback, memo } from 'react'
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
import type {
  CardConversaData,
  UsuarioAtual,
  AbaId,
  PainelAberto,
  AgenteAtualTipo,
} from './types'
import {
  AVATAR_STYLES,
  CANAL_COLORS,
  ETIQUETA_STYLES,
  EQUIPE_STYLES,
  AGENTE_STYLES,
  BUSCA_CATEGORIAS,
  FILTRO_ITEMS,
} from './constants'
import { CARDS_INBOX, USUARIO_ATUAL } from './data'
import { useDebouncedValue } from './hooks/use-debounced-value'
import { Avatar } from './components/avatar'
import { BadgeContador } from './components/badge-contador'
import { EtiquetaPill } from './components/etiqueta-pill'
import { EquipeTag } from './components/equipe-tag'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function filtrarPorNivel(cards: CardConversaData[], usuario: UsuarioAtual): CardConversaData[] {
  switch (usuario.nivel) {
    case 'admin':
      return cards
    case 'gerente':
      return cards.filter(c => c.equipeIds.some(eq => usuario.equipeIds.includes(eq)))
    case 'atendente':
      return cards.filter(c =>
        c.equipeIds.some(eq => usuario.equipeIds.includes(eq)) ||
        c.responsavelId === usuario.id
      )
  }
}

function classificarPorAba(cards: CardConversaData[], aba: AbaId, userId: string): CardConversaData[] {
  switch (aba) {
    case 'novos':
      return cards.filter(c => c.status === 'novo' && !c.responsavelId)
    case 'meus':
      return cards.filter(c => c.responsavelId === userId)
    case 'outros':
      return cards.filter(c => c.responsavelId != null && c.responsavelId !== userId)
  }
}

function contarPorAba(cards: CardConversaData[], userId: string): Record<AbaId, number> {
  return {
    novos: cards.filter(c => c.status === 'novo' && !c.responsavelId).length,
    meus: cards.filter(c => c.responsavelId === userId).length,
    outros: cards.filter(c => c.responsavelId != null && c.responsavelId !== userId).length,
  }
}

function formatarContagem(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`
  return String(n)
}

// ─── Memoized sub-components ──────────────────────────────────────────────────

const CardConversa = memo(function CardConversa({
  data,
  onSelect,
}: {
  data: CardConversaData
  onSelect?: () => void
}) {
  const bgCard = data.ativo ? 'var(--ws-card-active)' : 'var(--ws-glass-bg)'
  const ag = AGENTE_STYLES[data.agenteAtual]
  const label = data.agenteLabel ?? ag.labelPadrao

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Conversa com ${data.nome}`}
      onClick={onSelect}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onSelect?.() }}
      style={{
        display: 'flex', gap: 10, padding: '10px 12px',
        background: bgCard,
        borderBottom: '1px solid var(--ws-divider)',
        borderLeft: data.ativo ? '3px solid #3E5BFF' : '3px solid transparent',
        cursor: 'pointer',
        transition: 'background 120ms',
      }}
      onMouseEnter={e => { if (!data.ativo) e.currentTarget.style.background = 'var(--ws-card-hover)' }}
      onMouseLeave={e => { if (!data.ativo) e.currentTarget.style.background = bgCard }}
    >
      <Avatar iniciais={data.iniciais} variant={data.avatarVariant} canal={data.canal} parentBg={bgCard} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--ws-text-1)', flexShrink: 0 }}>{data.nome}</span>
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 10, color: 'var(--ws-text-3)', whiteSpace: 'nowrap' }}>{data.timestamp}</span>
          {data.badgeCount != null && <BadgeContador count={data.badgeCount} />}
        </div>
        <div style={{
          fontSize: 11, color: 'var(--ws-text-2)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          marginBottom: 4,
        }}>{data.preview}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
          {data.etiquetas.map(et => <EtiquetaPill key={et.label} et={et} />)}
          <EquipeTag label={data.equipe} variant={data.equipeVariant} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 10 }}>{ag.icone === 'robot' ? '\uD83E\uDD16' : '\uD83D\uDC64'}</span>
          <span style={{
            fontSize: 10,
            color: ag.cor,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            Atendido por {label}
          </span>
        </div>
      </div>
    </div>
  )
})

const BarraAbas = memo(function BarraAbas({
  aba,
  setAba,
  contagens,
}: {
  aba: AbaId
  setAba: (v: AbaId) => void
  contagens: Record<AbaId, number>
}) {
  const ABAS: { id: AbaId; label: string; }[] = [
    { id: 'novos', label: 'Novos' },
    { id: 'meus', label: 'Meus' },
    { id: 'outros', label: 'Outros' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
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
                  a.id === 'novos'
                    ? { background: 'rgba(255,92,141,0.15)', border: '1px solid rgba(255,92,141,0.25)', color: '#ff5c8d', borderRadius: 9999, padding: '1px 5px', fontSize: 9, fontWeight: 700 }
                    : { background: 'rgba(14,20,42,0.08)', border: '1px solid rgba(14,20,42,0.15)', color: 'var(--ws-text-3)', borderRadius: 9999, padding: '1px 5px', fontSize: 9, fontWeight: 700 }
                }>{formatarContagem(count)}</span>
              )}
            </button>
          )
        })}
        <span style={{ flex: '1 1 auto' }} />
        <button
          type="button"
          title="Arquivados"
          aria-label="Arquivados"
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 26, height: 26, borderRadius: 6, border: 'none',
            background: 'transparent', cursor: 'pointer', color: 'var(--ws-text-3)',
            transition: 'background 120ms', flexShrink: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(14,20,42,0.06)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <ArchiveRestore size={14} />
        </button>
        <button
          type="button"
          title="Nova conversa"
          aria-label="Op\u00e7\u00f5es"
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 26, height: 26, borderRadius: 6, border: 'none',
            background: 'transparent', cursor: 'pointer', color: 'var(--ws-text-3)',
            transition: 'background 120ms', flexShrink: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(14,20,42,0.06)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <MoreVertical size={14} />
        </button>
      </div>
    </div>
  )
})

// ─── Toolbar ──────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  network: Network,
  tag: Tag,
  users: Users,
  briefcase: Briefcase,
}

const ToolbarVisualizacao = memo(function ToolbarVisualizacao({
  filtroLeitura, setFiltroLeitura,
  painelAberto, setPainelAberto,
  ordemSelecionada, setOrdemSelecionada,
  buscaTexto, setBuscaTexto,
  categoriaBusca, setCategoriaBusca,
  apenasMinhasEquipes, setApenasMinhasEquipes,
}: {
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
}) {
  const togglePainel = useCallback((p: PainelAberto) => {
    setPainelAberto(painelAberto === p ? null : p)
  }, [painelAberto, setPainelAberto])

  const iconBtnBase: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 30, height: 30, borderRadius: 8, border: 'none',
    background: 'transparent', cursor: 'pointer', color: 'var(--ws-text-3)',
    transition: 'background 120ms',
  }

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '6px 8px',
        background: 'var(--ws-glass-bg)',
        border: '1px solid var(--ws-glass-border)',
        borderRadius: painelAberto === 'busca' ? '10px 10px 0 0' : 10,
        position: 'relative', zIndex: 2,
      }}>
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
            >{id === 'todas' ? 'Todas' : 'N\u00e3o lidas'}</button>
          )
        })}
        <span style={{ flex: 1 }} />
        <button
          type="button"
          title="Buscar"
          aria-label="Buscar conversas"
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
        <button
          type="button"
          title="Filtros"
          aria-label="Filtros"
          onClick={() => togglePainel('filtro')}
          style={{
            ...iconBtnBase,
            background: painelAberto === 'filtro' ? 'rgba(62,91,255,0.08)' : 'transparent',
            color: painelAberto === 'filtro' ? '#3E5BFF' : 'var(--ws-text-3)',
            border: painelAberto === 'filtro' ? '1px solid #3E5BFF' : 'none',
          }}
        >
          <Filter size={16} />
        </button>
        <button
          type="button"
          title="Ordenar"
          aria-label="Ordenar"
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

      {painelAberto === 'busca' && (
        <div style={{
          border: '1px solid var(--ws-glass-border)', borderTop: 'none',
          borderRadius: '0 0 10px 10px',
          background: 'var(--ws-surface, #ffffff)',
          padding: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: 6,
              background: 'var(--ws-glass-bg)', border: '1px solid var(--ws-divider)',
              borderRadius: 8, padding: '5px 10px',
            }}>
              <Search size={14} color="var(--ws-text-3)" />
              <input
                value={buscaTexto}
                onChange={e => setBuscaTexto(e.target.value)}
                placeholder="Buscar conversas..."
                aria-label="Buscar conversas"
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
              aria-label="Fechar busca"
              style={iconBtnBase}
            >
              <X size={16} />
            </button>
          </div>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none', marginBottom: 16 }}>
            {BUSCA_CATEGORIAS.map(p => {
              const isActive = categoriaBusca === p.id
              return (
                <span
                  key={p.id}
                  onClick={() => setCategoriaBusca(p.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter') setCategoriaBusca(p.id) }}
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
          {!buscaTexto.trim() && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '16px 0' }}>
              <Search size={24} style={{ color: 'var(--ws-text-3)', opacity: 0.4 }} />
              <span style={{ fontSize: 12, color: 'var(--ws-text-3)' }}>Digite para iniciar a busca.</span>
            </div>
          )}
        </div>
      )}

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
            { id: 'ultimas' as const, label: '\u00daltimas intera\u00e7\u00f5es primeiro', icon: '\u21c5' },
            { id: 'antigos' as const, label: 'Mais antigos primeiro', icon: '\uD83D\uDD50' },
          ]).map(op => {
            const sel = ordemSelecionada === op.id
            return (
              <div
                key={op.id}
                role="button"
                tabIndex={0}
                onClick={() => { setOrdemSelecionada(op.id); setPainelAberto(null) }}
                onKeyDown={e => { if (e.key === 'Enter') { setOrdemSelecionada(op.id); setPainelAberto(null) } }}
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
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 12px', background: 'var(--ws-surface)', borderRadius: 12,
            marginBottom: 2,
          }}>
            <span style={{ flex: 1, fontSize: 12, color: 'var(--ws-text-2)', fontWeight: 500 }}>Apenas minhas equipes</span>
            <div
              role="switch"
              aria-checked={apenasMinhasEquipes}
              tabIndex={0}
              onClick={() => setApenasMinhasEquipes(!apenasMinhasEquipes)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setApenasMinhasEquipes(!apenasMinhasEquipes) }}
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
          {FILTRO_ITEMS.map(item => {
            const IconComp = ICON_MAP[item.iconKey]
            return (
              <div
                key={item.label}
                role="button"
                tabIndex={0}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px', background: 'var(--ws-surface)', borderRadius: 12,
                  cursor: 'pointer', fontSize: 13, color: 'var(--ws-text-1)',
                  transition: 'background 120ms',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--ws-glass-bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--ws-surface)'}
              >
                {IconComp && <IconComp size={16} color="var(--ws-text-2)" />}
                <span style={{ flex: 1, fontWeight: 500 }}>{item.label}</span>
                <ChevronDown size={16} color="var(--ws-text-3)" />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
})

// ─── Lista integrada (reutilizavel no Chat) ──────────────────────────────────

interface CrmListaConversasProps {
  conversaAtivaId?: string
  onSelectConversa?: (conversaId: string) => void
}

export function CrmListaConversas({ conversaAtivaId, onSelectConversa }: CrmListaConversasProps = {}) {
  const [aba, setAba] = useState<AbaId>('novos')
  const [filtroLeitura, setFiltroLeitura] = useState<'todas' | 'nao-lidas'>('todas')
  const [painelAberto, setPainelAberto] = useState<PainelAberto>(null)
  const [ordemSelecionada, setOrdemSelecionada] = useState<'ultimas' | 'antigos'>('antigos')
  const [buscaTexto, setBuscaTexto] = useState('')
  const [categoriaBusca, setCategoriaBusca] = useState('abertos')
  const [apenasMinhasEquipes, setApenasMinhasEquipes] = useState(false)

  const debouncedBusca = useDebouncedValue(buscaTexto, 250)

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

  const cardsVisiveis = useMemo(
    () => filtrarPorNivel(CARDS_INBOX, USUARIO_ATUAL),
    [],
  )

  const contagens = useMemo(
    () => contarPorAba(cardsVisiveis, USUARIO_ATUAL.id),
    [cardsVisiveis],
  )

  const cardsFiltrados = useMemo(() => {
    let resultado = classificarPorAba(cardsVisiveis, aba, USUARIO_ATUAL.id)

    if (debouncedBusca.trim()) {
      const termo = debouncedBusca.trim().toLowerCase()
      resultado = resultado.filter(c =>
        c.nome.toLowerCase().includes(termo) ||
        c.preview.toLowerCase().includes(termo) ||
        c.etiquetas.some(e => e.label.toLowerCase().includes(termo)) ||
        c.equipe.toLowerCase().includes(termo) ||
        (c.responsavelNome ?? '').toLowerCase().includes(termo)
      )
    }

    if (filtroLeitura === 'nao-lidas') {
      resultado = resultado.filter(c => c.badgeCount != null && c.badgeCount > 0)
    }

    if (apenasMinhasEquipes) {
      resultado = resultado.filter(c =>
        c.equipeIds.some(eq => USUARIO_ATUAL.equipeIds.includes(eq))
      )
    }

    if (ordemSelecionada === 'ultimas') {
      resultado.reverse()
    }

    return resultado
  }, [cardsVisiveis, aba, debouncedBusca, filtroLeitura, apenasMinhasEquipes, ordemSelecionada])

  const buscaAtiva = painelAberto === 'busca' && debouncedBusca.trim().length > 0
  const semResultados = cardsFiltrados.length === 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <div style={{ padding: '8px 8px 4px', flexShrink: 0 }}>
        <BarraAbas aba={aba} setAba={setAba} contagens={contagens} />
      </div>
      <div ref={toolbarRef} style={{ padding: '0 8px 4px', flexShrink: 0, position: 'relative' }}>
        <ToolbarVisualizacao
          filtroLeitura={filtroLeitura} setFiltroLeitura={setFiltroLeitura}
          painelAberto={painelAberto} setPainelAberto={setPainelAberto}
          ordemSelecionada={ordemSelecionada} setOrdemSelecionada={setOrdemSelecionada}
          buscaTexto={buscaTexto} setBuscaTexto={setBuscaTexto}
          categoriaBusca={categoriaBusca} setCategoriaBusca={setCategoriaBusca}
          apenasMinhasEquipes={apenasMinhasEquipes} setApenasMinhasEquipes={setApenasMinhasEquipes}
        />
      </div>
      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none' }} role="list" aria-label="Lista de conversas">
        {semResultados ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 8, padding: '40px 16px',
          }}>
            <Search size={28} style={{ color: 'var(--ws-text-3)', opacity: 0.3 }} />
            <span style={{ fontSize: 13, color: 'var(--ws-text-3)', textAlign: 'center' }}>
              {buscaAtiva ? `Nenhum resultado para "${buscaTexto}"` : 'Nenhuma conversa nesta categoria'}
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

// ─── Componente principal (standalone) ────────────────────────────────────────

export function GLMCrmInbox() {
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ws-text-1)', marginBottom: 6 }}>
          GLM CRM \u2014 Inbox
        </h2>
        <p style={{ fontSize: 14, color: 'var(--ws-text-2)', lineHeight: 1.6 }}>
          Vers\u00e3o refatorada: tipos compartilhados, mock data separado, componentes memoizados, debounce na busca, acessibilidade.
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
        <div style={{ borderTop: '1px solid var(--ws-divider)', paddingTop: 16, marginTop: 4 }}>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ws-text-3)', marginBottom: 12 }}>Melhorias vs vers\u00e3o original</div>
          <pre style={{
            fontSize: 12, background: 'rgba(14,20,42,0.04)', padding: 16,
            borderRadius: 8, color: 'var(--ws-text-2)', fontFamily: 'monospace',
            overflowX: 'auto', border: '1px solid var(--ws-divider)',
          }} className="dark:bg-white/5">
{`REFACTORIZA\u00c7\u00d5ES APLICADAS:

1. Tipos compartilhados \u2192 types.ts (elimina duplica\u00e7\u00e3o)
2. Constantes compartilhadas \u2192 constants.ts (Canal, Avatar, Etiquetas...)
3. Mock data separado \u2192 data.ts (dados n\u00e3o acoplados a UI)
4. Hook useDebouncedValue \u2192 debounce de 250ms na busca
5. React.memo em CardConversa, BarraAbas, ToolbarVisualizacao
6. Acessibilidade: role="button", tabIndex, aria-label, onKeyDown
7. Filtros usam useCallback para evitar re-render desnecessário
8. Busca com debounce (250ms) em vez de re-filtering instant\u00e2neo`}
          </pre>
        </div>
      </div>
    </div>
  )
}