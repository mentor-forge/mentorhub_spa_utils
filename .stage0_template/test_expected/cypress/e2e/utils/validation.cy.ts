describe('validationRules Utility', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.login()
    cy.visit('/demo', { timeout: 10000 })
    cy.url({ timeout: 5000 }).should('include', '/demo')
    cy.get('body', { timeout: 10000 }).should('be.visible')
    cy.wait(1000) // Wait for Vue app to render
  })
  
  afterEach(() => {
    cy.logout()
  })
  
  it('should display validation rule tests', () => {
    cy.contains('Required test:').should('be.visible')
    cy.contains('Name pattern test:').should('be.visible')
  })
})
