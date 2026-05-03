import { NextResponse } from 'next/server'
import { getSql } from '@/lib/db'

export const dynamic = 'force-dynamic'

type DbConversation = {
  id: string
  instance: string
  remote_jid: string
  status: 'nova' | 'em_atendimento' | 'aguardando' | 'resolvida' | 'arquivada'
  ia_ativa: boolean
  nao_lidas: number
  ultima_mensagem: string | null
  ultima_msg_at: Date | string | null
  agente: string | null
  campanha: string | null
  contato_id: string
  telefone: string | null
  contato_nome: string | null
  avatar_url: string | null
  tags: string[] | null
  mensagens: Array<{
    id: string
    direcao: 'entrada' | 'saida'
    conteudo: string
    remetenteNome: string | null
    remetenteTipo: 'contato' | 'agente' | 'ia' | 'sistema'
    enviadaEm: string | null
    recebidaEm: string | null
    criadaEm: string | null
  }>
}

function iso(value: Date | string | null | undefined) {
  if (!value) return null
  return value instanceof Date ? value.toISOString() : value
}

function formatPhone(telefone: string | null, remoteJid: string) {
  const digits = telefone || remoteJid.split('@')[0]?.replace(/\D/g, '') || remoteJid
  if (!digits.startsWith('55') || digits.length < 12) return digits
  return `+55 ${digits.slice(2, 4)} ${digits.slice(4)}`
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const limitParam = Number(url.searchParams.get('limit') || '80')
    const limit = Math.min(Math.max(Number.isFinite(limitParam) ? limitParam : 80, 1), 200)
    const instance = url.searchParams.get('instance') || 'opcl'

    const db = getSql()
    const rows = await db<DbConversation[]>`
      SELECT
        c.id::text,
        c.instance,
        c.remote_jid,
        c.status,
        c.ia_ativa,
        c.nao_lidas,
        c.ultima_mensagem,
        c.ultima_msg_at,
        c.agente,
        c.campanha,
        ct.id::text AS contato_id,
        ct.telefone,
        COALESCE(ct.nome, ct.push_name, ct.telefone, ct.jid) AS contato_nome,
        ct.avatar_url,
        ct.tags,
        COALESCE(msgs.mensagens, '[]'::jsonb) AS mensagens
      FROM public.crm_whatsapp_conversas c
      JOIN public.crm_whatsapp_contatos ct ON ct.id = c.contato_id
      LEFT JOIN LATERAL (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', m.id::text,
            'direcao', m.direcao,
            'conteudo', m.conteudo,
            'remetenteNome', m.remetente_nome,
            'remetenteTipo', m.remetente_tipo,
            'enviadaEm', m.enviada_em,
            'recebidaEm', m.recebida_em,
            'criadaEm', m.created_at
          )
          ORDER BY COALESCE(m.enviada_em, m.recebida_em, m.created_at) ASC
        ) AS mensagens
        FROM (
          SELECT *
          FROM public.crm_whatsapp_mensagens mx
          WHERE mx.conversa_id = c.id
          ORDER BY COALESCE(mx.enviada_em, mx.recebida_em, mx.created_at) DESC
          LIMIT 120
        ) m
      ) msgs ON true
      WHERE c.instance = ${instance}
      ORDER BY c.ultima_msg_at DESC NULLS LAST, c.updated_at DESC
      LIMIT ${limit}
    `

    const conversations = rows.map((row) => ({
      id: row.id,
      instance: row.instance,
      remoteJid: row.remote_jid,
      status: row.status,
      iaAtiva: row.ia_ativa,
      naoLidas: row.nao_lidas,
      ultimaMensagem: row.ultima_mensagem || '',
      ultimaMensagemAt: iso(row.ultima_msg_at),
      agente: row.agente || 'Wersun',
      campanha: row.campanha,
      canal: 'whatsapp',
      tags: row.tags?.length ? row.tags : ['WhatsApp', 'Evolution'],
      contato: {
        id: row.contato_id,
        nome: row.contato_nome || formatPhone(row.telefone, row.remote_jid),
        telefone: formatPhone(row.telefone, row.remote_jid),
        remoteJid: row.remote_jid,
        avatarUrl: row.avatar_url,
      },
      mensagens: row.mensagens || [],
    }))

    return NextResponse.json({ conversations, source: 'postgres', count: conversations.length })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro inesperado'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
