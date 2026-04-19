'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { getToken } from '@/lib/auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { ArrowLeft, Building2, Loader2 } from 'lucide-react'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function CriarOrganizacaoPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()

  const [name, setName] = useState('')
  const [level, setLevel] = useState<'1' | '2'>('1')
  const [slug, setSlug] = useState('')
  const [slugEdited, setSlugEdited] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!authLoading && user && user.level !== 0) {
      router.push('/')
    }
  }, [authLoading, user, router])

  const handleNameChange = useCallback((value: string) => {
    setName(value)
    if (!slugEdited) {
      setSlug(slugify(value))
    }
  }, [slugEdited])

  const handleSlugChange = useCallback((value: string) => {
    setSlugEdited(true)
    setSlug(slugify(value))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Informe o nome da organização')
      return
    }
    if (!slug.trim()) {
      toast.error('Slug não pode ficar vazio')
      return
    }

    setLoading(true)
    try {
      const token = getToken()
      const res = await fetch('https://api.qozt.com.br/organizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          level: Number(level),
          slug: slug.trim(),
        }),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => null)
        throw new Error(errData?.message || `Erro ${res.status}`)
      }

      toast.success('Organização criada com sucesso!')
      router.push('/admin/organizacoes')
    } catch (err: any) {
      toast.error(err.message || 'Erro ao criar organização')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || !user || user.level !== 0) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        height: '60vh', gap: 16,
      }}>
        <Loader2 size={24} className="animate-spin" style={{ color: 'var(--ws-blue, #3E5BFF)' }} />
        <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>Verificando permissões...</span>
      </div>
    )
  }

  return (
    <section style={{ padding: '24px 32px', maxWidth: 640 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
        <button
          onClick={() => router.back()}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border)',
            background: 'var(--card)', cursor: 'pointer', transition: 'all 150ms',
          }}
        >
          <ArrowLeft size={16} style={{ color: 'var(--muted-foreground)' }} />
        </button>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)', lineHeight: 1.2 }}>
            Criar Organização
          </h1>
          <p style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 2 }}>
            Cadastre uma nova Reseller ou Cliente na plataforma
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          background: 'var(--ws-glass-bg, rgba(255,255,255,0.03))',
          border: '1px solid var(--ws-glass-border, rgba(255,255,255,0.08))',
          borderRadius: 14,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          backdropFilter: 'blur(16px)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>
            Nome da organização <span style={{ color: '#FF5C8D' }}>*</span>
          </label>
          <Input
            placeholder="Ex: Minha Empresa Ltda"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            style={{ background: 'var(--card)' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>
            Nível
          </label>
          <Select value={level} onValueChange={(v) => setLevel(v as '1' | '2')}>
            <SelectTrigger className="w-full" style={{ background: 'var(--card)' }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Reseller (N1)</SelectItem>
              <SelectItem value="2">Cliente (N2)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>
            Slug
          </label>
          <Input
            placeholder="gerado-automaticamente-do-nome"
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            style={{ background: 'var(--card)', fontFamily: 'monospace', fontSize: 13 }}
          />
          <span style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>
            Gerado automaticamente a partir do nome. Edite se necessário.
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading || !name.trim()}>
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Criando...
              </>
            ) : (
              <>
                <Building2 size={14} />
                Criar organização
              </>
            )}
          </Button>
        </div>
      </form>
    </section>
  )
}