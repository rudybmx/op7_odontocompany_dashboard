import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const GOTRUE_URL = process.env.AUTH_URL || 'https://auth.qozt.com.br'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, nome } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email e senha sao obrigatorios' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Senha deve ter no minimo 6 caracteres' }, { status: 400 })
    }

    // Usa GoTrue API para criar usuario
    const response = await fetch(`${GOTRUE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        data: {
          full_name: nome || email.split('@')[0],
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      const msg = data?.msg || data?.message || 'Erro ao criar conta'
      return NextResponse.json({ error: msg }, { status: response.status })
    }

    return NextResponse.json({
      user: {
        id: data.user?.id || data.id,
        email: data.user?.email || data.email,
      },
      message: 'Conta criada com sucesso. Verifique seu email se necessario.',
    })

  } catch (err) {
    console.error('[API /auth/register] erro:', err)
    return NextResponse.json({ error: 'Erro interno ao criar conta' }, { status: 500 })
  }
}
