# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important: Read Next.js docs first

This project uses **Next.js 16** (App Router), which may differ from training data. Before writing any Next.js-specific code, read the relevant guide in `node_modules/next/dist/docs/`. Heed deprecation notices.

## Commands

```bash
npm run dev       # Start dev server at localhost:3000
npm run build     # Build for production
npm run lint      # ESLint check
```

All development happens inside `my-plataform/`. Run all commands from that directory.

## Architecture

**Stack**: Next.js 16 App Router · TypeScript · Tailwind CSS v4 · shadcn/ui · Recharts · ReactFlow · lucide-react

### Route groups

- `src/app/(auth)/` — Login page
- `src/app/(plataforma)/` — Authenticated shell with sidebar + chat panel
  - `marketing/` — Campaigns (Meta/Google/LinkedIn/TikTok Ads), Demands, Performance, Events, Central AI, Automation, Strategists
  - `crm/` — Attendance, Campaigns, Management, Registrations
  - `administracao/` — Companies, Admin Users (admin-only section)
- `src/app/design-system/` — Visual reference page (not in menu, access at `/design-system`)

### Layout

`(plataforma)/layout.tsx` composes:
- `BarraLateral` — collapsible sidebar with logo (no separate header exists)
- `PainelChat` — floating AI chat panel
- `ProvedorLayout` — React context (`src/lib/contexto-layout.tsx`) managing sidebar collapse state, active nav item, breadcrumb, and mobile detection

All navigation sections, routes, and breadcrumb mappings are defined in `src/lib/contexto-layout.tsx` (`secoesNavegacao`). To add a new route to the nav, add it there.

### Key lib files

- `src/lib/utils.ts` — shared utilities (cn, etc.)
- `src/lib/formatar.ts` — formatting helpers
- `src/lib/contexto-layout.tsx` — navigation map + layout context
- `src/lib/meta-api.ts` — Meta Ads API integration
- `src/lib/mapa-utils.ts`, `src/lib/matriz-utils.ts`, `src/lib/gantt-utils.ts` — domain utilities

### Types

All TypeScript types are in `src/types/` split by domain: `meta-ads.ts`, `google-ads.ts`, `mapa.ts`, `matriz.ts`, `pmp.ts`.

## Design system

### Two visual systems coexist

**Classic (KPI/tables)** — primary/gold theme:
- Primary: `#0f2744` (navy) · Accent: `#c9a84c` (gold)
- Active tabs: `color: #c9a84c; border-bottom: 2px solid #c9a84c`
- Active filter buttons: `background: rgba(201,168,76,0.12); color: #c9a84c; border: 0.5px solid #c9a84c`

**Glassmorphism v2.0** — standard for new content components:
```css
background: var(--ws-glass-bg);
border: 1px solid var(--ws-glass-border);
border-radius: 14px;
backdrop-filter: blur(16px);
box-shadow: var(--ws-glass-shadow);
```
Always include the top shine line (`::after` with gradient).

### Color tokens (never use hardcoded hex)

- `var(--ws-blue)` — #3E5BFF (primary action)
- `var(--ws-cyan-dark)` — #00b8c8 light / `var(--ws-cyan)` — #00F5FF dark (leads/highlight)
- `var(--ws-coral)` — #FF5C8D (alert)
- `var(--ws-green)` — #0fa856 (success)
- `var(--ws-purple)` — #7A5AF8
- `var(--ws-text-1/2/3)` — text hierarchy
- `var(--ws-divider)` — dividers

### Rules — never do

- `position: fixed` — breaks in iframes
- Hardcoded hex colors — always use CSS tokens
- `font-weight: 600+` — except buttons and large numeric values
- Box shadows with solid colors — always `rgba()`
- Separate `<header>` component — the logo lives in the sidebar
- `backdrop-filter` without a fallback `background` — breaks in Safari

### Charts (Recharts)

```tsx
import { WS_CHART_COLORS } from '@/components/design-system/sections/ds-graficos'

// Tooltip
const tooltipStyle = {
  background: 'rgba(14,20,42,0.92)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 8, color: '#ffffff', fontSize: 12,
}

// Grid
<CartesianGrid stroke="rgba(62,91,255,0.06)" strokeDasharray="3 3" vertical={false} />
```

### Dark mode

All tokens have `.dark` variants defined in `src/app/globals.css`. Never use manual media queries — rely solely on CSS tokens. Theme is toggled via `ProvedorTema` (next-themes).

## Components

- `src/components/ui/` — shadcn/ui primitives
- `src/components/layout/` — `BarraLateral`, `PainelChat`
- `src/components/design-system/` — design system sections and the `ds-agentes.md` guide
- `src/components/crm/`, `src/components/demandas/`, `src/components/google-ads/`, `src/components/meta-ads/`, `src/components/provedores/` — domain-specific components

For detailed component patterns (badges, buttons, tables, KPI cards), see `src/components/design-system/ds-agentes.md`.
