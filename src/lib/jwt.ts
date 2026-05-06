import { jwtVerify, SignJWT, JWTPayload } from 'jose'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-change-me'
)

export interface Op7NexoPayload extends JWTPayload {
  sub?: string
  email?: string
  role?: string
  level?: number
  org_id?: string
}

export async function verifyToken(token: string): Promise<Op7NexoPayload> {
  const { payload } = await jwtVerify(token, SECRET, {
    clockTolerance: 60,
  })
  return payload as Op7NexoPayload
}

export async function createToken(payload: Op7NexoPayload, exp = '1h'): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(SECRET)
}
