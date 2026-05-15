/**
 * Shared Cypress auth for SPAs and the spa_utils demo:
 * programmatic login via HS256 JWT + localStorage (no UI, no real IdP).
 *
 * Requires `registerJwtSignTask` in `setupNodeEvents` and `env.JWT_SECRET`
 * (see `e2eDefaultJwtSecret()` in cypress config).
 */

export interface RegisterAuthCommandsOptions {
  /**
   * First navigation after seeding auth. Default `'/'` matches all current apps
   * (each router redirects `/` to the main shell).
   */
  visitPath?: string
  /** Substring that must not appear in the URL after login (default `'/login'`). */
  expectNotLoginPath?: string
}

const defaultOptions: Required<RegisterAuthCommandsOptions> = {
  visitPath: '/',
  expectNotLoginPath: '/login',
}

export function registerAuthCommands(options: RegisterAuthCommandsOptions = {}): void {
  const visitPath = options.visitPath ?? defaultOptions.visitPath
  const expectNotLoginPath =
    options.expectNotLoginPath ?? defaultOptions.expectNotLoginPath

  Cypress.Commands.add('login', (roles?: string[]) => {
    const roleList = roles?.length ? roles : ['admin']
    const secret = Cypress.env('JWT_SECRET') as string

    cy.task<{ token: string; expiresAt: string }>('signCypressJwt', {
      roles: roleList,
      secret,
    }).then(({ token, expiresAt }) => {
      cy.visit(visitPath, {
        onBeforeLoad(win) {
          win.localStorage.setItem('access_token', token)
          win.localStorage.setItem('token_expires_at', expiresAt)
          win.localStorage.setItem('user_roles', JSON.stringify(roleList))
        },
      })
    })

    cy.url({ timeout: 10000 }).should('not.include', expectNotLoginPath)
    cy.wait(300)
  })
}

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Seeds a valid dev JWT and localStorage session, then visits `visitPath`
       * from registerAuthCommands options (default `'/'`).
       */
      login(roles?: string[]): Chainable<void>
    }
  }
}

export {}
