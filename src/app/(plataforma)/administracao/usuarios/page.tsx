'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Edit3, Loader2, Mail, Plus, Search, Shield, UserPlus, Users, X } from 'lucide-react'
import { toast } from 'sonner'
import useSWR from 'swr'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { useAuth } from '@/hooks/use-auth'
import api from '@/lib/api-client'

type RoleUsuario =
  | 'platform_admin'
  | 'network_admin'
  | 'network_viewer'
  | 'company_admin'
  | 'company_agent'

interface UsuarioRow {
  id: string
  nome: string
  email: string
  role: RoleUsuario
  workspace_id: string | null
  workspace_nome: string | null
  ativo: boolean
}

interface WorkspaceRow {
  id: string
  nome: string
}

interface NovoUsuarioForm {
  nome: string
  email: string
  senha: string
  role: RoleUsuario
  workspace_id: string
}

const ROLES: { id: RoleUsuario; label: string }[] = [
  { id: 'platform_admin', label: 'Administrador' },
  { id: 'network_admin', label: 'Gestor de Rede' },
  { id: 'network_viewer', label: 'Supervisor' },
  { id: 'company_admin', label: 'Admin Cliente' },
  { id: 'company_agent', label: 'Atendente' },
]

const ROLE_LABELS = ROLES.reduce<Record<RoleUsuario, string>>((acc, role) => {
  acc[role.id] = role.label
  return acc
}, {} as Record<RoleUsuario, string>)

const ROLE_STYLES: Record<RoleUsuario, { bg: string; color: string }> = {
  platform_admin: { bg: 'rgba(62,91,255,0.15)', color: 'var(--ws-blue)' },
  network_admin: { bg: 'rgba(122,90,248,0.15)', color: 'var(--ws-purple)' },
  network_viewer: { bg: 'rgba(0,245,255,0.12)', color: 'var(--ws-cyan-dark)' },
  company_admin: { bg: 'rgba(201,168,76,0.15)', color: '#c9a84c' },
  company_agent: { bg: 'rgba(15,168,86,0.15)', color: 'var(--ws-green)' },
}

const emptyForm = (): NovoUsuarioForm => ({
  nome: '',
  email: '',
  senha: '',
  role: 'company_agent',
  workspace_id: '',
})

function getErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback
}

const fetchUsuarios = (path: string) => api.get<UsuarioRow[]>(path)
const fetchWorkspaces = (path: string) => api.get<WorkspaceRow[]>(path)

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 10,
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid var(--ws-glass-border)',
  fontSize: 13,
  color: 'var(--ws-text-1)',
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: 6,
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--ws-text-2)',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
}

const thStyle: React.CSSProperties = {
  padding: '14px 18px',
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--ws-text-2)',
  textAlign: 'left',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  whiteSpace: 'nowrap',
}

const tdStyle: React.CSSProperties = {
  padding: '14px 18px',
  borderBottom: '1px solid var(--ws-glass-border)',
  verticalAlign: 'middle',
}

export default function UsuariosAdministracaoPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()

  const [busca, setBusca] = useState('')
  const [filtroRole, setFiltroRole] = useState<RoleUsuario | 'todas'>('todas')
  const [drawerAberto, setDrawerAberto] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [form, setForm] = useState<NovoUsuarioForm>(emptyForm)
  const isPlatformAdmin = user?.role === 'platform_admin'

  const {
    data: usuarios = [],
    error: usuariosError,
    isLoading: carregando,
    mutate: mutateUsuarios,
  } = useSWR<UsuarioRow[]>(isPlatformAdmin ? '/usuarios' : null, fetchUsuarios)

  const {
    data: workspaces = [],
  } = useSWR<WorkspaceRow[]>(isPlatformAdmin ? '/workspaces' : null, fetchWorkspaces)

  useEffect(() => {
    if (!authLoading && user && user.role !== 'platform_admin') router.push('/')
  }, [authLoading, user, router])

  useEffect(() => {
    if (usuariosError) toast.error(getErrorMessage(usuariosError, 'Erro ao carregar usuários'))
  }, [usuariosError])

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return usuarios.filter((usuario) => {
      const matchBusca =
        !termo ||
        usuario.nome.toLowerCase().includes(termo) ||
        usuario.email.toLowerCase().includes(termo)
      const matchRole = filtroRole === 'todas' || usuario.role === filtroRole
      return matchBusca && matchRole
    })
  }, [usuarios, busca, filtroRole])

  function fecharDrawer() {
    setDrawerAberto(false)
    setForm(emptyForm())
  }

  async function salvarUsuario() {
    const nome = form.nome.trim()
    const email = form.email.trim().toLowerCase()
    const senha = form.senha.trim()

    if (!nome) { toast.error('Nome é obrigatório'); return }
    if (!email) { toast.error('Email é obrigatório'); return }
    if (!senha) { toast.error('Senha é obrigatória'); return }
    if (senha.length < 6) { toast.error('Senha deve ter no mínimo 6 caracteres'); return }

    setSalvando(true)
    try {
      const novo = await api.post<UsuarioRow>('/auth/registro-usuario', {
        nome,
        email,
        senha,
        role: form.role,
        workspace_id: form.workspace_id || null,
      })
      await mutateUsuarios((atuais = []) => [novo, ...atuais], { revalidate: false })
      fecharDrawer()
      toast.success('Usuário criado com sucesso')
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Erro ao criar usuário'))
    } finally {
      setSalvando(false)
    }
  }

  if (authLoading || !user || user.role !== 'platform_admin') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <Loader2 size={24} className="animate-spin" style={{ color: 'var(--ws-blue)' }} />
      </div>
    )
  }

  return (
    <div style={{ padding: '32px 24px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: 'var(--ws-text-1)', letterSpacing: '-0.02em' }}>
            Usuários
          </h1>
          <p style={{ fontSize: 13, color: 'var(--ws-text-2)', margin: '4px 0 0' }}>
            Gerencie acessos, roles e vínculo de workspace
          </p>
        </div>

        <button
          onClick={() => setDrawerAberto(true)}
          style={{
            height: 42,
            padding: '0 20px',
            borderRadius: 10,
            border: 'none',
            background: 'linear-gradient(135deg, #3E5BFF, #7A5AF8)',
            color: '#ffffff',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 4px 12px rgba(62,91,255,0.30)',
            whiteSpace: 'nowrap',
          }}
        >
          <Plus size={16} />
          Novo Usuário
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 24 }}>
        <div style={{
          background: 'var(--ws-glass-bg)',
          border: '1px solid var(--ws-glass-border)',
          borderRadius: 12,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          backdropFilter: 'blur(10px)',
        }}>
          <Search size={16} style={{ color: 'var(--ws-text-3)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', fontSize: 14, color: 'var(--ws-text-1)', outline: 'none' }}
          />
          <span style={{ fontSize: 12, color: 'var(--ws-text-3)', flexShrink: 0 }}>
            {filtrados.length} usuário{filtrados.length !== 1 ? 's' : ''}
          </span>
        </div>

        <select
          value={filtroRole}
          onChange={(event) => setFiltroRole(event.target.value as RoleUsuario | 'todas')}
          style={{ ...inputStyle, height: 48, cursor: 'pointer' }}
        >
          <option value="todas">Todas as roles</option>
          {ROLES.map((role) => (
            <option key={role.id} value={role.id}>{role.label}</option>
          ))}
        </select>
      </div>

      <div style={{
        background: 'var(--ws-glass-bg)',
        border: '1px solid var(--ws-glass-border)',
        borderRadius: 14,
        overflow: 'hidden',
        backdropFilter: 'blur(16px)',
      }}>
        {carregando ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <Loader2 size={24} className="animate-spin" style={{ color: 'var(--ws-blue)' }} />
            <p style={{ fontSize: 13, color: 'var(--ws-text-2)', marginTop: 12 }}>Carregando usuários...</p>
          </div>
        ) : filtrados.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <Users size={32} style={{ color: 'var(--ws-text-3)', marginBottom: 12 }} />
            <p style={{ fontSize: 14, color: 'var(--ws-text-2)' }}>
              {busca || filtroRole !== 'todas' ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--ws-glass-border)' }}>
                  {['Nome', 'Email', 'Role', 'Workspace', 'Status', 'Ações'].map((header) => (
                    <th key={header} style={thStyle}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrados.map((usuario) => {
                  const roleStyle = ROLE_STYLES[usuario.role] || ROLE_STYLES.company_agent
                  return (
                    <tr
                      key={usuario.id}
                      style={{ transition: 'background 0.15s' }}
                      onMouseEnter={(event) => (event.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                      onMouseLeave={(event) => (event.currentTarget.style.background = 'transparent')}
                    >
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 34,
                            height: 34,
                            borderRadius: 10,
                            background: 'linear-gradient(135deg, rgba(62,91,255,0.85), rgba(122,90,248,0.85))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            fontSize: 13,
                            fontWeight: 700,
                            flexShrink: 0,
                          }}>
                            {usuario.nome.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ws-text-1)' }}>
                            {usuario.nome}
                          </span>
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--ws-text-2)' }}>
                          <Mail size={13} style={{ color: 'var(--ws-text-3)' }} />
                          {usuario.email}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '4px 10px',
                          borderRadius: 6,
                          background: roleStyle.bg,
                          color: roleStyle.color,
                          fontSize: 12,
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                        }}>
                          <Shield size={12} />
                          {ROLE_LABELS[usuario.role] || usuario.role}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--ws-text-2)' }}>
                          <Building2 size={13} style={{ color: 'var(--ws-text-3)' }} />
                          {usuario.workspace_nome || 'Sem workspace'}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '4px 10px',
                          borderRadius: 6,
                          background: usuario.ativo ? 'rgba(15,168,86,0.15)' : 'rgba(163,45,45,0.15)',
                          color: usuario.ativo ? 'var(--ws-green)' : '#a32d2d',
                          fontSize: 12,
                          fontWeight: 600,
                        }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: usuario.ativo ? 'var(--ws-green)' : '#a32d2d' }} />
                          {usuario.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <button
                          onClick={() => toast.info('Edição em breve')}
                          style={{
                            height: 30,
                            padding: '0 10px',
                            borderRadius: 6,
                            border: '1px solid var(--ws-glass-border)',
                            background: 'transparent',
                            color: 'var(--ws-text-2)',
                            fontSize: 12,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                          }}
                        >
                          <Edit3 size={12} />
                          Editar
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Sheet open={drawerAberto} onOpenChange={(open) => (open ? setDrawerAberto(true) : fecharDrawer())}>
        <SheetContent
          side="right"
          showCloseButton={false}
          style={{
            width: 'min(480px, 100vw)',
            background: 'var(--ws-glass-bg)',
            borderLeft: '1px solid var(--ws-glass-border)',
            backdropFilter: 'blur(24px)',
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{
            padding: '24px 28px 20px',
            borderBottom: '1px solid var(--ws-glass-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: 'var(--ws-text-1)' }}>
                Novo Usuário
              </h2>
              <p style={{ fontSize: 12, color: 'var(--ws-text-2)', margin: '4px 0 0' }}>
                Cadastre um acesso para a plataforma
              </p>
            </div>
            <button
              onClick={fecharDrawer}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: '1px solid var(--ws-glass-border)',
                background: 'rgba(255,255,255,0.06)',
                color: 'var(--ws-text-2)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <X size={16} />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={labelStyle}>Nome *</label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={(event) => setForm((prev) => ({ ...prev, nome: event.target.value }))}
                  placeholder="Nome completo"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  placeholder="usuario@empresa.com.br"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Senha *</label>
                <input
                  type="password"
                  value={form.senha}
                  onChange={(event) => setForm((prev) => ({ ...prev, senha: event.target.value }))}
                  placeholder="Mínimo 6 caracteres"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Role *</label>
                <select
                  value={form.role}
                  onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value as RoleUsuario }))}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  {ROLES.map((role) => (
                    <option key={role.id} value={role.id}>{role.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Workspace <span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>(opcional)</span></label>
                <select
                  value={form.workspace_id}
                  onChange={(event) => setForm((prev) => ({ ...prev, workspace_id: event.target.value }))}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  <option value="">Sem workspace</option>
                  {workspaces.map((workspace) => (
                    <option key={workspace.id} value={workspace.id}>{workspace.nome}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div style={{
            padding: '20px 28px',
            borderTop: '1px solid var(--ws-glass-border)',
            display: 'flex',
            gap: 12,
          }}>
            <button
              onClick={fecharDrawer}
              style={{
                flex: 1,
                height: 42,
                borderRadius: 10,
                border: '1px solid var(--ws-glass-border)',
                background: 'transparent',
                color: 'var(--ws-text-2)',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
            <button
              onClick={salvarUsuario}
              disabled={salvando}
              style={{
                flex: 2,
                height: 42,
                borderRadius: 10,
                border: 'none',
                background: salvando ? 'rgba(62,91,255,0.50)' : 'linear-gradient(135deg, #3E5BFF, #7A5AF8)',
                color: '#ffffff',
                fontSize: 14,
                fontWeight: 600,
                cursor: salvando ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: salvando ? 'none' : '0 4px 12px rgba(62,91,255,0.30)',
              }}
            >
              {salvando ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
              {salvando ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
