describe('ListPageSearch Component', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.login()
    // After login, explicitly navigate to demo page
    cy.visit('/demo', { timeout: 10000 })
    cy.url({ timeout: 5000 }).should('include', '/demo')
    // Wait for page to be ready
    cy.get('body', { timeout: 10000 }).should('be.visible')
    cy.wait(1000) // Wait for Vue app to render
  })
  
  afterEach(() => {
    cy.logout()
  })
  
  it('should display ListPageSearch component', () => {
    cy.get('[data-automation-id="demo-list-search"]')
      .should('be.visible')
  })
  
  it('should allow typing in search field', () => {
    cy.get('[data-automation-id="demo-list-search"]')
      .find('input')
      .type('test query')
    
    cy.get('[data-automation-id="demo-list-search"]')
      .find('input')
      .should('have.value', 'test query')
  })
  
  it('should clear search field', () => {
    cy.get('[data-automation-id="demo-list-search"]')
      .find('input')
      .type('test')
      .clear()
    
    cy.get('[data-automation-id="demo-list-search"]')
      .find('input')
      .should('have.value', '')
  })
})
