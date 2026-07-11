import { signCypressJwt as buildCypressJwt } from '../tasks/signCypressJwt'

/** Registers Node task `signCypressJwt` (used by `cy.login` from registerAuthCommands). */
export function registerJwtSignTask(on: Cypress.PluginEvents): void {
  on('task', {
    signCypressJwt(opts: {
      roles: string[]
      secret: string
      sub?: string
      name?: string
      profile_id?: string
      customer_id?: string
      mentor_id?: string
    }) {
      return buildCypressJwt(opts)
    },
  })
}
