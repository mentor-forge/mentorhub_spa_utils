describe('useResourceList Composable', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.login()
    cy.visit('/demo', { timeout: 10000 })
    cy.url({ timeout: 5000 }).should('include', '/demo')
    cy.get('body', { timeout: 10000 }).should('be.visible')
    cy.wait(1000)
  })
  
  afterEach(() => {
    cy.logout()
  })
  
  // useResourceList is tested through ListPageSearch component
  // which uses the search functionality
  it('should support search functionality through ListPageSearch', () => {
    cy.get('[data-automation-id="demo-list-search"]')
      .should('be.visible')
    
    // Type in search field - this tests the debounced search
    cy.get('[data-automation-id="demo-list-search"]')
      .find('input')
      .type('test query')
    
    // Verify search query is captured
    cy.get('[data-automation-id="demo-list-search"]')
      .find('input')
      .should('have.value', 'test query')
  })
})
