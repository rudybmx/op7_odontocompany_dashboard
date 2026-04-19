'use client'
import { useState } from 'react'
import { LayoutDashboard, Megaphone, Image, Palette, Users } from 'lucide-react'

// Items para o exemplo
const TAB_ITEMS = [
  { id: 'visao', label: 'Visão geral', icon: LayoutDashboard },
  { id: 'campanhas', label: 'Campanhas', icon: Megaphone },
  { id: 'anuncios', label: 'Anúncios', icon: Image },
  { id: 'criativos', label: 'Criativos', icon: Palette },
  { id: 'publicos', label: 'Públicos', icon: Users },
]

export function DSTabs() {
  const [activeTab1, setActiveTab1] = useState('visao')
  const [activeTab2, setActiveTab2] = useState('visao')
  const [activeTab3, setActiveTab3] = useState('visao')

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ws-text-1)', marginBottom: 6 }}>↔ Tabs & Navegação</h2>
        <p style={{ fontSize: 14, color: 'var(--ws-text-2)', lineHeight: 1.6 }}>
          Padrões de navegação interna para páginas e sub-seções. O novo padrão <strong>Pill (Glass)</strong> deve ser priorizado
          em substituição ao antigo modelo de Underline para manter a consistência visual Glassmorphism v2.0.
        </p>
      </div>

      <div style={{
        background: 'var(--ws-glass-bg)', border: '1px solid var(--ws-glass-border)',
        borderRadius: 'var(--ws-radius-lg)', backdropFilter: 'blur(16px)',
        boxShadow: 'var(--ws-glass-shadow)', padding: 32,
        position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', gap: 48
      }}>
        {/* Mirror light reflection line */}
        <div style={{ 
          position: 'absolute', top: 0, left: 0, right: 0, height: 1, 
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)' 
        }} />

        {/* VARIAÇÃO 1 — UNDERLINE TABS */}
        <section>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ws-text-3)', marginBottom: 16 }}>
            Variação 1 — Underline Tabs (⚠️ Deprecated — não usar em páginas novas)
          </div>
          <div style={{
            display: 'flex',
            borderBottom: '1px solid var(--ws-divider)',
            gap: 0,
            marginBottom: 20
          }}>
            {TAB_ITEMS.map((item) => {
              const isActive = activeTab1 === item.id
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveTab1(item.id)}
                  style={{
                    padding: '8px 16px',
                    fontSize: '13px',
                    color: isActive ? '#92722a' : 'var(--ws-text-3)',
                    fontWeight: isActive ? 500 : 400,
                    borderBottom: isActive ? '2px solid var(--ws-gold)' : '2px solid transparent',
                    marginBottom: '-1px',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = 'var(--ws-text-1)'
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = 'var(--ws-text-3)'
                  }}
                >
                  {item.label}
                </div>
              )
            })}
          </div>
          <div style={{
            height: 60,
            background: 'var(--ws-glass-bg)',
            border: '1px solid var(--ws-glass-border)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            color: 'var(--ws-text-3)'
          }}>
            Conteúdo da aba &ldquo;{TAB_ITEMS.find(t => t.id === activeTab1)?.label}&rdquo;
          </div>
        </section>

        {/* VARIAÇÃO 2 — PILL TABS */}
        <section>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ws-text-3)', marginBottom: 16 }}>
            Variação 2 — Pill Tabs (Novo Padrão Glass)
          </div>
          
          <div className="inline-flex bg-[rgba(14,20,42,0.05)] dark:bg-[rgba(255,255,255,0.05)] border border-[rgba(14,20,42,0.08)] dark:border-[rgba(255,255,255,0.08)] rounded-[12px] p-[4px] gap-[2px] mb-[20px] relative">
             {/* Linha sutil no topo do container */}
            <div className="absolute top-0 left-[12px] right-[12px] h-[1px] bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.70)] to-transparent rounded-[1px]" />

            {TAB_ITEMS.map((item) => {
              const isActive = activeTab2 === item.id
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveTab2(item.id)}
                  className={`
                    px-[14px] py-[6px] text-[13px] rounded-[8px] cursor-pointer transition-all duration-150 ease-in-out whitespace-nowrap border select-none relative
                    ${isActive 
                      ? 'bg-[rgba(255,255,255,0.85)] dark:bg-[rgba(255,255,255,0.10)] text-[#3E5BFF] dark:text-white font-medium border-[rgba(62,91,255,0.20)] dark:border-[rgba(62,91,255,0.30)] shadow-[0_2px_8px_rgba(14,20,42,0.10),0_1px_3px_rgba(14,20,42,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.25)]' 
                      : 'text-[var(--ws-text-3)] border-transparent hover:text-[var(--ws-text-1)] hover:bg-[rgba(62,91,255,0.05)]'
                    }
                  `}
                >
                  {item.label}
                  {/* Linha de brilho no topo da pill ativa */}
                  {isActive && (
                    <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.90)] to-transparent" />
                  )}
                </div>
              )
            })}
          </div>
          
          <div style={{
            height: 60,
            background: 'var(--ws-glass-bg)',
            border: '1px solid var(--ws-glass-border)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            color: 'var(--ws-text-3)'
          }}>
            Conteúdo da aba &ldquo;{TAB_ITEMS.find(t => t.id === activeTab2)?.label}&rdquo;
          </div>
        </section>

        {/* VARIAÇÃO 3 — PILL TABS COM ÍCONE */}
        <section>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ws-text-3)', marginBottom: 16 }}>
            Variação 3 — Pill Tabs com Ícone (✅ Padrão oficial — usar em todas as páginas)
          </div>
          
          <div className="inline-flex bg-[rgba(14,20,42,0.05)] dark:bg-[rgba(255,255,255,0.05)] border border-[rgba(14,20,42,0.08)] dark:border-[rgba(255,255,255,0.08)] rounded-[12px] p-[4px] gap-[2px] mb-[20px] relative">
            <div className="absolute top-0 left-[12px] right-[12px] h-[1px] bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.70)] to-transparent rounded-[1px]" />

            {TAB_ITEMS.map((item) => {
              const isActive = activeTab3 === item.id
              const Icon = item.icon
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveTab3(item.id)}
                  className={`
                    flex items-center gap-[6px] px-[14px] py-[6px] text-[13px] rounded-[8px] cursor-pointer transition-all duration-150 ease-in-out whitespace-nowrap border select-none relative
                    ${isActive 
                      ? 'bg-[rgba(255,255,255,0.85)] dark:bg-[rgba(255,255,255,0.10)] text-[#3E5BFF] dark:text-white font-medium border-[rgba(62,91,255,0.20)] dark:border-[rgba(62,91,255,0.30)] shadow-[0_2px_8px_rgba(14,20,42,0.10),0_1px_3px_rgba(14,20,42,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.25)]' 
                      : 'text-[var(--ws-text-3)] border-transparent hover:text-[var(--ws-text-1)] hover:bg-[rgba(62,91,255,0.05)]'
                    }
                  `}
                >
                  <Icon size={14} className={isActive ? 'opacity-100 text-[#3E5BFF] dark:text-white' : 'opacity-50'} />
                  {item.label}
                  {isActive && (
                    <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.90)] to-transparent" />
                  )}
                </div>
              )
            })}
          </div>
          
          <div style={{
            height: 60,
            background: 'var(--ws-glass-bg)',
            border: '1px solid var(--ws-glass-border)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            color: 'var(--ws-text-3)'
          }}>
            Conteúdo da aba &ldquo;{TAB_ITEMS.find(t => t.id === activeTab3)?.label}&rdquo;
          </div>
        </section>

        {/* DOCUMENTAÇÃO PARA AGENTES */}
        <div style={{ borderTop: '1px solid var(--ws-divider)', paddingTop: 16, marginTop: 4 }}>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ws-text-3)', marginBottom: 12 }}>Documentação para Agentes</div>
          <pre style={{
            fontSize: 12,
            background: 'rgba(14,20,42,0.04)',
            padding: 16,
            borderRadius: 8,
            color: 'var(--ws-text-2)',
            fontFamily: 'monospace',
            overflowX: 'auto',
            border: '1px solid var(--ws-divider)'
          }} className="dark:bg-white/5">
{`COMPONENTE: WsTabs
VARIANTES: underline (deprecated) | pill | pill-icon (padrão)
PADRÃO OBRIGATÓRIO: pill-icon (Variação 3) — usar em TODAS as páginas

⚠️  NUNCA usar Variação 1 (underline) em páginas novas.
✅  SEMPRE usar Variação 3 (pill-icon) como padrão.

Exemplo de uso (copiar exato para novas páginas):

<div className="inline-flex bg-[rgba(14,20,42,0.05)] dark:bg-[rgba(255,255,255,0.05)] border border-[rgba(14,20,42,0.08)] dark:border-[rgba(255,255,255,0.08)] rounded-[12px] p-[4px] gap-[2px] mb-[20px] relative overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
  <div className="absolute top-0 left-[12px] right-[12px] h-[1px] bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.70)] to-transparent rounded-[1px]" />
  {ABAS_CONFIG.map(({ id, icon: Icon }) => {
    const isActive = abaAtiva === id
    return (
      <div key={id} onClick={() => setAbaAtiva(id)}
        className={\`flex items-center gap-[6px] px-[14px] py-[6px] text-[13px] rounded-[8px] cursor-pointer transition-all duration-150 whitespace-nowrap border select-none relative
          \${isActive
            ? 'bg-[rgba(255,255,255,0.85)] dark:bg-[rgba(255,255,255,0.10)] text-[#3E5BFF] dark:text-white font-medium border-[rgba(62,91,255,0.20)] dark:border-[rgba(62,91,255,0.30)] shadow-[0_2px_8px_rgba(14,20,42,0.10),0_1px_3px_rgba(14,20,42,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.25)]'
            : 'text-[var(--ws-text-3)] border-transparent hover:text-[var(--ws-text-1)] hover:bg-[rgba(62,91,255,0.05)]'
          }\`}
      >
        <Icon size={14} className={isActive ? 'opacity-100 text-[#3E5BFF] dark:text-white' : 'opacity-50'} />
        {id}
        {isActive && (
          <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.90)] to-transparent" />
        )}
      </div>
    )
  })}
</div>

Tab ativa:
  background: rgba(255,255,255,0.85) [light] / rgba(255,255,255,0.10) [dark]
  color: #3E5BFF [light] / white [dark]
  border: 1px solid rgba(62,91,255,0.20)
  box-shadow: 0 2px 8px rgba(14,20,42,0.10)

Container:
  background: rgba(14,20,42,0.05) [light]
  border: 1px solid rgba(14,20,42,0.08) [light]
  border-radius: 12px / padding: 4px
  overflow-x: auto (mobile scroll horizontal)`}
          </pre>
        </div>
      </div>
    </div>
  )
}
