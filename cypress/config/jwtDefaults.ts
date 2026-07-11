/**
 * Default JWT signing secret for Cypress E2E when env is unset.
 * Matches Developer Edition CLI defaults and api_utils validation.
 */
export function e2eDefaultJwtSecret(): string {
  return (
    process.env.JWT_SECRET ??
    process.env.CYPRESS_JWT_SECRET ??
    'local-dev-jwt-secret-fixed'
  )
}

/** Default Cypress persona claims (Profile.0.1.0.0.json / welcome-auth.js). */
export const e2eDefaultProfileId = 'A00000000000000000000001'
export const e2eDefaultCustomerId = 'D00000000000000000000006'
export const e2eDefaultMentorId = ''
export const e2eDefaultSubject = 'cypress-user'
export const e2eDefaultName = 'Cypress User'