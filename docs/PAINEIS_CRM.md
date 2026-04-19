# PAINÉIS CRM — Documentação Técnica

## 1. Visão Geral
O módulo de **Painéis CRM** da plataforma Wer`Sun é uma ferramenta flexível para gestão de processos, leads e tarefas. Ele permite que os usuários organizem informações em múltiplos quadros (boards), cada um com seu próprio conjunto de etapas (colunas).

O módulo oferece duas visualizações principais:
- **Kanban**: Visualização em colunas ideal para fluxos de trabalho lineares (ex: funil de vendas, onboarding). Oferece suporte nativo a Drag & Drop para cards e colunas.
- **Lista**: Visualização em grade compacta para gestão rápida e busca, permitindo ordenação global e ações em massa.

---

## 2. Estrutura de Dados (Types)
Localização: `src/types/kanban.ts`

### KanbanBoard
Representa um quadro de gestão completo.
| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | `string` | ID único do board (UUID no banco). |
| `nome` | `string` | Título do painel (ex: "CRM Imobiliário"). |
| `colunas` | `KanbanColuna[]` | Lista de etapas pertencentes a este board. |
| `cards` | `KanbanCard[]` | Lista de cards (leads/tarefas) contidos no board. |

### KanbanColuna
Representa uma etapa do processo.
| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | `string` | ID único da coluna. |
| `nome` | `string` | Título da etapa (ex: "Prospecção"). |
| `cor` | `string` | Cor identificadora (Hex/HSL). |
| `limite` | `number?` | Limite WIP (Work In Progress) para alertas visuais. |
| `ordem` | `number` | Posição da coluna no fluxo horizontal. |

### KanbanCard
A unidade fundamental de informação (Lead, Tarefa, Oportunidade).
| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | `string` | ID único do card. |
| `titulo` | `string` | Nome principal do item. |
| `descricao` | `string?` | Detalhamento em texto rico/markdown. |
| `status` | `string` | ID da coluna à qual o card pertence. |
| `responsavel` | `string?` | Nome do usuário atribuído. |
| `responsavelInitials` | `string?` | Iniciais para o avatar (ex: "JD"). |
| `prioridade` | `Prioridade?` | Nível crítico: `baixa`, `media`, `alta`, `urgente`. |
| `dataVencimento` | `string?` | Data ISO (YYYY-MM-DD). |
| `tags` | `string[]?` | Etiquetas de categorização. |
| `comentarios` | `Comentario[]?` | Histórico de interações. |
| `camposCustom` | `CampoCustom[]?` | Dados dinâmicos definidos pelo usuário. |
| `ordem` | `number` | Posição vertical dentro da coluna. |

### Comentario
| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | `string` | ID único. |
| `autor` | `string` | Nome do autor. |
| `texto` | `string` | Conteúdo da mensagem. |
| `criadoEm` | `string` | Timestamp ISO. |

---

## 3. Schema SQL Sugerido (PostgreSQL)

### Tabelas Principais
```sql
-- Boards
CREATE TABLE kanban_boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL, -- Referência à organização (multi-tenant)
  nome TEXT NOT NULL,
  criado_em TIMESTAMPTZ DEFAULT now(),
  atualizado_em TIMESTAMPTZ DEFAULT now()
);

-- Colunas
CREATE TABLE kanban_colunas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID REFERENCES kanban_boards(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  cor TEXT DEFAULT '#8892b0',
  ordem INT NOT NULL DEFAULT 0,
  limite_wip INT,
  UNIQUE(board_id, ordem) -- Evita colunas na mesma posição
);

-- Cards
CREATE TABLE kanban_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID REFERENCES kanban_boards(id) ON DELETE CASCADE,
  coluna_id UUID REFERENCES kanban_colunas(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  responsavel_id UUID REFERENCES auth.users(id),
  prioridade TEXT CHECK (prioridade IN ('baixa', 'media', 'alta', 'urgente')),
  data_vencimento DATE,
  ordem INT NOT NULL DEFAULT 0,
  campos_custom JSONB DEFAULT '[]', -- Abordagem Flexível
  criado_em TIMESTAMPTZ DEFAULT now(),
  atualizado_em TIMESTAMPTZ DEFAULT now()
);

-- Comentários
CREATE TABLE kanban_comentarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID REFERENCES kanban_cards(id) ON DELETE CASCADE,
  autor_id UUID REFERENCES auth.users(id),
  texto TEXT NOT NULL,
  criado_em TIMESTAMPTZ DEFAULT now()
);
```

### RLS Policies (Row Level Security)
```sql
ALTER TABLE kanban_boards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see boards from their org" ON kanban_boards
  FOR ALL USING (org_id = auth.jwt() ->> 'org_id')::uuid;

-- Cards e Colunas herdam segurança via JOIN ou subquery
ALTER TABLE kanban_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access cards via board org" ON kanban_cards
  FOR ALL USING (
    EXISTS (SELECT 1 FROM kanban_boards b WHERE b.id = kanban_cards.board_id)
  );
```

---

## 4. API REST Sugerida

### Boards
- `GET    /api/kanban/boards`: Retorna lista compacta (id, nome).
- `POST   /api/kanban/boards`: `{ nome: string }`.
- `DELETE /api/kanban/boards/:id`: Remove board e dependentes.

### Colunas
- `POST   /api/kanban/boards/:id/colunas`: Cria nova coluna ao final.
- `PUT    /api/kanban/colunas/:id`: Atualiza `nome`, `cor` ou `limite_wip`.
- `PUT    /api/kanban/colunas/reordenar`: `{ colunas: { id: string, ordem: number }[] }`.

### Cards
- `GET    /api/kanban/boards/:id/cards`: Retorna todos os cards de um board (com filtros OData/PostgREST).
- `POST   /api/kanban/boards/:id/cards`: Cria card na primeira coluna.
- `PUT    /api/kanban/cards/:id`: Update parcial de campos (titulo, descrição, prioridade).
- `PUT    /api/kanban/cards/:id/mover`: `{ coluna_id: string, nova_ordem: number }`. Implementa a lógica de reatribuição de `ordem` para todos os cards das colunas afetadas.

---

## 5. Lógica de Negócio Crítica

### 5.1 Reordenação de Cards
A `ordem` deve ser mantida como uma sequência de inteiros iniciando em 0.
- **Movimento Interno**: Troca ordens entre os índices afetados.
- **Movimento entre Colunas**: O card removido causa um "shift" negativo nos cards subsequentes da coluna de origem. Na coluna de destino, ele é inserido na `nova_ordem`, dando "shift" positivo nos seguintes.

### 5.2 WIP Limits (Soft Limit)
O backend não deve bloquear a inclusão de cards acima do limite. O limite é uma métrica de processo (Kanban/Lean). O sistema deve apenas sinalizar (campo `limite_wip` vs `count(*)`) para que o frontend exiba o alerta visual.

### 5.3 Campos Customizados (JSONB vs Tabelas)
- **JSONB (Recomendado)**: Maior flexibilidade para o usuário criar campos on-the-fly. Fácil de consultar no Postgres via operadores `->>`.
- **Tabelas Tipadas**: Melhor se houver necessidade de cálculos matemáticos pesados ou agregações complexas sobre valores numéricos em milhões de linhas.

---

## 6. Migração do Mock para Real

### 6.1 Mapeamento de Funções
| Função Atual (Frontend) | Ação de API / Hook |
| :--- | :--- |
| `novoCard()` | `useKanbanCards.mutate(POST /api/cards)` |
| `atualizarCard()` | `useKanbanCards.mutate(PUT /api/cards/:id)` |
| `excluirCard()` | `useKanbanCards.mutate(DELETE /api/cards/:id)` |
| `setBoard()` (Drag'n'Drop) | `useKanbanAPI.reorderCards(idArr)` |

### 6.2 Hooks Sugeridos
- `useKanbanBoards(orgId)`: Cache global dos painéis disponíveis.
- `useKanbanBoardData(boardId)`: Fetch detalhado do board, colunas e cards (otimizado com cache SWR/React Query).

---

## 7. Realtime (Futuro)
Para ambientes colaborativos, recomenda-se:
1. **Supabase Realtime**: Escutar mudanças na tabela `kanban_cards` filtradas por `board_id`.
2. **Optimistic UI**: Aplicar o movimento do card localmente antes da confirmação do servidor.
3. **Presence**: Mostrar quem está visualizando o card/board no momento para evitar conflitos de edição.
