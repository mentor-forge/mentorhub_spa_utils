import { signCypressJwt as buildCypressJwt } from '../tasks/signCypressJwt'

/** Registers Node task `signCypressJwt` (used by `cy.login` from registerAuthCommands). */
export function registerJwtSignTask(on: Cypress.PluginEvents): void {
  on('task', {
    signCypressJwt(opts: { roles: string[]; secret: string }) {
      return buildCypressJwt(opts)
    },
  })
}
