describe('AutoSaveSelect Component', () => {
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
  
  it('should display AutoSaveSelect component', () => {
    cy.get('[data-automation-id="demo-autosave-select"]')
      .should('be.visible')
  })
  
  it('should save select value on blur', () => {
    // Initial value is 'active', so select 'archived' to trigger a change
    cy.get('[data-automation-id="demo-autosave-select"]').click()
    cy.contains('archived').click()
    
    // Wait for menu to close, then click outside to trigger blur
    cy.wait(300)
    cy.get('body').click(0, 0) // Click outside to trigger blur
    
    // Wait for save to complete and check for success alert
    cy.get('.v-alert', { timeout: 2000 })
      .should('be.visible')
      .should('contain', 'Saved')
  })
})
