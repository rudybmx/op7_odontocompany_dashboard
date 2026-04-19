import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const tabAtiva = {
  color: 'var(--ws-gold)',
  borderBottom: '2px solid var(--ws-gold)',
  fontWeight: 500,
  background: 'transparent',
  border: 'none',
  borderBottomWidth: '2px',
  borderBottomStyle: 'solid' as const,
  borderBottomColor: 'var(--ws-gold)',
  cursor: 'pointer',
  padding: '8px 16px',
  fontSize: 13,
  transition: 'var(--ws-transition)',
} as const

export const tabInativa = {
  color: 'var(--ws-text-2)',
  borderBottom: '2px solid transparent',
  fontWeight: 400,
  background: 'transparent',
  border: 'none',
  borderBottomWidth: '2px',
  borderBottomStyle: 'solid' as const,
  borderBottomColor: 'transparent',
  cursor: 'pointer',
  padding: '8px 16px',
  fontSize: 13,
  transition: 'var(--ws-transition)',
} as const

export const filtroAtivo = {
  background: 'var(--ws-gold-soft)',
  border: '1px solid var(--ws-gold-border)',
  color: 'var(--ws-gold)',
  borderRadius: 'var(--ws-radius-sm)',
  padding: '5px 14px',
  fontSize: 11,
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'var(--ws-transition)',
} as const

export const filtroInativo = {
  background: 'transparent',
  border: '1px solid var(--ws-glass-border)',
  color: 'var(--ws-text-2)',
  borderRadius: 'var(--ws-radius-sm)',
  padding: '5px 14px',
  fontSize: 11,
  fontWeight: 400,
  cursor: 'pointer',
  transition: 'var(--ws-transition)',
} as const

export const glassCard = {
  background: 'var(--ws-glass-bg)',
  border: '1px solid var(--ws-glass-border)',
  borderRadius: 'var(--ws-radius-lg)',
  backdropFilter: 'blur(16px)',
  boxShadow: 'var(--ws-glass-shadow)',
  position: 'relative' as const,
  overflow: 'hidden' as const,
} as const

export const glassCardHover = {
  ...glassCard,
  background: 'var(--ws-glass-bg-hover)',
  boxShadow: 'var(--ws-glass-shadow-lg)',
  transform: 'translateY(-2px)',
} as const

export const botaoPrimario = {
  background: 'linear-gradient(135deg, var(--ws-blue), var(--ws-purple))',
  color: '#ffffff',
  border: 'none',
  borderRadius: 'var(--ws-radius-md)',
  padding: '9px 20px',
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
  boxShadow: '0 4px 16px rgba(62,91,255,0.35)',
  transition: 'var(--ws-transition)',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
} as const
