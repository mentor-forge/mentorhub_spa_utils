// Demo-specific Cypress commands. Shared auth: registerAuthCommands (also used by product SPAs).
import { registerAuthCommands } from './registerAuthCommands'

registerAuthCommands({ visitPath: '/' })

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

      cy.location('pathname', { timeout: 5000 }).should('eq', '/')
    }
  })
})

Cypress.Commands.add('waitForDemoPage', () => {
  cy.url({ timeout: 10000 }).should('include', '/demo')
  cy.contains('h1, h2, h3, h4', 'spa_utils Component Testing', { timeout: 10000 })
    .should('be.visible')
})

Cypress.Commands.add('waitForAdminPage', () => {
  cy.url({ timeout: 5000 }).should('include', '/admin')
  cy.contains('Admin - Configuration', { timeout: 10000 })
    .should('be.visible')
})

declare global {
  namespace Cypress {
    interface Chainable {
      logout(): Chainable<void>
      waitForDemoPage(): Chainable<void>
      waitForAdminPage(): Chainable<void>
    }
  }
}

export {}
