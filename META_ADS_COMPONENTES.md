# Meta Ads — Mapa de Componentes

> Gerado em: 2026-05-10
> Escopo: `src/components/meta-ads/`, `src/hooks/use-meta-*`, `src/lib/mock-meta-ads.ts`

---

## 1. Componentes (`src/components/meta-ads/`)

### Raiz

| Arquivo | Descrição |
|---------|-----------|
| `pagina-meta-ads.tsx` | Shell principal. Renderiza `FiltrosMeta`, barra de abas (Visão geral / Campanhas / Anúncios / Criativos / Públicos) e despacha para cada aba com as datas selecionadas. |

---

### `visao-geral/`

| Arquivo | Descrição |
|---------|-----------|
| `index.tsx` | Orquestra a aba Visão Geral: chama `useMetaInsights`, exibe skeletons durante loading e compõe todos os sub-componentes. |
| `filtros-meta.tsx` | Barra de filtros global: seletor de contas, agrupamentos, intervalo de datas com calendário e tipo de comparativo. |
| `cartoes-kpi.tsx` | Grade de cards KPI (Investimento, Leads, CPL, CPC, CTR, CPM, Frequência, Saldo, Limite) com deltas vs. período comparativo. |
| `card-leads.tsx` | Card específico de leads com breakdown por tipo (Mensagem / Cadastro / Compra) e por plataforma (Facebook / Instagram). |
| `grafico-temporal.tsx` | Gráfico de área + linha (Recharts) mostrando Investimento e Leads diários ao longo do período. |
| `graficos-distribuicao.tsx` | Dois gráficos: BarChart de investimento por conta e PieChart (donut) de distribuição de investimento. |
| `top-criativos.tsx` | Lista dos 5 melhores criativos rankeados pelo Score IA (CPL 40% + CTR 25% + Leads 20% + Frequência 15%). |
| `tabela-contas.tsx` | Tabela ordenável de contas com todas as métricas (Investimento, Leads, CPL, CPC, CPM, CTR, Impressões, Frequência, Saldo). |

---

### `campanhas/`

| Arquivo | Descrição |
|---------|-----------|
| `index.tsx` | Orquestra a aba Campanhas: chama `useMetaCampanhas`, compõe filtros, resumo, insights IA e tabela hierárquica. |
| `filtros-campanhas.tsx` | Filtros de campanhas: busca por nome, objetivo, status e toggle de plataformas (Facebook / Instagram / WhatsApp). |
| `resumo-campanhas.tsx` | Cards de resumo agregado da seleção atual (Investimento, Leads, CPL, CTR). |
| `tabela-hierarquica.tsx` | Tabela expansível 3 níveis: Campanha → Conjunto de Anúncios → Anúncio. Colunas configuráveis (8 colunas toggleáveis). Abre `ModalCriativo` ao clicar em criativo. |
| `modal-criativo.tsx` | Modal (Radix Dialog) com preview e métricas de um criativo específico dentro do contexto de campanha. |

---

### `anuncios/`

| Arquivo | Descrição |
|---------|-----------|
| `index.tsx` | Orquestra a aba Anúncios: chama `useMetaAnuncios` e `useInsightsIA`, gerencia filtros, modo de agrupamento e anúncio aberto. |
| `filtros-anuncios.tsx` | Filtros de anúncios: seletor de campanha, status, tipo de criativo e critério de ordenação. |
| `kpi-bar-anuncios.tsx` | Barra de KPIs agregados dos anúncios filtrados (Investimento total, Leads, CPL médio, CTR médio, Frequência média, Ativos, Com fadiga). |
| `tabela-hierarquica.tsx` | Tabela com agrupamento por campanha/conjunto expansível. Colunas ordenáveis: Score, Leads, CPL, CTR, Frequência, CPM, Impressões. |
| `lista-anuncios.tsx` | Visualização alternativa em lista flat (sem agrupamento), com ordenação por qualquer coluna. |
| `grid-criativos.tsx` | Visualização em grid de cards de criativos/anúncios. Colunas configuráveis (3–10), preferência salva em localStorage. |
| `insights-ia.tsx` | Painel colapsável de insights gerados por IA, categorizados por severidade (Alerta / Oportunidade / Info), com link para o anúncio. |
| `modal-anuncio.tsx` | Modal lateral com todos os detalhes de um anúncio: tipo, métricas completas, score e insight IA associado. |
| `score-anuncio.ts` | Função pura `calcularScore()`: scoring de anúncio por CPL (40pts), CTR (25pts), Volume de leads (20pts), Frequência e tendência (15pts). |

---

### `criativos/`

| Arquivo | Descrição |
|---------|-----------|
| `index.tsx` | Orquestra a aba Criativos: chama `useMetaCriativos` e `useInsightsCriativos`, gerencia filtros, comparador, modais de preview e detalhe. |
| `filtros-criativos.tsx` | Filtros de criativos: tipo, status, ordenação, número de colunas do grid e botão de toggle do comparador. |
| `grid-criativos.tsx` | Grid de cards de criativos com suporte a seleção múltipla (modo comparador) e abertura de preview. |
| `funil-atencao.tsx` | Visualização de funil de atenção: Impressões → Hook Rate (3s) → Hold Rate → Cliques → Leads, com médias agregadas dos criativos. |
| `insights-criativos.tsx` | Painel de insights IA específicos para criativos, colapsável, com link para abrir detalhe do criativo. |
| `comparador.tsx` | Modal de comparação side-by-side de até N criativos selecionados, exibindo métricas em colunas paralelas. |
| `modal-preview.tsx` | Modal de preview rápido do criativo (thumbnail / placeholder por tipo) com botão para abrir detalhe completo. |
| `modal-detalhe.tsx` | Modal de detalhe completo do criativo: métricas, score, insight IA e botão para preview. |
| `score-criativo.ts` | Função pura `calcularScoreCriativo()`: CPL (35pts), CTR (20pts), Leads (15pts), Frequência, Hook Rate, Hold Rate, Tempo ativo. |

---

### `publicos/`

| Arquivo | Descrição |
|---------|-----------|
| `index.tsx` | Orquestra a aba Públicos: chama `useMetaPublicos` e `useInsightsPublicos`, compõe todos os sub-componentes de análise de audiência. |
| `filtros-publicos.tsx` | Filtros de públicos: seletor de métrica principal (Leads / CPL / Investimento / CTR) e período. |
| `kpi-publicos.tsx` | Cards KPI de audiência: Alcance, Impressões, Frequência média, CPM médio. |
| `mapa-calor-demografico.tsx` | Heatmap de grade Gênero × Faixa Etária (18–24 a 65+), colorizado pela métrica selecionada. |
| `graficos-demograficos.tsx` | BarChart de leads por faixa etária/gênero e LineChart de evolução temporal por segmento demográfico (Recharts). |
| `breakdown-placements.tsx` | Cards com métricas por placement (Instagram Stories/Reels, Facebook Feed/Reels, etc.). |
| `breakdown-dispositivos.tsx` | Cards com métricas por dispositivo (Mobile/Desktop) e sistema operacional (Android/iOS). |
| `heatmap-horarios.tsx` | Heatmap 7 dias × 24 horas mostrando concentração de performance por dia da semana e hora do dia. |
| `geo-performance.tsx` | Ranking de top 7 cidades com barra de progresso proporcional ao volume de leads e indicador de CPL. |
| `insights-publicos.tsx` | Painel de insights IA sobre segmentos de audiência, colapsável, categorizado por severidade. |

---

## 2. Hooks (`src/hooks/use-meta-*`)

| Hook | Retorna |
|------|---------|
| `use-meta-anuncios.ts` → `useMetaAnuncios(filtros, dataInicio, dataFim)` | `{ anuncios: Anuncio[], total: number, isLoading: boolean, error: any }` |
| `use-meta-campanhas.ts` → `useMetaCampanhas(filtros, dataInicio, dataFim)` | `{ campanhas: Campanha[], resumo: ResumoCampanhas, insightsIA: InsightIA[], isLoading: boolean, error: any }` |
| `use-meta-criativos.ts` → `useMetaCriativos(filtros, dataInicio, dataFim)` | `{ criativos: Criativo[], total: number, isLoading: boolean, error: any }` |
| `use-meta-grafico.ts` → `useMetaGrafico()` | `{ dados: MetaGraficoData[], isLoading: boolean, error: any }` — dados diários do mês atual para gráficos |
| `use-meta-insights.ts` → `useMetaInsights(filtros)` | `{ data: MetaInsightsVisaoGeral \| null, isLoading: boolean, error: any }` — `data` contém `{ contas, dadosDiarios, topCriativos, insightsIA, periodo }` |
| `use-meta-overview.ts` → `useMetaOverview()` | `{ kpis: { spend, leads, impressions, reach, clicks, ctr, cpc, cpm, cpl }, financeiro: { saldo, limite, formaPagamento, nomeBm }, isLoading, error }` |
| `use-meta-publicos.ts` → `useMetaPublicos(filtros, dataInicio, dataFim)` | `{ demograficos, placements, dispositivos, sistemaOperacional, heatmapHoras, cidades, kpi, isLoading, error }` |

---

## 3. Mocks (`src/lib/mock-meta-ads.ts`)

### Interfaces/Tipos importados

```ts
import type { ContaAnuncio, DadosDiarios, CriativoTop, MetaInsightsVisaoGeral, InsightIA } from '@/types/meta-ads'
```

### Variáveis mock exportadas

| Variável | Tipo / Descrição |
|----------|-----------------|
| `MOCK_CONTAS_META` | `ContaAnuncio[]` — contas de anúncio com métricas completas (investimento, leads, CPL, CTR, saldo, etc.) |
| `MOCK_DADOS_DIARIOS` | `DadosDiarios[]` — array de 30 dias com investimento, leads, impressões e cliques gerados proceduralmente |
| `MOCK_TOP_CRIATIVOS` | `CriativoTop[]` — top 5 criativos com score, thumbnail, métricas e tipo |
| `MOCK_INSIGHTS_IA` | `InsightIA[]` — insights IA de exemplo com severidade (alerta/oportunidade/info), mensagem e anuncioId |
| `MOCK_AD_ROWS` | Array de rows brutas de anúncios (formato `AdsCompletoRow`) para fallback offline |
| `MOCK_CRIATIVOS_ROWS` | Array de rows brutas de criativos (formato `CriativosCompletoRow`) para fallback offline |
| `MOCK_DEMOGRAPHICS_ROWS` | Array de dados demográficos (age, gender, leads, investimento, cpl, ctr) |
| `MOCK_GEO_ROWS` | Array de dados geográficos por cidade (region, leads, investimento, cpl) |
| `MOCK_ACCOUNT_SUMMARY_ROWS` | Array com resumo agregado da conta (alcance, impressões, etc.) |
| `MOCK_PLACEMENTS` | Array de dados por placement (Instagram Stories/Reels, Facebook Feed, etc.) |
| `MOCK_DISPOSITIVOS` | Array de dados por dispositivo (Mobile, Desktop) |
| `MOCK_SO_ROWS` | Array de dados por sistema operacional (Android, iOS) |
| `MOCK_HEATMAP` | `any[]` — array de 7×24 entradas (dia × hora) com intensidade de performance |
| `getMockMetaOverview(dataInicio, dataFim)` | Função que retorna `MetaInsightsVisaoGeral` com todos os dados mock montados |

---

## 4. Página de entrada

**Rota:** `/marketing/campanhas/meta-ads`
**Arquivo:** `src/app/(plataforma)/marketing/campanhas/meta-ads/page.tsx`

```tsx
import { PaginaMetaAds } from '@/components/meta-ads/pagina-meta-ads'

export const metadata = { title: "Meta Ads — Op7 Nexo Plataforma" }

export default function MetaAdsPage() {
  return <PaginaMetaAds />
}
```

Importa apenas `PaginaMetaAds` — toda a lógica de abas, filtros e hooks está encapsulada dentro do componente.
