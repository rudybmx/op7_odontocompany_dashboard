# Schema do Banco de Dados — Agenda e NPS

> **Banco:** PostgreSQL 16 · Supabase  
> **Multi-tenant:** isolamento por `org_id` via RLS + JWT claim

---

## Tabelas

### `agendas`
```sql
CREATE TABLE agendas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES orgs(id),
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('profissional','sala','equipamento','outro')),
  cor TEXT NOT NULL,
  capacidade_simultanea INTEGER NOT NULL DEFAULT 1,
  fuso_horario TEXT NOT NULL DEFAULT 'America/Sao_Paulo',
  webhook_url TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `horarios_agenda`
```sql
CREATE TABLE horarios_agenda (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agenda_id UUID NOT NULL REFERENCES agendas(id) ON DELETE CASCADE,
  dia_semana TEXT NOT NULL CHECK (dia_semana IN ('dom','seg','ter','qua','qui','sex','sab')),
  ativo BOOLEAN NOT NULL DEFAULT true,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  duracao_slot_minutos INTEGER NOT NULL DEFAULT 30,
  tem_almoco BOOLEAN NOT NULL DEFAULT false,
  almoco_inicio TIME,
  almoco_fim TIME,
  UNIQUE (agenda_id, dia_semana)
);
```

### `bloqueios`
```sql
CREATE TABLE bloqueios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES orgs(id),
  agenda_id UUID REFERENCES agendas(id) ON DELETE CASCADE, -- NULL = global
  motivo TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('reuniao','feriado','agenda_cheia','manutencao','outro')),
  inicio TIMESTAMPTZ NOT NULL,
  fim TIMESTAMPTZ NOT NULL,
  observacoes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `agendamentos`
```sql
CREATE TABLE agendamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES orgs(id),
  agenda_id UUID NOT NULL REFERENCES agendas(id),
  -- Cliente
  cliente_nome TEXT NOT NULL,
  cliente_telefone TEXT NOT NULL,
  cliente_email TEXT,
  -- Horário
  data_hora_inicio TIMESTAMPTZ NOT NULL,
  data_hora_fim TIMESTAMPTZ NOT NULL,
  -- Classificação
  servico TEXT,
  observacoes TEXT,
  -- Controle
  status TEXT NOT NULL DEFAULT 'agendado' CHECK (status IN (
    'agendado','confirmado','em_atendimento','compareceu','falta','cancelado','bloqueado','reagendado'
  )),
  origem TEXT NOT NULL DEFAULT 'manual' CHECK (origem IN ('manual','agente','api','paciente')),
  criado_por TEXT,
  -- Cancelamento
  cancelamento_motivo TEXT,
  cancelado_por TEXT,
  cancelado_em TIMESTAMPTZ,
  -- Reagendamento
  reagendado_de UUID REFERENCES agendamentos(id),
  -- NPS
  nps_enviado BOOLEAN NOT NULL DEFAULT false,
  nps_enviado_em TIMESTAMPTZ,
  nps_score INTEGER CHECK (nps_score BETWEEN 0 AND 10),
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `lembretes_config`
```sql
CREATE TABLE lembretes_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES orgs(id),
  agenda_id UUID REFERENCES agendas(id),          -- NULL = padrão global
  ativo BOOLEAN NOT NULL DEFAULT true,
  canal TEXT NOT NULL CHECK (canal IN ('whatsapp','email','sms','push')),
  dias_antes INTEGER NOT NULL DEFAULT 1,
  hora_envio TIME,
  horas_antes INTEGER,
  mensagem_template TEXT NOT NULL,
  tem_midia BOOLEAN NOT NULL DEFAULT false,
  midia_url TEXT,
  midia_tipo TEXT CHECK (midia_tipo IN ('imagem','video','documento')),
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `nps_config`
```sql
CREATE TABLE nps_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES orgs(id),
  agenda_id UUID REFERENCES agendas(id),          -- NULL = global
  ativo BOOLEAN NOT NULL DEFAULT true,
  trigger TEXT NOT NULL DEFAULT 'automatico' CHECK (trigger IN ('automatico','manual')),
  horas_apos_atendimento INTEGER DEFAULT 2,
  canal TEXT NOT NULL DEFAULT 'whatsapp' CHECK (canal IN ('whatsapp','email','sms','push')),
  mensagem_template TEXT NOT NULL,
  msg_promotor TEXT,          -- Mensagem após score 9-10
  msg_neutro TEXT,            -- Mensagem após score 7-8
  msg_detrator TEXT,          -- Mensagem após score 0-6
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `nps_respostas`
```sql
CREATE TABLE nps_respostas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES orgs(id),
  agendamento_id UUID NOT NULL REFERENCES agendamentos(id),
  agenda_id UUID NOT NULL REFERENCES agendas(id),
  cliente_nome TEXT NOT NULL,
  cliente_telefone TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 10),
  categoria TEXT NOT NULL CHECK (categoria IN ('promotor','neutro','detrator')),
  feedback_texto TEXT,
  enviado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  respondido_em TIMESTAMPTZ,
  canal TEXT NOT NULL,
  enviado_automaticamente BOOLEAN NOT NULL DEFAULT false,
  acao_tomada TEXT,
  acao_tomada_em TIMESTAMPTZ,
  acao_tomada_por TEXT,         -- user_id do colaborador
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Row Level Security (RLS)

```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE agendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE horarios_agenda ENABLE ROW LEVEL SECURITY;
ALTER TABLE bloqueios ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE lembretes_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE nps_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE nps_respostas ENABLE ROW LEVEL SECURITY;

-- Política padrão: isolamento por org_id via JWT claim
-- A função auth.jwt() retorna o payload do JWT do Supabase
CREATE POLICY "org_isolation_agendas" ON agendas
  USING (org_id = (auth.jwt() ->> 'org_id')::uuid);

CREATE POLICY "org_isolation_horarios" ON horarios_agenda
  USING (agenda_id IN (
    SELECT id FROM agendas WHERE org_id = (auth.jwt() ->> 'org_id')::uuid
  ));

CREATE POLICY "org_isolation_bloqueios" ON bloqueios
  USING (org_id = (auth.jwt() ->> 'org_id')::uuid);

CREATE POLICY "org_isolation_agendamentos" ON agendamentos
  USING (org_id = (auth.jwt() ->> 'org_id')::uuid);

CREATE POLICY "org_isolation_lembretes" ON lembretes_config
  USING (org_id = (auth.jwt() ->> 'org_id')::uuid);

CREATE POLICY "org_isolation_nps_config" ON nps_config
  USING (org_id = (auth.jwt() ->> 'org_id')::uuid);

CREATE POLICY "org_isolation_nps_respostas" ON nps_respostas
  USING (org_id = (auth.jwt() ->> 'org_id')::uuid);
```

---

## Índices

```sql
-- Agendamentos: buscas por agenda+data (calendario), org+status (dashboard), data global
CREATE INDEX idx_agendamentos_agenda_data ON agendamentos(agenda_id, data_hora_inicio);
CREATE INDEX idx_agendamentos_org_status  ON agendamentos(org_id, status);
CREATE INDEX idx_agendamentos_data        ON agendamentos(data_hora_inicio);
CREATE INDEX idx_agendamentos_nps         ON agendamentos(org_id, status, nps_enviado)
  WHERE status = 'compareceu';

-- NPS Respostas: relatórios e alertas
CREATE INDEX idx_nps_respostas_org        ON nps_respostas(org_id, created_at DESC);
CREATE INDEX idx_nps_respostas_agenda     ON nps_respostas(agenda_id, enviado_em DESC);
CREATE INDEX idx_nps_respostas_detratores ON nps_respostas(org_id, categoria)
  WHERE categoria = 'detrator' AND acao_tomada IS NULL;

-- Bloqueios: verificação de conflito de horário
CREATE INDEX idx_bloqueios_agenda_periodo ON bloqueios(agenda_id, inicio, fim);
```

---

## Lógica de Negócio

### Cálculo do NPS
```
NPS = (Número de Promotores − Número de Detratores) / Total de Respondentes × 100

Resultado: número inteiro de −100 a +100
```

| Faixa NPS | Classificação |
|-----------|---------------|
| ≥ 75      | Excelente     |
| 50–74     | Bom           |
| 0–49      | Em melhoria   |
| < 0       | Atenção       |

### Categorização por score
```
Score 0–6  → Detrator
Score 7–8  → Neutro
Score 9–10 → Promotor
```

### Função SQL utilitária
```sql
CREATE OR REPLACE FUNCTION calcular_nps(org UUID, desde TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days')
RETURNS TABLE(
  nps_score INTEGER,
  total INTEGER,
  promotores INTEGER,
  neutros INTEGER,
  detratores INTEGER,
  taxa_resposta NUMERIC
)
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  WITH respostas AS (
    SELECT categoria
    FROM nps_respostas
    WHERE org_id = org AND enviado_em >= desde
  ),
  contagens AS (
    SELECT
      COUNT(*)                                             AS total,
      COUNT(*) FILTER (WHERE categoria = 'promotor')      AS promotores,
      COUNT(*) FILTER (WHERE categoria = 'neutro')        AS neutros,
      COUNT(*) FILTER (WHERE categoria = 'detrator')      AS detratores
    FROM respostas
  )
  SELECT
    CASE WHEN total = 0 THEN 0
         ELSE ROUND(((promotores - detratores)::NUMERIC / total) * 100)::INTEGER
    END AS nps_score,
    total::INTEGER,
    promotores::INTEGER,
    neutros::INTEGER,
    detratores::INTEGER,
    -- taxa_resposta precisa cruzar com agendamentos enviados
    NULL::NUMERIC AS taxa_resposta
  FROM contagens;
$$;
```

---

## Política de Acesso API (PostgREST)

Todos os endpoints são expostos via PostgREST com autenticação JWT obrigatória:

```
Authorization: Bearer {supabase_anon_or_service_key}
X-Org-ID: {org_id}  ← injetado no JWT como claim 'org_id'
```

### Endpoints principais

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/agendas` | Lista agendas da org |
| POST | `/agendas` | Cria nova agenda |
| PATCH | `/agendas?id=eq.{id}` | Edita agenda |
| GET | `/agendamentos?agenda_id=eq.{id}&data_hora_inicio=gte.{from}&data_hora_inicio=lte.{to}` | Busca agendamentos por período |
| POST | `/agendamentos` | Cria agendamento |
| PATCH | `/agendamentos?id=eq.{id}` | Atualiza status |
| GET | `/nps_respostas?order=enviado_em.desc` | Lista respostas NPS |
| PATCH | `/nps_respostas?id=eq.{id}` | Registra ação |
| GET | `/nps_config?agenda_id=is.null` | Config global de NPS |
| PATCH | `/nps_config?id=eq.{id}` | Atualiza config |

### Edge Functions (Supabase Functions)
```
POST /functions/v1/enviar-nps     ← Trigger manual ou automático após 'compareceu'
POST /functions/v1/enviar-lembrete ← Cron: verifica e envia lembretes agendados
```

---

## Webhook Payload (Agendamento)

Enviado para `agendas.webhook_url` quando `agendamentos.status` muda.

```json
{
  "event": "agendamento.status_changed",
  "timestamp": "2025-04-19T15:30:00Z",
  "data": {
    "agendamento": {
      "id": "uuid",
      "status": "compareceu",
      "status_anterior": "em_atendimento",
      "cliente_nome": "Fernanda Rodrigues",
      "cliente_telefone": "11987654321",
      "cliente_email": "fernanda@email.com",
      "data_hora_inicio": "2025-04-19T09:00:00-03:00",
      "data_hora_fim": "2025-04-19T10:00:00-03:00",
      "servico": "Avaliação",
      "observacoes": null,
      "origem": "manual",
      "nps_enviado": false
    },
    "agenda": {
      "id": "uuid",
      "nome": "Dr. Rafael (Avaliação)",
      "tipo": "profissional",
      "cor": "#3E5BFF"
    },
    "org_id": "uuid"
  }
}
```

---

## Triggers SQL

```sql
-- Auto-atualizar updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER agendamentos_updated_at
  BEFORE UPDATE ON agendamentos
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER agendas_updated_at
  BEFORE UPDATE ON agendas
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Auto-categorizar NPS ao inserir
CREATE OR REPLACE FUNCTION set_nps_categoria()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.categoria = CASE
    WHEN NEW.score >= 9 THEN 'promotor'
    WHEN NEW.score >= 7 THEN 'neutro'
    ELSE 'detrator'
  END;
  RETURN NEW;
END;
$$;

CREATE TRIGGER nps_respostas_categoria
  BEFORE INSERT OR UPDATE OF score ON nps_respostas
  FOR EACH ROW EXECUTE FUNCTION set_nps_categoria();
```
