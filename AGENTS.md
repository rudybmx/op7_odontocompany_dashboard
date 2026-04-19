<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Padrão Visual de Componentes

### Cards KPI
- Background: var(--card)
- Border light: 0.5px solid rgba(15,39,68,0.10)
- Border dark:  0.5px solid rgba(255,255,255,0.08)
- Border-radius: 6px
- Padding: 12px 14px
- Label: 10px uppercase letter-spacing 0.06em color muted
- Value: 20px font-weight 500
- Delta: 11px — green #3b6d11 / red #a32d2d / neutral muted

### Tabelas
- Outer border light: 0.5px solid rgba(15,39,68,0.10)
- Row border light:   0.5px solid rgba(15,39,68,0.08)
- Header bg light:    rgba(15,39,68,0.04)
- L0 hover light:     rgba(15,39,68,0.04)
- L1 base light:      rgba(15,39,68,0.02)
- L2 base light:      rgba(15,39,68,0.035)
- Dark equivalents:   rgba(255,255,255,0.05/0.03/0.06)

### Gráficos (Recharts)
- Card wrapper: bg var(--card), border rgba(15,39,68,0.10) light / rgba(255,255,255,0.08) dark
- Grid lines:   rgba(15,39,68,0.06) light / rgba(255,255,255,0.06) dark
- Tooltip bg:   #0f2744 light / #1a1a1a dark
- Tooltip text: #ffffff
- Primary color:   #0f2744 (navy)
- Secondary color: #c9a84c (gold)
- Success: #3b6d11 | Warning: #854f0b | Danger: #a32d2d

### Aba ativa
- Color: #c9a84c
- Border-bottom: 2px solid #c9a84c

### Destaques numéricos
- Leads/valores positivos em destaque: #c9a84c
- CPL alto (ruim): #a32d2d
- CPL bom (≤1): #3b6d11

### Botões de filtro ativos
- Background: rgba(201,168,76,0.12)
- Color: #c9a84c
- Border: 0.5px solid #c9a84c

---

## Design System v2.0 — Glassmorphism

### Tokens principais
- Navy base:     #0E142A (`--ws-navy`)
- Electric Blue: #3E5BFF (`--ws-blue`)
- Cyan Neon:     #00F5FF dark / #00b8c8 light (`--ws-cyan-dark`)
- Royal Purple:  #7A5AF8 (`--ws-purple`)
- Hot Coral:     #FF5C8D (`--ws-coral`)
- Green:         #0fa856 (`--ws-green`)

### Glass card padrão
```css
background: var(--ws-glass-bg);
border: 1px solid var(--ws-glass-border);
border-radius: 14px;
backdrop-filter: blur(16px);
box-shadow: var(--ws-glass-shadow);
```

### Página de referência visual
→ Acesse `/design-system` para ver todos os componentes em ação
→ Guia detalhado: `src/components/design-system/ds-agentes.md`
