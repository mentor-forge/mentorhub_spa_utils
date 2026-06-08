describe('Demo Page', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.login()
    // After login, explicitly navigate to demo page
    cy.visit('/demo', { timeout: 10000 })
    cy.url({ timeout: 5000 }).should('include', '/demo')
    // Wait for page content to be ready
    cy.get('body', { timeout: 10000 }).should('be.visible')
    cy.wait(1000) // Wait for Vue app to render
  })
  
  afterEach(() => {
    cy.logout()
  })
  
  it('should display demo page content', () => {
    cy.contains('spa_utils Component Testing').should('be.visible')
    cy.contains('This demo app showcases spa_utils components').should('be.visible')
  })
  
  it('should show all component demos', () => {
    cy.get('[data-automation-id="demo-autosave-field"]').should('be.visible')
    cy.get('[data-automation-id="demo-autosave-select"]').should('be.visible')
    cy.get('[data-automation-id="demo-list-search"]').should('be.visible')
  })
  
  it('should show utility function demos', () => {
    cy.contains('formatDate').should('be.visible')
    cy.contains('validationRules').should('be.visible')
  })
})
