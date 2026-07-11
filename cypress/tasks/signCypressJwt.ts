import jwt from 'jsonwebtoken'
import {
  e2eDefaultCustomerId,
  e2eDefaultMentorId,
  e2eDefaultName,
  e2eDefaultProfileId,
  e2eDefaultSubject,
} from '../config/jwtDefaults'

export interface SignCypressJwtInput {
  roles: string[]
  secret: string
  sub?: string
  name?: string
  profile_id?: string
  customer_id?: string
  mentor_id?: string
}

export interface SignCypressJwtResult {
  token: string
  expiresAt: string
}

/** HS256 JWT matching api_utils / Developer Edition defaults (issuer, audience, algorithm). */
export function signCypressJwt({
  roles,
  secret,
  sub,
  name,
  profile_id,
  customer_id,
  mentor_id,
}: SignCypressJwtInput): SignCypressJwtResult {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365
  const token = jwt.sign(
    {
      sub: sub ?? e2eDefaultSubject,
      name: name ?? e2eDefaultName,
      iss: 'dev-idp',
      aud: 'dev-api',
      roles,
      profile_id: profile_id ?? e2eDefaultProfileId,
      customer_id: customer_id ?? e2eDefaultCustomerId,
      mentor_id: mentor_id ?? e2eDefaultMentorId,
      exp,
    },
    secret,
    { algorithm: 'HS256' }
  )
  return { token, expiresAt: new Date(exp * 1000).toISOString() }
}
