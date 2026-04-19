const API = 'https://api.qozt.com.br'

/** Fetcher autenticado para uso direto com SWR.
 *  Lê o access_token do localStorage automaticamente.
 *  Uso: useSWR('/endpoint', apiGet)
 */
export async function apiGet<T = unknown>(endpoint: string): Promise<T> {
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('access_token')
    : null
  // Remove barra inicial se houver (evita double-slash na URL base)
  const path = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
  return apiFetch<T>(path, undefined, token)
}

export async function apiFetch<T>(
  endpoint: string,
  params?: Record<string, any>,
  token?: string | null
): Promise<T> {
  const url = new URL(`${API}/${endpoint}`)
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) {
        if (Array.isArray(v)) {
          v.forEach(val => url.searchParams.append(k, String(val)))
        } else {
          url.searchParams.append(k, String(v))
        }
      }
    })
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(`[API] Fetching: ${url.toString()}`)
  }

  const res = await fetch(url.toString(), { headers })
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`[API] Response ${res.status}: ${url.pathname}`)
  }

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      try {
        const { refreshToken, clearToken } = await import('./auth')
        const newToken = await refreshToken()
        
        headers['Authorization'] = `Bearer ${newToken}`
        const retryRes = await fetch(url.toString(), { headers })
        
        if (retryRes.ok) {
          return retryRes.json()
        }
        
        clearToken()
        window.location.href = '/login'
        throw new Error('Sessão expirada. Redirecionando para login...')

      } catch {
        const { clearToken } = await import('./auth')
        clearToken()
        window.location.href = '/login'
        throw new Error('Sessão expirada. Redirecionando para login...')
      }
    } else {
      throw new Error('Sessão expirada.')
    }
  }

  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`)

  return res.json()
}
