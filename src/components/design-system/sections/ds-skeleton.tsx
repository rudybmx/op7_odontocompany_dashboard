'use client'
import { Skeleton } from '@/components/ui/skeleton'

function GlassCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: 'var(--ws-glass-bg)', border: '1px solid var(--ws-glass-border)',
      borderRadius: 'var(--ws-radius-lg)', backdropFilter: 'blur(16px)',
      boxShadow: 'var(--ws-glass-shadow)', padding: 16,
      position: 'relative', overflow: 'hidden',
      ...style,
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)' }} />
      {children}
    </div>
  )
}

function SectionTitle({ title, desc }: { title: string; desc: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ws-text-3)', marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 12, color: 'var(--ws-text-2)' }}>{desc}</div>
    </div>
  )
}

export function DSSkeleton() {
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ws-text-1)', marginBottom: 6 }}>Loading States (Skeleton)</h2>
        <p style={{ fontSize: 14, color: 'var(--ws-text-2)', lineHeight: 1.6 }}>
          Skeleton para cada tipo de componente. Usar em todos os estados de carregamento.
        </p>
      </div>

      {/* KPI Cards skeleton */}
      <SectionTitle title="KPI Cards (3 colunas)" desc="Enquanto os dados carregam" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
        {[...Array(3)].map((_, i) => (
          <GlassCard key={i}>
            <Skeleton className="h-[9px] w-[80px] mb-3 rounded" />
            <Skeleton className="h-[26px] w-[120px] mb-2 rounded" />
            <Skeleton className="h-[11px] w-[90px] rounded" />
          </GlassCard>
        ))}
      </div>

      {/* Tabela skeleton */}
      <SectionTitle title="Tabela (5 linhas × 5 colunas)" desc="Estrutura de tabela de campanhas" />
      <GlassCard style={{ padding: 0, marginBottom: 28, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '10px 16px', background: 'rgba(62,91,255,0.04)', borderBottom: '1px solid var(--ws-divider)', display: 'flex', gap: 16 }}>
          {[200, 80, 100, 80, 80].map((w, i) => (
            <Skeleton key={i} className="h-[9px] rounded" style={{ width: w }} />
          ))}
        </div>
        {/* Rows */}
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{ padding: '12px 16px', borderBottom: i < 4 ? '1px solid var(--ws-divider)' : 'none', display: 'flex', gap: 16, alignItems: 'center' }}>
            {[200, 80, 100, 80, 80].map((w, j) => (
              <Skeleton key={j} className="h-[12px] rounded" style={{ width: w, opacity: 1 - i * 0.08 }} />
            ))}
          </div>
        ))}
      </GlassCard>

      {/* Grid de cards 9:16 skeleton */}
      <SectionTitle title="Grid de Criativos (5 colunas, formato 9:16)" desc="Thumbnails de anúncios" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 28 }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Skeleton className="rounded-lg" style={{ width: '100%', aspectRatio: '9/16', height: undefined }} />
            <Skeleton className="h-[10px] rounded" />
            <Skeleton className="h-[9px] w-[60%] rounded" />
          </div>
        ))}
      </div>

      {/* Sidebar skeleton */}
      <SectionTitle title="Sidebar" desc="Estado de carregamento do menu" />
      <div style={{
        width: 220, background: 'var(--ws-sidebar-bg)', border: '1px solid var(--ws-sidebar-border)',
        backdropFilter: 'blur(20px)', borderRadius: 'var(--ws-radius-xl)',
        padding: '20px 14px', marginBottom: 28,
        boxShadow: 'var(--ws-glass-shadow)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div style={{ flex: 1 }}>
            <Skeleton className="h-[13px] w-[70px] mb-1 rounded" />
            <Skeleton className="h-[9px] w-[50px] rounded" />
          </div>
        </div>
        {/* Nav items */}
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-[28px] w-full rounded-lg mb-1" />
        ))}
      </div>

      {/* Insight IA skeleton */}
      <SectionTitle title="Insight IA Card" desc="Enquanto a análise carrega" />
      <GlassCard>
        <div style={{ display: 'flex', gap: 12 }}>
          <Skeleton className="h-7 w-7 rounded-lg flex-shrink-0" />
          <div style={{ flex: 1 }}>
            <Skeleton className="h-[9px] w-[60px] mb-2 rounded" />
            <Skeleton className="h-[11px] w-full mb-1 rounded" />
            <Skeleton className="h-[11px] w-[80%] mb-3 rounded" />
            <Skeleton className="h-[10px] w-[80px] rounded" />
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
