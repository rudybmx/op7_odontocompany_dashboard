import { NextResponse } from 'next/server'
import { getUserFromRequest, unauthorized } from '@/lib/api-auth'
import { sql } from '@/lib/db'
import type { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return unauthorized()

  try {
    // Busca perfil via user_profiles + org_members
    const perfis = await sql`
      SELECT 
        u.id,
        u.email,
        COALESCE(p.full_name, u.email) as nome,
        p.avatar_url,
        p.phone as telefone,
        m.role as cargo,
        m.org_id,
        o.name as org_nome,
        o.slug as org_slug,
        o.level as nivel
      FROM auth.users u
      LEFT JOIN public.user_profiles p ON p.id = u.id
      LEFT JOIN public.org_members m ON m.user_id = u.id AND m.is_active = true
      LEFT JOIN public.organizations o ON o.id = m.org_id AND o.is_active = true AND o.deleted_at IS NULL
      WHERE u.id = ${user.id}
        AND u.deleted_at IS NULL
      ORDER BY o.level ASC
      LIMIT 1
    `

    if (perfis.length === 0) {
      return NextResponse.json({ error: 'Perfil nao encontrado' }, { status: 404 })
    }

    return NextResponse.json(perfis[0])
  } catch (err) {
    console.error('[API /auth/me] erro:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
