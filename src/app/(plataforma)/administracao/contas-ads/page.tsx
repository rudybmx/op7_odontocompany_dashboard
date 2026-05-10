'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Plus, Search, X, CreditCard } from 'lucide-react'
import { toast } from 'sonner'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { useAuth } from '@/hooks/use-auth'
import api from '@/lib/api-client'

interface Workspace {
  id: string
  nome: string
}

interface AdsAccount {
  id: string
  workspace_id: string
  workspace_nome: string
  plataforma: 'meta' | 'google' | 'linkedin' | 'tiktok'
  account_id: string
  nome: string
  bm_id?: string | null
  token?: string | null
  status: 'ativo' | 'expirado' | 'erro'
}

type Plataforma = 'todas' | 'meta' | 'google' | 'linkedin' | 'tiktok'

const PLATAFORMAS: { id: Plataforma; label: string; cor: string }[] = [
  { id: 'todas', label: 'Todas', cor: 'var(--ws-blue)' },
  { id: 'meta', label: 'Meta', cor: '#0081FB' },
  { id: 'google', label: 'Google', cor: '#EA4335' },
  { id: 'linkedin', label: 'LinkedIn', cor: '#0A66C2' },
  { id: 'tiktok', label: 'TikTok', cor: '#69C9D0' },
]

const PLATFORM_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  meta: { label: 'Meta', bg: 'rgba(0,129,251,0.15)', color: '#0081FB' },
  google: { label: 'Google', bg: 'rgba(234,67,53,0.15)', color: '#EA4335' },
  linkedin: { label: 'LinkedIn', bg: 'rgba(10,102,194,0.15)', color: '#0A66C2' },
  tiktok: { label: 'TikTok', bg: 'rgba(105,201,208,0.15)', color: '#69C9D0' },
}

const STATUS_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  ativo: { label: 'Ativo', bg: 'rgba(15,168,86,0.15)', color: 'var(--ws-green)' },
  expirado: { label: 'Expirado', bg: 'rgba(201,168,76,0.15)', color: '#c9a84c' },
  erro: { label: 'Erro', bg: 'rgba(255,92,141,0.15)', color: 'var(--ws-coral)' },
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 10,
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  fontSize: 13,
  color: 'var(--ws-text-1)',
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--ws-text-2)',
  display: 'block',
  marginBottom: 6,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
}

function emptyForm() {
  return {
    workspace_id: '',
    plataforma: 'meta' as 'meta' | 'google' | 'linkedin' | 'tiktok',
    account_id: '',
    nome: '',
    bm_id: '',
    token: '',
  }
}

export default function ContasAdsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const [contas, setContas] = useState<AdsAccount[]>([])
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [carregando, setCarregando] = useState(true)
  const [busca, setBusca] = useState('')
  const [filtroPlataforma, setFiltroPlataforma] = useState<Plataforma>('todas')
  const [drawerAberto, setDrawerAberto] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [form, setForm] = useState(emptyForm())

  useEffect(() => {
    if (!authLoading && user && user.role !== 'platform_admin') router.push('/')
  }, [authLoading, user, router])

  const loadContas = useCallback(async () => {
    setCarregando(true)
    try {
      const data = await api.get<AdsAccount[]>('/ads-accounts')
      setContas(data)
    } catch (err: any) {
      toast.error(err.message || 'Erro ao carregar contas')
    } finally {
      setCarregando(false)
    }
  }, [])

  const loadWorkspaces = useCallback(async () => {
    try {
      const data = await api.get<Workspace[]>('/workspaces')
      setWorkspaces(data)
    } catch {
      // non-blocking
    }
  }, [])

  useEffect(() => {
    if (user?.role === 'platform_admin') {
      loadContas()
      loadWorkspaces()
    }
  }, [user, loadContas, loadWorkspaces])

  async function salvar() {
    if (!form.workspace_id) { toast.error('Selecione um cliente'); return }
    if (!form.account_id.trim()) { toast.error('Account ID é obrigatório'); return }
    if (!form.nome.trim()) { toast.error('Nome da conta é obrigatório'); return }
    setSalvando(true)
    try {
      const criada = await api.post<AdsAccount>(`/workspaces/${form.workspace_id}/ads-accounts`, {
        plataforma: form.plataforma,
        account_id: form.account_id.trim(),
        nome: form.nome.trim(),
        bm_id: form.bm_id.trim() || null,
        token: form.token.trim() || null,
      })
      setContas(prev => [criada, ...prev])
      fecharDrawer()
      toast.success('Conta criada com sucesso!')
    } catch (err: any) {
      toast.error(err.message || 'Erro ao criar conta')
    } finally {
      setSalvando(false)
    }
  }

  function fecharDrawer() {
    setDrawerAberto(false)
    setForm(emptyForm())
  }

  const filtradas = contas.filter(c => {
    const t = busca.toLowerCase()
    const matchBusca =
      c.nome.toLowerCase().includes(t) ||
      c.account_id.toLowerCase().includes(t) ||
      (c.workspace_nome?.toLowerCase() || '').includes(t)
    const matchPlat = filtroPlataforma === 'todas' || c.plataforma === filtroPlataforma
    return matchBusca && matchPlat
  })

  if (authLoading || !user || user.role !== 'platform_admin') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <Loader2 size={24} className="animate-spin" style={{ color: 'var(--ws-blue)' }} />
      </div>
    )
  }

  return (
    <div style={{ padding: '32px 24px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: 'var(--ws-text-1)', letterSpacing: '-0.02em' }}>
            Contas Ads
          </h1>
          <p style={{ fontSize: 13, color: 'var(--ws-text-2)', margin: '4px 0 0' }}>
            Gerencie as contas de anúncios vinculadas aos clientes
          </p>
        </div>
        <button
          onClick={() => setDrawerAberto(true)}
          style={{
            background: 'linear-gradient(135deg, #3E5BFF, #7A5AF8)',
            border: 'none', padding: '0 20px', height: 42, borderRadius: 10,
            fontSize: 13, fontWeight: 600, color: 'white', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: '0 4px 12px rgba(62,91,255,0.30)',
          }}
        >
          <Plus size={16} />
          Nova Conta
        </button>
      </div>

      {/* Filtro plataforma */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {PLATAFORMAS.map(p => (
          <button
            key={p.id}
            onClick={() => setFiltroPlataforma(p.id)}
            style={{
              padding: '6px 16px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s',
              border: filtroPlataforma === p.id ? `0.5px solid ${p.cor}` : '1px solid var(--ws-glass-border)',
              background: filtroPlataforma === p.id ? `rgba(${hexToRgb(p.cor)},0.12)` : 'var(--ws-glass-bg)',
              color: filtroPlataforma === p.id ? p.cor : 'var(--ws-text-2)',
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Busca */}
      <div style={{
        background: 'var(--ws-glass-bg)', border: '1px solid var(--ws-glass-border)',
        borderRadius: 12, padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
        marginBottom: 24, backdropFilter: 'blur(10px)',
      }}>
        <Search size={16} style={{ color: 'var(--ws-text-3)', flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Buscar por nome, account ID ou cliente..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          style={{ flex: 1, background: 'transparent', border: 'none', fontSize: 14, color: 'var(--ws-text-1)', outline: 'none' }}
        />
        <span style={{ fontSize: 12, color: 'var(--ws-text-3)', flexShrink: 0 }}>
          {filtradas.length} conta{filtradas.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Tabela */}
      <div style={{
        background: 'var(--ws-glass-bg)', border: '1px solid var(--ws-glass-border)',
        borderRadius: 14, overflow: 'hidden', backdropFilter: 'blur(16px)',
      }}>
        {carregando ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <Loader2 size={24} className="animate-spin" style={{ color: 'var(--ws-blue)' }} />
            <p style={{ fontSize: 13, color: 'var(--ws-text-2)', marginTop: 12 }}>Carregando contas...</p>
          </div>
        ) : filtradas.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <CreditCard size={32} style={{ color: 'var(--ws-text-3)', marginBottom: 12 }} />
            <p style={{ fontSize: 14, color: 'var(--ws-text-2)' }}>
              {busca || filtroPlataforma !== 'todas' ? 'Nenhuma conta encontrada' : 'Nenhuma conta cadastrada'}
            </p>
            {!busca && filtroPlataforma === 'todas' && (
              <p style={{ fontSize: 12, color: 'var(--ws-text-3)', marginTop: 4 }}>
                Clique em "Nova Conta" para começar
              </p>
            )}
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--ws-glass-border)' }}>
                {['Plataforma', 'Account ID', 'Nome', 'Cliente', 'Status', 'Ações'].map(h => (
                  <th key={h} style={{
                    padding: '14px 18px', fontSize: 11, fontWeight: 600,
                    color: 'var(--ws-text-2)', textAlign: 'left',
                    textTransform: 'uppercase', letterSpacing: '0.04em',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtradas.map(c => {
                const plat = PLATFORM_BADGE[c.plataforma]
                const stat = STATUS_BADGE[c.status] || STATUS_BADGE.erro
                return (
                  <tr
                    key={c.id}
                    style={{ borderBottom: '1px solid var(--ws-glass-border)', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '4px 10px', borderRadius: 6,
                        background: plat.bg, color: plat.color,
                        fontSize: 12, fontWeight: 600,
                      }}>
                        {plat.label}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <code style={{ fontSize: 12, color: 'var(--ws-text-2)', fontFamily: 'monospace' }}>
                        {c.account_id}
                      </code>
                    </td>
                    <td style={{ padding: '14px 18px', fontSize: 13, color: 'var(--ws-text-1)', fontWeight: 500 }}>
                      {c.nome}
                    </td>
                    <td style={{ padding: '14px 18px', fontSize: 13, color: 'var(--ws-text-2)' }}>
                      {c.workspace_nome || '—'}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '4px 10px', borderRadius: 6,
                        background: stat.bg, color: stat.color,
                        fontSize: 12, fontWeight: 600,
                      }}>
                        <span style={{
                          width: 6, height: 6, borderRadius: '50%',
                          background: stat.color, flexShrink: 0,
                        }} />
                        {stat.label}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <button
                        style={{
                          background: 'transparent',
                          border: '1px solid var(--ws-glass-border)',
                          borderRadius: 6, padding: '4px 12px',
                          fontSize: 12, color: 'var(--ws-text-2)',
                          cursor: 'pointer',
                        }}
                        onClick={() => toast.info('Edição em breve')}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Drawer Nova Conta */}
      <Sheet open={drawerAberto} onOpenChange={open => !open && fecharDrawer()}>
        <SheetContent
          side="right"
          style={{
            width: 480,
            background: 'var(--ws-glass-bg)',
            borderLeft: '1px solid var(--ws-glass-border)',
            backdropFilter: 'blur(24px)',
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Drawer header */}
          <div style={{
            padding: '24px 28px 20px',
            borderBottom: '1px solid var(--ws-glass-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: 'var(--ws-text-1)' }}>
                Nova Conta Ads
              </h2>
              <p style={{ fontSize: 12, color: 'var(--ws-text-2)', margin: '4px 0 0' }}>
                Vincule uma conta de anúncios a um cliente
              </p>
            </div>
            <button
              onClick={fecharDrawer}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--ws-glass-border)',
                borderRadius: 8, width: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--ws-text-2)',
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Drawer body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Cliente */}
              <div>
                <label style={labelStyle}>Cliente *</label>
                <select
                  value={form.workspace_id}
                  onChange={e => setForm(prev => ({ ...prev, workspace_id: e.target.value }))}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  <option value="">Selecione um cliente...</option>
                  {workspaces.map(w => (
                    <option key={w.id} value={w.id}>{w.nome}</option>
                  ))}
                </select>
              </div>

              {/* Plataforma */}
              <div>
                <label style={labelStyle}>Plataforma *</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {(['meta', 'google', 'linkedin', 'tiktok'] as const).map(p => {
                    const badge = PLATFORM_BADGE[p]
                    const selected = form.plataforma === p
                    return (
                      <button
                        key={p}
                        onClick={() => setForm(prev => ({ ...prev, plataforma: p }))}
                        style={{
                          padding: '8px 16px',
                          borderRadius: 8,
                          fontSize: 13,
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          border: selected ? `1px solid ${badge.color}` : '1px solid var(--ws-glass-border)',
                          background: selected ? badge.bg : 'transparent',
                          color: selected ? badge.color : 'var(--ws-text-2)',
                        }}
                      >
                        {badge.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Account ID */}
              <div>
                <label style={labelStyle}>Account ID *</label>
                <input
                  type="text"
                  placeholder="ex: act_123456789"
                  value={form.account_id}
                  onChange={e => setForm(prev => ({ ...prev, account_id: e.target.value }))}
                  style={inputStyle}
                />
              </div>

              {/* Nome */}
              <div>
                <label style={labelStyle}>Nome da Conta *</label>
                <input
                  type="text"
                  placeholder="Nome identificador da conta"
                  value={form.nome}
                  onChange={e => setForm(prev => ({ ...prev, nome: e.target.value }))}
                  style={inputStyle}
                />
              </div>

              {/* BM ID — Meta only */}
              {form.plataforma === 'meta' && (
                <div>
                  <label style={labelStyle}>BM ID <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(opcional)</span></label>
                  <input
                    type="text"
                    placeholder="ID do Business Manager"
                    value={form.bm_id}
                    onChange={e => setForm(prev => ({ ...prev, bm_id: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
              )}

              {/* Token */}
              <div>
                <label style={labelStyle}>Token de Acesso <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(opcional)</span></label>
                <textarea
                  placeholder="Cole o token de acesso da conta..."
                  value={form.token}
                  onChange={e => setForm(prev => ({ ...prev, token: e.target.value }))}
                  rows={4}
                  style={{
                    ...inputStyle,
                    resize: 'vertical',
                    fontFamily: 'monospace',
                    fontSize: 12,
                  }}
                />
              </div>

            </div>
          </div>

          {/* Drawer footer */}
          <div style={{
            padding: '20px 28px',
            borderTop: '1px solid var(--ws-glass-border)',
            display: 'flex', gap: 12,
          }}>
            <button
              onClick={fecharDrawer}
              style={{
                flex: 1, height: 42, borderRadius: 10,
                background: 'transparent',
                border: '1px solid var(--ws-glass-border)',
                fontSize: 14, fontWeight: 500,
                color: 'var(--ws-text-2)', cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
            <button
              onClick={salvar}
              disabled={salvando}
              style={{
                flex: 2, height: 42, borderRadius: 10,
                background: salvando ? 'rgba(62,91,255,0.5)' : 'linear-gradient(135deg, #3E5BFF, #7A5AF8)',
                border: 'none',
                fontSize: 14, fontWeight: 600,
                color: 'white', cursor: salvando ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: salvando ? 'none' : '0 4px 12px rgba(62,91,255,0.30)',
              }}
            >
              {salvando ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              {salvando ? 'Salvando...' : 'Salvar Conta'}
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

function hexToRgb(hex: string): string {
  const clean = hex.replace('#', '')
  if (clean.length !== 6) return '62,91,255'
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  return `${r},${g},${b}`
}
