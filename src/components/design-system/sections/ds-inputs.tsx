'use client'
import { useState } from 'react'
import { Search, X, ChevronDown, Calendar, Eye, EyeOff } from 'lucide-react'

const inputBase: React.CSSProperties = {
  height: 36, width: '100%',
  background: 'var(--ws-glass-bg)',
  border: '1px solid var(--ws-glass-border)',
  borderRadius: 'var(--ws-radius-md)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  boxShadow: 'var(--ws-glass-shadow-sm)',
  color: 'var(--ws-text-1)',
  fontSize: 13, padding: '0 12px',
  outline: 'none', boxSizing: 'border-box',
}

function DSInput({ placeholder, state, value, type = 'text' }: {
  placeholder?: string
  state?: 'error' | 'success' | 'disabled'
  value?: string
  type?: string
}) {
  const [focused, setFocused] = useState(false)

  const stateStyles: React.CSSProperties = state === 'error'
    ? { borderColor: 'rgba(255,92,141,0.50)', boxShadow: '0 0 0 3px rgba(255,92,141,0.12)' }
    : state === 'success'
    ? { borderColor: 'rgba(15,168,86,0.50)', boxShadow: '0 0 0 3px rgba(15,168,86,0.12)' }
    : focused
    ? { borderColor: 'rgba(62,91,255,0.50)', boxShadow: '0 0 0 3px rgba(62,91,255,0.12)' }
    : {}

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <input
        type={type}
        placeholder={placeholder}
        defaultValue={value}
        disabled={state === 'disabled'}
        style={{ ...inputBase, ...stateStyles, opacity: state === 'disabled' ? 0.5 : 1 }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {state === 'error' && (
        <span style={{ fontSize: 11, color: 'var(--ws-coral)' }}>Campo obrigatório</span>
      )}
      {state === 'success' && (
        <span style={{ fontSize: 11, color: 'var(--ws-green)' }}>Validado com sucesso</span>
      )}
    </div>
  )
}

function SearchInput() {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ws-text-3)', pointerEvents: 'none' }} />
      <input
        placeholder="Buscar campanhas..."
        value={value}
        onChange={e => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...inputBase,
          paddingLeft: 30,
          paddingRight: value ? 30 : 12,
          ...(focused ? { borderColor: 'rgba(62,91,255,0.50)', boxShadow: '0 0 0 3px rgba(62,91,255,0.12)' } : {}),
        }}
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue('')}
          style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ws-text-3)', padding: 2 }}
        >
          <X size={12} />
        </button>
      )}
    </div>
  )
}

function SelectInput() {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <select
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...inputBase,
          appearance: 'none', paddingRight: 32, cursor: 'pointer',
          ...(focused ? { borderColor: 'rgba(62,91,255,0.50)', boxShadow: '0 0 0 3px rgba(62,91,255,0.12)' } : {}),
        }}
      >
        <option>Todos os status</option>
        <option>Ativo</option>
        <option>Pausado</option>
        <option>Aprendendo</option>
      </select>
      <ChevronDown size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ws-text-3)', pointerEvents: 'none' }} />
    </div>
  )
}

function PasswordInput() {
  const [show, setShow] = useState(false)
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <input
        type={show ? 'text' : 'password'}
        placeholder="Senha"
        defaultValue="minha_senha_secreta"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...inputBase, paddingRight: 32,
          ...(focused ? { borderColor: 'rgba(62,91,255,0.50)', boxShadow: '0 0 0 3px rgba(62,91,255,0.12)' } : {}),
        }}
      />
      <button
        type="button"
        onClick={() => setShow(v => !v)}
        style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ws-text-3)' }}
      >
        {show ? <EyeOff size={13} /> : <Eye size={13} />}
      </button>
    </div>
  )
}

function DateInput() {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <Calendar size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--ws-text-3)', pointerEvents: 'none' }} />
      <input
        type="date"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...inputBase, paddingLeft: 30,
          ...(focused ? { borderColor: 'rgba(62,91,255,0.50)', boxShadow: '0 0 0 3px rgba(62,91,255,0.12)' } : {}),
        }}
      />
    </div>
  )
}

export function DSInputs() {
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ws-text-1)', marginBottom: 6 }}>Inputs & Forms</h2>
        <p style={{ fontSize: 14, color: 'var(--ws-text-2)', lineHeight: 1.6 }}>
          Todos os inputs têm glass base. Focus: borda azul + ring rgba(62,91,255,0.12).
          Erros em coral, sucesso em verde.
        </p>
      </div>

      <div style={{
        background: 'var(--ws-glass-bg)', border: '1px solid var(--ws-glass-border)',
        borderRadius: 'var(--ws-radius-lg)', backdropFilter: 'blur(16px)',
        boxShadow: 'var(--ws-glass-shadow)', padding: 24,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)' }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ws-text-3)', marginBottom: 8 }}>Input padrão</div>
            <DSInput placeholder="Nome da campanha..." />
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ws-text-3)', marginBottom: 8 }}>Com erro</div>
            <DSInput placeholder="E-mail..." state="error" value="email@" />
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ws-text-3)', marginBottom: 8 }}>Com sucesso</div>
            <DSInput placeholder="URL..." state="success" value="https://exemplo.com" />
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ws-text-3)', marginBottom: 8 }}>Desabilitado</div>
            <DSInput placeholder="Campo desabilitado" state="disabled" value="Sem edição" />
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ws-text-3)', marginBottom: 8 }}>Busca (com limpar)</div>
            <SearchInput />
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ws-text-3)', marginBottom: 8 }}>Select</div>
            <SelectInput />
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ws-text-3)', marginBottom: 8 }}>Senha (toggle visível)</div>
            <PasswordInput />
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ws-text-3)', marginBottom: 8 }}>Date picker</div>
            <DateInput />
          </div>
        </div>

        {/* Textarea */}
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ws-text-3)', marginBottom: 8 }}>Textarea</div>
          <textarea
            placeholder="Observações sobre a campanha..."
            rows={3}
            style={{
              ...inputBase, height: 'auto', padding: '10px 12px',
              resize: 'vertical', fontFamily: 'inherit',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = 'rgba(62,91,255,0.50)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(62,91,255,0.12)' }}
            onBlur={e => { e.currentTarget.style.borderColor = 'var(--ws-glass-border)'; e.currentTarget.style.boxShadow = 'var(--ws-glass-shadow-sm)' }}
          />
        </div>
      </div>
    </div>
  )
}
