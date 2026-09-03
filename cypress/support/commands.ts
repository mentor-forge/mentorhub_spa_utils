// Demo-specific Cypress commands. Shared auth: registerAuthCommands (also used by product SPAs).
import { registerAuthCommands } from './registerAuthCommands'

registerAuthCommands({ visitPath: '/' })

/** Fixture name used when stubbing JWT `display_name` (live DE tokens may omit the claim). */
export const CYPRESS_STUB_DISPLAY_NAME = 'Ada Lovelace'

function decodeJwtPayload(token: string): Record<string, unknown> {
  const parts = token.split('.')
  if (parts.length < 2 || !parts[1]) {
    throw new Error('stubJwtDisplayName: access_token is not a JWT')
  }
  const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
  return JSON.parse(atob(padded)) as Record<string, unknown>
}

function encodeJwtPayload(payload: Record<string, unknown>): string {
  return btoa(JSON.stringify(payload))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

/**
 * Patches the stored Cypress JWT payload with `display_name` and reloads so
 * packaged PageFrame `readDisplayName()` sees the claim.
 *
 * Live Developer Edition tokens and `signCypressJwt` still omit `display_name`.
 * This stub is Cypress-only; it does not add demo app display_name logic.
 */
Cypress.Commands.add('stubJwtDisplayName', (displayName = CYPRESS_STUB_DISPLAY_NAME) => {
  cy.window().then((win) => {
    const token = win.localStorage.getItem('access_token')
    if (!token) {
      throw new Error('stubJwtDisplayName requires an access_token in localStorage')
    }
    const parts = token.split('.')
    const payload = decodeJwtPayload(token)
    payload.display_name = displayName
    win.localStorage.setItem(
      'access_token',
      `${parts[0]}.${encodeJwtPayload(payload)}.${parts[2] ?? ''}`
    )
  })
  cy.reload()
})

/**
 * Logout command - logs out via the navigation drawer
 * Ensures clean state for subsequent tests
 */
Cypress.Commands.add('logout', () => {
  cy.get('body').then(($body) => {
    const drawerToggle = $body.find('[data-automation-id="nav-drawer-toggle"]')

    if (drawerToggle.length > 0) {
      cy.get('[data-automation-id="nav-drawer-toggle"]').then(() => {
        cy.get('body').then(($bodyCheck) => {
          const logoutLink = $bodyCheck.find('[data-automation-id="nav-logout-link"]')
          if (logoutLink.length === 0 || !logoutLink.is(':visible')) {
            cy.get('[data-automation-id="nav-drawer-toggle"]').click()
            cy.wait(500)
          }
        })
      })

      cy.get('[data-automation-id="nav-logout-link"]', { timeout: 5000 })
        .should('exist')
        .scrollIntoView()
        .click({ force: true })
    } else {
      cy.clearLocalStorage()
    }
  })
})

Cypress.Commands.add('waitForDemoPage', () => {
  cy.url({ timeout: 10000 }).should('include', '/demo')
  cy.contains('h1, h2, h3, h4', 'spa_utils Component Testing', { timeout: 10000 })
    .should('be.visible')
})

Cypress.Commands.add('waitForAdminPage', () => {
  cy.url({ timeout: 5000 }).should('include', '/config')
  cy.contains('Admin - Configuration', { timeout: 10000 })
    .should('be.visible')
})

declare global {
  namespace Cypress {
    interface Chainable {
      logout(): Chainable<void>
      waitForDemoPage(): Chainable<void>
      waitForAdminPage(): Chainable<void>
      /**
       * Patches the stored JWT with `display_name` and reloads.
       * Required because live DE / signCypressJwt tokens omit the claim.
       */
      stubJwtDisplayName(displayName?: string): Chainable<void>
    }
  }
}

export {}
