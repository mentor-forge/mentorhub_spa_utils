describe('AutoSaveField Component', () => {
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
  
  it('should display AutoSaveField component', () => {
    cy.get('[data-automation-id="demo-autosave-field"]', { timeout: 10000 })
      .should('be.visible')
  })
  
  it('should save text field on blur', () => {
    cy.get('[data-automation-id="demo-autosave-field"]')
      .find('input')
      .clear()
      .type('Test value')
      .blur()
    
    // Wait for save to complete and check for success alert
    cy.get('.v-alert', { timeout: 2000 })
      .should('be.visible')
      .should('contain', 'Saved')
  })
  
  it('should display textarea version', () => {
    cy.get('[data-automation-id="demo-autosave-textarea"]')
      .should('be.visible')
      .find('textarea')
      .should('exist')
  })
  
  it('should save textarea on blur', () => {
    cy.get('[data-automation-id="demo-autosave-textarea"]')
      .find('textarea')
      .clear()
      .type('Test textarea content')
      .blur()
    
    // Wait for save to complete and check for success alert
    cy.get('.v-alert', { timeout: 2000 })
      .should('be.visible')
      .should('contain', 'Saved')
  })
})
