/**
 * Generic Admin Page E2E tests for consuming apps (e.g. vue_vuetify template).
 * Tests the shared AdminPage component from spa_utils.
 */
const STUB_TOKEN = {
  display_name: 'Ada Lovelace',
  profile_id: 'A00000000000000000000001',
  customer_id: 'D00000000000000000000006',
  mentor_id: 'B00000000000000000000002',
  roles: ['admin'],
}

describe('Admin Page', () => {
  beforeEach(() => {
    cy.login(['admin'])
    cy.intercept('GET', '**/api/config', {
      statusCode: 200,
      body: {
        config_items: [],
        versions: [],
        enumerators: [],
        token: STUB_TOKEN,
      },
    }).as('configOk')
  })

  it('should display admin page', () => {
    cy.visit('/config')
    cy.url().should('include', '/config')
    cy.contains('Admin - Configuration').should('be.visible')
  })

  it('should display configuration information', () => {
    cy.visit('/config')
    cy.get('[data-automation-id="admin-tab-config"]').should('be.visible')
  })

  it('should display configuration tabs', () => {
    cy.visit('/config')
    cy.get('[data-automation-id="admin-tab-config"]').should('be.visible')
    cy.get('[data-automation-id="admin-tab-versions"]').should('be.visible')
    cy.get('[data-automation-id="admin-tab-enumerators"]').should('be.visible')
    cy.get('[data-automation-id="admin-tab-token"]').should('be.visible')
  })

  it('should display token display_name, profile, customer, and mentor ids', () => {
    cy.visit('/config')
    cy.get('[data-automation-id="admin-tab-token"]').click()
    cy.get('[data-automation-id="admin-token-display-name-display"]')
      .should('be.visible')
      .find('input')
      .should('have.value', STUB_TOKEN.display_name)
    cy.get('[data-automation-id="admin-token-profile-id-display"]')
      .should('be.visible')
      .find('input')
      .should('have.value', STUB_TOKEN.profile_id)
    cy.get('[data-automation-id="admin-token-customer-id-display"]')
      .should('be.visible')
      .find('input')
      .should('have.value', STUB_TOKEN.customer_id)
    cy.get('[data-automation-id="admin-token-mentor-id-display"]')
      .should('be.visible')
      .find('input')
      .should('have.value', STUB_TOKEN.mentor_id)
  })
})
