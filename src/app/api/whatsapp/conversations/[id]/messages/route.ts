import { NextResponse } from 'next/server'
import { getSql } from '@/lib/db'

export const dynamic = 'force-dynamic'

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const url = new URL(request.url)
    const limitParam = Number(url.searchParams.get('limit') || '120')
    const limit = Math.min(Math.max(Number.isFinite(limitParam) ? limitParam : 120, 1), 300)

    const db = getSql()
    const rows = await db`
      SELECT
        id::text,
        direcao,
        conteudo,
        remetente_nome,
        remetente_tipo,
        enviada_em,
        recebida_em,
        created_at
      FROM public.crm_whatsapp_mensagens
      WHERE conversa_id = ${id}::uuid
      ORDER BY COALESCE(enviada_em, recebida_em, created_at) DESC
      LIMIT ${limit}
    `

    const messages = rows.reverse().map((row) => ({
      id: row.id,
      direcao: row.direcao,
      conteudo: row.conteudo,
      remetenteNome: row.remetente_nome,
      remetenteTipo: row.remetente_tipo,
      enviadaEm: row.enviada_em instanceof Date ? row.enviada_em.toISOString() : row.enviada_em,
      recebidaEm: row.recebida_em instanceof Date ? row.recebida_em.toISOString() : row.recebida_em,
      criadaEm: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
    }))

    return NextResponse.json({ messages, source: 'postgres', count: messages.length })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro inesperado'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
