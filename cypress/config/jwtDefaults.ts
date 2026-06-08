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
