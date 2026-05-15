import jwt from 'jsonwebtoken'

export interface SignCypressJwtInput {
  roles: string[]
  secret: string
}

export interface SignCypressJwtResult {
  token: string
  expiresAt: string
}

/** HS256 JWT matching api_utils / Developer Edition defaults (issuer, audience, algorithm). */
export function signCypressJwt({ roles, secret }: SignCypressJwtInput): SignCypressJwtResult {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365
  const token = jwt.sign(
    { sub: 'cypress-user', iss: 'dev-idp', aud: 'dev-api', roles, exp },
    secret,
    { algorithm: 'HS256' }
  )
  return { token, expiresAt: new Date(exp * 1000).toISOString() }
}
