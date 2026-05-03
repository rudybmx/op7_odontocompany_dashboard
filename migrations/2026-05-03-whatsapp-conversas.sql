-- =====================================================================
-- WerSun CRM WhatsApp / Evolution
-- Banco: Postgres existente postgres_wersun / database wersun
-- Objetivo: conversas reais tipo WhatsApp Web + base consultavel por IA
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Contatos vindos do WhatsApp/Evolution.
CREATE TABLE IF NOT EXISTS public.crm_whatsapp_contatos (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id              UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  jid                 TEXT NOT NULL,
  telefone            TEXT,
  nome                TEXT,
  push_name           TEXT,
  avatar_url          TEXT,
  origem              TEXT NOT NULL DEFAULT 'evolution',
  tags                TEXT[] NOT NULL DEFAULT ARRAY['WhatsApp','Evolution'],
  perfil_json         JSONB NOT NULL DEFAULT '{}'::jsonb,
  resumo_ia           TEXT,
  sentimento_ia       TEXT,
  score_lead_ia       INTEGER CHECK (score_lead_ia IS NULL OR (score_lead_ia >= 0 AND score_lead_ia <= 100)),
  last_message_at     TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(jid)
);

DROP TRIGGER IF EXISTS trg_crm_whatsapp_contatos_updated_at ON public.crm_whatsapp_contatos;
CREATE TRIGGER trg_crm_whatsapp_contatos_updated_at
BEFORE UPDATE ON public.crm_whatsapp_contatos
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Conversas abertas/fechadas por contato e instancia Evolution.
CREATE TABLE IF NOT EXISTS public.crm_whatsapp_conversas (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id              UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  contato_id          UUID NOT NULL REFERENCES public.crm_whatsapp_contatos(id) ON DELETE CASCADE,
  instance            TEXT NOT NULL DEFAULT 'opcl',
  remote_jid          TEXT NOT NULL,
  status              TEXT NOT NULL DEFAULT 'em_atendimento' CHECK (status IN ('nova','em_atendimento','aguardando','resolvida','arquivada')),
  ia_ativa            BOOLEAN NOT NULL DEFAULT true,
  responsavel_id      UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  agente              TEXT NOT NULL DEFAULT 'Wersun',
  campanha            TEXT,
  etapa_funil         TEXT,
  prioridade          INTEGER NOT NULL DEFAULT 0,
  nao_lidas           INTEGER NOT NULL DEFAULT 0 CHECK (nao_lidas >= 0),
  ultima_mensagem     TEXT,
  ultima_direcao      TEXT CHECK (ultima_direcao IS NULL OR ultima_direcao IN ('entrada','saida')),
  ultima_msg_at       TIMESTAMPTZ,
  resumo_ia           TEXT,
  proximas_acoes_ia   JSONB NOT NULL DEFAULT '[]'::jsonb,
  contexto_ia         JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(instance, remote_jid)
);

DROP TRIGGER IF EXISTS trg_crm_whatsapp_conversas_updated_at ON public.crm_whatsapp_conversas;
CREATE TRIGGER trg_crm_whatsapp_conversas_updated_at
BEFORE UPDATE ON public.crm_whatsapp_conversas
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Eventos brutos recebidos da Evolution, para auditoria e reprocessamento.
CREATE TABLE IF NOT EXISTS public.crm_whatsapp_eventos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event           TEXT,
  instance        TEXT NOT NULL DEFAULT 'opcl',
  remote_jid      TEXT,
  evolution_msg_id TEXT,
  payload         JSONB NOT NULL,
  recebido_em     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Mensagens individuais. Guardamos payload original para IA e auditoria.
CREATE TABLE IF NOT EXISTS public.crm_whatsapp_mensagens (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversa_id       UUID NOT NULL REFERENCES public.crm_whatsapp_conversas(id) ON DELETE CASCADE,
  contato_id        UUID REFERENCES public.crm_whatsapp_contatos(id) ON DELETE SET NULL,
  evolution_msg_id  TEXT,
  instance          TEXT NOT NULL DEFAULT 'opcl',
  remote_jid        TEXT NOT NULL,
  direcao           TEXT NOT NULL CHECK (direcao IN ('entrada','saida')),
  from_me           BOOLEAN NOT NULL DEFAULT false,
  remetente_tipo    TEXT NOT NULL DEFAULT 'contato' CHECK (remetente_tipo IN ('contato','agente','ia','sistema')),
  remetente_nome    TEXT,
  conteudo          TEXT NOT NULL,
  message_type      TEXT NOT NULL DEFAULT 'text',
  status            TEXT,
  payload           JSONB NOT NULL DEFAULT '{}'::jsonb,
  tokens_estimados  INTEGER,
  embedding_status  TEXT NOT NULL DEFAULT 'pendente' CHECK (embedding_status IN ('pendente','processado','ignorado','erro')),
  enviada_em        TIMESTAMPTZ,
  recebida_em       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  busca             TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('portuguese', coalesce(conteudo,'') || ' ' || coalesce(remetente_nome,''))
  ) STORED
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_crm_whatsapp_mensagens_evolution_msg
  ON public.crm_whatsapp_mensagens(instance, evolution_msg_id)
  WHERE evolution_msg_id IS NOT NULL;

-- Memorias/insights persistentes extraidos por IA das conversas.
-- Ex.: preferencias do cliente, objeções, objetivo, intenção de compra, follow-up.
CREATE TABLE IF NOT EXISTS public.crm_whatsapp_memorias_ia (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversa_id     UUID REFERENCES public.crm_whatsapp_conversas(id) ON DELETE CASCADE,
  contato_id      UUID REFERENCES public.crm_whatsapp_contatos(id) ON DELETE CASCADE,
  tipo            TEXT NOT NULL DEFAULT 'observacao',
  titulo          TEXT,
  conteudo        TEXT NOT NULL,
  confianca       NUMERIC(4,3) CHECK (confianca IS NULL OR (confianca >= 0 AND confianca <= 1)),
  fonte_msg_id    UUID REFERENCES public.crm_whatsapp_mensagens(id) ON DELETE SET NULL,
  metadata        JSONB NOT NULL DEFAULT '{}'::jsonb,
  ativa           BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  busca           TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('portuguese', coalesce(titulo,'') || ' ' || coalesce(conteudo,''))
  ) STORED
);

DROP TRIGGER IF EXISTS trg_crm_whatsapp_memorias_ia_updated_at ON public.crm_whatsapp_memorias_ia;
CREATE TRIGGER trg_crm_whatsapp_memorias_ia_updated_at
BEFORE UPDATE ON public.crm_whatsapp_memorias_ia
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Contexto consolidado para uma IA responder com historico sem precisar varrer tudo.
CREATE OR REPLACE VIEW public.vw_crm_whatsapp_contexto_ia AS
SELECT
  c.id AS conversa_id,
  c.instance,
  c.remote_jid,
  ct.telefone,
  COALESCE(ct.nome, ct.push_name, ct.telefone, ct.jid) AS contato_nome,
  c.status,
  c.ia_ativa,
  c.nao_lidas,
  c.ultima_mensagem,
  c.ultima_msg_at,
  c.resumo_ia AS resumo_conversa_ia,
  ct.resumo_ia AS resumo_contato_ia,
  ct.sentimento_ia,
  ct.score_lead_ia,
  COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'id', m.id,
        'direcao', m.direcao,
        'remetente', m.remetente_nome,
        'conteudo', m.conteudo,
        'quando', COALESCE(m.enviada_em, m.recebida_em)
      )
      ORDER BY COALESCE(m.enviada_em, m.recebida_em) DESC
    ) FILTER (WHERE m.id IS NOT NULL),
    '[]'::jsonb
  ) AS ultimas_mensagens
FROM public.crm_whatsapp_conversas c
JOIN public.crm_whatsapp_contatos ct ON ct.id = c.contato_id
LEFT JOIN LATERAL (
  SELECT *
  FROM public.crm_whatsapp_mensagens mx
  WHERE mx.conversa_id = c.id
  ORDER BY COALESCE(mx.enviada_em, mx.recebida_em) DESC
  LIMIT 30
) m ON true
GROUP BY c.id, ct.id;

CREATE INDEX IF NOT EXISTS idx_crm_whatsapp_contatos_jid
  ON public.crm_whatsapp_contatos(jid);
CREATE INDEX IF NOT EXISTS idx_crm_whatsapp_contatos_telefone
  ON public.crm_whatsapp_contatos(telefone);
CREATE INDEX IF NOT EXISTS idx_crm_whatsapp_conversas_ultima
  ON public.crm_whatsapp_conversas(ultima_msg_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_crm_whatsapp_conversas_status
  ON public.crm_whatsapp_conversas(status, ultima_msg_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_crm_whatsapp_mensagens_conversa_data
  ON public.crm_whatsapp_mensagens(conversa_id, COALESCE(enviada_em, recebida_em));
CREATE INDEX IF NOT EXISTS idx_crm_whatsapp_mensagens_remote_jid
  ON public.crm_whatsapp_mensagens(instance, remote_jid, COALESCE(enviada_em, recebida_em) DESC);
CREATE INDEX IF NOT EXISTS idx_crm_whatsapp_mensagens_busca
  ON public.crm_whatsapp_mensagens USING GIN(busca);
CREATE INDEX IF NOT EXISTS idx_crm_whatsapp_memorias_busca
  ON public.crm_whatsapp_memorias_ia USING GIN(busca);
CREATE INDEX IF NOT EXISTS idx_crm_whatsapp_eventos_msg
  ON public.crm_whatsapp_eventos(instance, evolution_msg_id);
