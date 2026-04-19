'use client'
import { Plus, Trash2, ArrowRight, Download, RefreshCw } from 'lucide-react'

interface BtnProps {
  label: string
  variant: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  disabled?: boolean
}

function Btn({ label, variant, size = 'md', icon, disabled }: BtnProps) {
  const heights = { sm: 28, md: 36, lg: 44 }
  const pads = { sm: '0 12px', md: '0 16px', lg: '0 24px' }
  const fonts = { sm: 11, md: 13, lg: 15 }

  const styles: Record<string, React.CSSProperties> = {
    primary: {
      background: 'linear-gradient(135deg, var(--ws-blue), var(--ws-purple))',
      color: 'white', border: 'none',
      boxShadow: '0 4px 16px rgba(62,91,255,0.35)',
    },
    secondary: {
      background: 'var(--ws-glass-bg)',
      border: '1px solid var(--ws-glass-border)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      color: 'var(--ws-text-1)',
      boxShadow: 'var(--ws-glass-shadow-sm)',
    },
    ghost: {
      background: 'transparent',
      border: '1px solid var(--ws-divider)',
      color: 'var(--ws-text-2)',
    },
    danger: {
      background: 'rgba(255,92,141,0.12)',
      border: '1px solid rgba(255,92,141,0.25)',
      color: '#c2004f',
    },
  }

  return (
    <button
      type="button"
      disabled={disabled}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        height: heights[size], padding: pads[size],
        borderRadius: 'var(--ws-radius-md)',
        fontSize: fonts[size], fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'var(--ws-transition)',
        ...styles[variant],
      }}
      onMouseEnter={e => {
        if (disabled) return
        if (variant === 'primary') {
          e.currentTarget.style.boxShadow = '0 6px 24px rgba(62,91,255,0.50)'
          e.currentTarget.style.transform = 'translateY(-1px)'
        } else if (variant === 'secondary') {
          e.currentTarget.style.background = 'var(--ws-glass-bg-hover)'
          e.currentTarget.style.borderColor = 'var(--ws-glass-border-strong)'
        } else if (variant === 'ghost') {
          e.currentTarget.style.background = 'rgba(62,91,255,0.06)'
        }
      }}
      onMouseLeave={e => {
        if (disabled) return
        if (variant === 'primary') {
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(62,91,255,0.35)'
          e.currentTarget.style.transform = ''
        } else if (variant === 'secondary') {
          e.currentTarget.style.background = 'var(--ws-glass-bg)'
          e.currentTarget.style.borderColor = 'var(--ws-glass-border)'
        } else if (variant === 'ghost') {
          e.currentTarget.style.background = 'transparent'
        }
      }}
      onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.98)' }}
      onMouseUp={e => { e.currentTarget.style.transform = variant === 'primary' ? 'translateY(-1px)' : '' }}
    >
      {icon}
      {label}
    </button>
  )
}

export function DSBotoes() {
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ws-text-1)', marginBottom: 6 }}>Botões</h2>
        <p style={{ fontSize: 14, color: 'var(--ws-text-2)', lineHeight: 1.6 }}>
          4 variantes × 3 tamanhos. Sempre com border-radius var(--ws-radius-md).
          Primário usa gradient + shadow colorida. Hover: shadow maior + translateY(-1px).
        </p>
      </div>

      <div style={{
        background: 'var(--ws-glass-bg)', border: '1px solid var(--ws-glass-border)',
        borderRadius: 'var(--ws-radius-lg)', backdropFilter: 'blur(16px)',
        boxShadow: 'var(--ws-glass-shadow)', padding: 24,
        position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', gap: 24,
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)' }} />

        {/* Variantes */}
        {[
          { label: 'Primário',    variant: 'primary'   as const },
          { label: 'Secundário',  variant: 'secondary' as const },
          { label: 'Ghost',       variant: 'ghost'     as const },
          { label: 'Perigo',      variant: 'danger'    as const },
        ].map(({ label, variant }) => (
          <div key={variant}>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ws-text-3)', marginBottom: 10 }}>{label}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <Btn label="Pequeno" variant={variant} size="sm" />
              <Btn label="Médio (padrão)" variant={variant} size="md" />
              <Btn label="Grande" variant={variant} size="lg" />
              <Btn label="Com ícone" variant={variant} size="md" icon={<Plus size={14} />} />
              <Btn label="Desabilitado" variant={variant} size="md" disabled />
            </div>
          </div>
        ))}

        {/* Com ícones diferentes */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ws-text-3)', marginBottom: 10 }}>Com Ícones Lucide</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Btn label="Nova Campanha" variant="primary"   size="md" icon={<Plus size={14} />} />
            <Btn label="Exportar"      variant="secondary" size="md" icon={<Download size={14} />} />
            <Btn label="Atualizar"     variant="ghost"     size="md" icon={<RefreshCw size={14} />} />
            <Btn label="Excluir"       variant="danger"    size="md" icon={<Trash2 size={14} />} />
            <Btn label="Próximo"       variant="primary"   size="md" icon={<ArrowRight size={14} />} />
          </div>
        </div>
      </div>
    </div>
  )
}
