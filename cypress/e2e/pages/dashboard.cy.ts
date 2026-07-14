describe('Dashboard Demo Page', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.login()
    cy.visit('/demo/dashboard', { timeout: 10000 })
    cy.url({ timeout: 5000 }).should('include', '/demo/dashboard')
    cy.get('body', { timeout: 10000 }).should('be.visible')
    cy.wait(1000) // Wait for Vue app to render
  })

  afterEach(() => {
    cy.logout()
  })

  it('should display the dashboard page heading', () => {
    cy.contains('h1', 'Dashboard').should('be.visible')
  })

  it('should render the card grid with multiple entity cards', () => {
    cy.get('[data-automation-id="dashboard-grid"]').should('be.visible')
    cy.get('[data-automation-id="dashboard-grid"] .mh-card').should('have.length.greaterThan', 1)
  })

  it('should render title, name, and status for a card', () => {
    cy.get('[data-automation-id="dashboard-card-mentee-1"]').should('be.visible')
    cy.get('[data-automation-id="dashboard-card-mentee-1-title-display"]')
      .should('contain', 'Mentee')
      .and('contain', 'Alex Johnson')
    cy.get('[data-automation-id="dashboard-card-mentee-1"]').contains('Active').should('be.visible')
  })

  it('should render right-justified view/edit/delete action buttons on a card', () => {
    cy.get('[data-automation-id="dashboard-card-mentee-1-view-button"]').should('be.visible')
    cy.get('[data-automation-id="dashboard-card-mentee-1-edit-button"]').should('be.visible')
    cy.get('[data-automation-id="dashboard-card-mentee-1-delete-button"]').should('be.visible')
  })

  it('should log an action when a card action button is clicked', () => {
    cy.get('[data-automation-id="dashboard-card-mentee-1-edit-button"]').click()

    cy.get('[data-automation-id="dashboard-action-log"]', { timeout: 3000 })
      .should('be.visible')
      .and('contain', 'edit clicked for "Alex Johnson"')
  })

  it('should apply F015 default CardGrid breakpoint classes', () => {
    // Prefer class assertions over pixel measurements (nested containers make widths flaky).
    cy.get('[data-automation-id="dashboard-grid"] .mh-card-grid__col')
      .first()
      .should('have.class', 'v-col-12')
      .and('have.class', 'v-col-sm-6')
      .and('have.class', 'v-col-md-4')
      .and('have.class', 'v-col-lg-3')
  })
})
