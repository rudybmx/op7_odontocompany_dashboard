'use client'
import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

interface SwatchProps {
  token: string
  value: string
  label: string
  transparent?: boolean
}

function Swatch({ token, value, label, transparent }: SwatchProps) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(token)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      type="button"
      onClick={copy}
      title={`Copiar: ${token}`}
      style={{
        display: 'flex', flexDirection: 'column', gap: 6,
        background: 'none', border: 'none', cursor: 'pointer',
        textAlign: 'left', padding: 0,
      }}
    >
      <div style={{
        width: 80, height: 64, borderRadius: 10,
        background: transparent
          ? `repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 0 0 / 12px 12px`
          : value,
        position: 'relative',
        border: '1px solid rgba(0,0,0,0.08)',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {transparent && (
          <div style={{ position: 'absolute', inset: 0, background: value }} />
        )}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          opacity: 0,
          transition: 'opacity 0.15s',
        }}
          className="swatch-overlay"
        >
          {copied
            ? <Check size={18} color="white" strokeWidth={3} />
            : <Copy size={14} color="white" />}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--ws-text-1)', lineHeight: 1.3 }}>{label}</div>
        <div style={{ fontSize: 9, color: 'var(--ws-text-3)', fontFamily: 'monospace', lineHeight: 1.3 }}>{token}</div>
      </div>
      <style>{`.swatch-overlay { opacity: 0; } button:hover .swatch-overlay { opacity: 1; }`}</style>
    </button>
  )
}

function SwatchGroup({ title, swatches }: { title: string; swatches: SwatchProps[] }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ws-text-3)', marginBottom: 14 }}>{title}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {swatches.map(s => <Swatch key={s.token} {...s} />)}
      </div>
    </div>
  )
}

export function DSCores() {
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ws-text-1)', marginBottom: 6 }}>Cores & Tokens</h2>
        <p style={{ fontSize: 14, color: 'var(--ws-text-2)', lineHeight: 1.6 }}>
          Paleta Glassmorphism v2.0. Clique em qualquer swatch para copiar o token CSS.
          Nunca use hex hardcoded — sempre use os tokens <code style={{ fontFamily: 'monospace', fontSize: 12 }}>var(--ws-*)</code>.
        </p>
      </div>

      <SwatchGroup title="Base Navy" swatches={[
        { token: '--ws-navy',   label: 'Navy',   value: '#0E142A' },
        { token: '--ws-navy-2', label: 'Navy 2', value: '#141C38' },
        { token: '--ws-navy-3', label: 'Navy 3', value: '#1A2444' },
      ]} />

      <SwatchGroup title="Paleta Vibrante" swatches={[
        { token: '--ws-blue',        label: 'Blue',        value: '#3E5BFF' },
        { token: '--ws-blue-soft',   label: 'Blue Soft',   value: 'rgba(62,91,255,0.12)', transparent: true },
        { token: '--ws-cyan',        label: 'Cyan',        value: '#00F5FF' },
        { token: '--ws-cyan-dark',   label: 'Cyan Dark',   value: '#00b8c8' },
        { token: '--ws-purple',      label: 'Purple',      value: '#7A5AF8' },
        { token: '--ws-purple-soft', label: 'Purple Soft', value: 'rgba(122,90,248,0.12)', transparent: true },
        { token: '--ws-coral',       label: 'Coral',       value: '#FF5C8D' },
        { token: '--ws-coral-soft',  label: 'Coral Soft',  value: 'rgba(255,92,141,0.12)', transparent: true },
        { token: '--ws-green',       label: 'Green',       value: '#0fa856' },
        { token: '--ws-green-soft',  label: 'Green Soft',  value: 'rgba(15,168,86,0.12)', transparent: true },
      ]} />

      <SwatchGroup title="Glass (fundo xadrez = transparência)" swatches={[
        { token: '--ws-glass-bg',            label: 'Glass BG',           value: 'var(--ws-glass-bg)',            transparent: true },
        { token: '--ws-glass-bg-hover',      label: 'Glass BG Hover',     value: 'var(--ws-glass-bg-hover)',      transparent: true },
        { token: '--ws-glass-border',        label: 'Glass Border',        value: 'var(--ws-glass-border)',        transparent: true },
        { token: '--ws-glass-border-strong', label: 'Glass Border Strong', value: 'var(--ws-glass-border-strong)', transparent: true },
      ]} />

      <SwatchGroup title="Texto" swatches={[
        { token: '--ws-text-1',  label: 'Texto 1 (primário)',   value: 'var(--ws-text-1)', transparent: false },
        { token: '--ws-text-2',  label: 'Texto 2 (secundário)', value: 'var(--ws-text-2)', transparent: false },
        { token: '--ws-text-3',  label: 'Texto 3 (muted)',      value: 'var(--ws-text-3)', transparent: false },
        { token: '--ws-divider', label: 'Divider',              value: 'var(--ws-divider)', transparent: true },
      ]} />

      <SwatchGroup title="Gradientes de Background" swatches={[
        { token: '--ws-page-bg', label: 'Page BG', value: 'var(--ws-page-bg)' },
      ]} />

      <SwatchGroup title="Sidebar Navy (sempre fixo — independente do tema)" swatches={[
        { token: '#0E142A',                    label: 'Sidebar BG',       value: '#0E142A' },
        { token: '--ws-sidebar-border',         label: 'Border right',     value: 'rgba(255,255,255,0.08)', transparent: true },
        { token: '--ws-sidebar-accent',          label: 'Nav hover',        value: 'rgba(255,255,255,0.07)', transparent: true },
        { token: '--ws-sidebar-accent-foreground', label: 'Nav active text', value: '#ffffff' },
        { token: '--ws-sidebar-primary',          label: 'Gold accent',     value: 'var(--ws-gold)' },
      ]} />
    </div>
  )
}
