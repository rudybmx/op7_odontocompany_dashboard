import postgres from 'postgres'

// Cliente postgres para queries - lazy init pra nao falhar no build.
// IMPORTANTE: ler DATABASE_URL dentro do getSql(), não no topo do módulo,
// porque o Next pode avaliar o arquivo durante build sem as envs de runtime.
let _sql: ReturnType<typeof postgres> | null = null

export function getSql() {
  if (!_sql) {
    const connectionString = process.env['DATABASE_URL']
    if (!connectionString) {
      throw new Error('DATABASE_URL nao configurada')
    }
    _sql = postgres(connectionString, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: false,
    })
  }
  return _sql
}

// Exporta proxy pra usar como sql`...`
// Precisa de apply trap porque postgres() retorna uma funcao (template tag)
export const sql = new Proxy(function() {} as unknown as ReturnType<typeof postgres>, {
  get(_, prop) {
    const client = getSql()
    return (client as any)[prop]
  },
  apply(_target, _this, args) {
    const client = getSql()
    return (client as any)(...args)
  },
})

export async function healthCheck(): Promise<boolean> {
  try {
    const client = getSql()
    const result = await client`SELECT 1 as ok`
    return result[0]?.ok === 1
  } catch {
    return false
  }
}
