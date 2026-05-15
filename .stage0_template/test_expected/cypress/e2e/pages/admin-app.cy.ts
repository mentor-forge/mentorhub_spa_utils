/**
 * Generic Admin Page E2E tests for consuming apps (e.g. vue_vuetify template).
 * Tests the shared AdminPage component from spa_utils.
 */
describe('Admin Page', () => {
  beforeEach(() => {
    cy.login(['admin'])
  })

  it('should display admin page', () => {
    cy.visit('/admin')
    cy.contains('Admin - Configuration').should('be.visible')
  })

  it('should display configuration information', () => {
    cy.visit('/admin')
    cy.get('[data-automation-id="admin-tab-config"]').should('be.visible')
  })

  it('should display configuration tabs', () => {
    cy.visit('/admin')
    cy.get('[data-automation-id="admin-tab-config"]').should('be.visible')
    cy.get('[data-automation-id="admin-tab-versions"]').should('be.visible')
    cy.get('[data-automation-id="admin-tab-enumerators"]').should('be.visible')
    cy.get('[data-automation-id="admin-tab-token"]').should('be.visible')
  })
})
