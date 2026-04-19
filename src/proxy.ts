import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOKIE = 'ws-session'
const LOGIN_PATH = '/login'

function getUserLevelFromToken(cookieValue: string): number | null {
  try {
    const parts = cookieValue.split('.')
    if (parts.length !== 3) return null
    const payload = JSON.parse(atob(parts[1]))
    return payload.level ?? null
  } catch {
    return null
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get(COOKIE)
  const isAuthenticated = !!sessionCookie?.value

  if (pathname.startsWith(LOGIN_PATH)) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url))
  }

  if (pathname.startsWith('/admin')) {
    const token = sessionCookie?.value
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    const level = getUserLevelFromToken(token)
    if (level === null || level !== 0) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
