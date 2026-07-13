describe('Type Editors Demo Page', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.login()
    cy.visit('/demo/editors', { timeout: 10000 })
    cy.url({ timeout: 5000 }).should('include', '/demo/editors')
    cy.get('body', { timeout: 10000 }).should('be.visible')
    cy.wait(1000) // Wait for Vue app to render
  })

  afterEach(() => {
    cy.logout()
  })

  it('should display the editors page heading', () => {
    cy.contains('Type Editor Gallery').should('be.visible')
  })

  it('should render every configurator-type card', () => {
    cy.get('[data-automation-id="editors-identity-card"]').should('be.visible')
    cy.get('[data-automation-id="editors-contact-card"]').should('be.visible')
    cy.get('[data-automation-id="editors-content-card"]').should('be.visible')
    cy.get('[data-automation-id="editors-time-card"]').should('be.visible')
    cy.get('[data-automation-id="editors-metrics-card"]').should('be.visible')
    cy.get('[data-automation-id="editors-audit-card"]').should('be.visible')
  })

  it('should render a representative editor from each card', () => {
    cy.get('[data-automation-id="editors-word"]').should('exist')
    cy.get('[data-automation-id="editors-sentence"]').should('exist')
    cy.get('[data-automation-id="editors-identifier-display"]').should('exist')
    cy.get('[data-automation-id="editors-email"]').should('exist')
    cy.get('[data-automation-id="editors-us-phone"]').should('exist')
    cy.get('[data-automation-id="editors-url"]').should('exist')
    cy.get('[data-automation-id="editors-ip-address"]').should('exist')
    cy.get('[data-automation-id="editors-markdown"]').should('exist')
    cy.get('[data-automation-id="editors-duration"]').should('exist')
    cy.get('[data-automation-id="editors-date-time"]').should('exist')
    cy.get('[data-automation-id="editors-boolean"]').should('exist')
    cy.get('[data-automation-id="editors-count"]').should('exist')
    cy.get('[data-automation-id="editors-index"]').should('exist')
    cy.get('[data-automation-id="editors-rating"]').should('exist')
    // Audit card starts collapsed (controlled v-model:collapsed demo) so assert existence only.
    cy.get('[data-automation-id="editors-breadcrumb"]').should('exist')
  })

  it('should AutoSave a word field edit and show the save affordance', () => {
    cy.get('[data-automation-id="editors-word"]').find('input').clear().type('newword').blur()

    cy.get('[data-automation-id="editors-save-log"]', { timeout: 3000 })
      .should('be.visible')
      .and('contain', 'Saved "word"')
      .and('contain', 'newword')
  })

  it('should show a validation error for an invalid word value', () => {
    cy.get('[data-automation-id="editors-word"]').find('input').clear().type('bad value').blur()

    cy.get('[data-automation-id="editors-identity-card"]')
      .contains('No whitespace, max 40 characters')
      .should('be.visible')
  })

  it('should show a validation error for an invalid email value', () => {
    cy.get('[data-automation-id="editors-email"]').find('input').clear().type('not-an-email').blur()

    cy.get('[data-automation-id="editors-contact-card"]')
      .contains('Must be a valid email address')
      .should('be.visible')
  })

  it('should collapse and expand the Audit card via the controlled v-model:collapsed toggle', () => {
    // Audit card starts collapsed per the demo's controlled binding.
    cy.get('[data-automation-id="editors-audit-card"] .mh-card__body').should('not.be.visible')

    cy.get('[data-automation-id="editors-audit-card-collapse-button"]').click()
    cy.get('[data-automation-id="editors-audit-card"] .mh-card__body').should('be.visible')
    cy.get('[data-automation-id="editors-breadcrumb"]').should('be.visible')

    cy.get('[data-automation-id="editors-audit-card-collapse-button"]').click()
    cy.get('[data-automation-id="editors-audit-card"] .mh-card__body').should('not.be.visible')
  })

  it('should toggle the Contact card between editable and view-only controls', () => {
    // Editable by default: a real input exists.
    cy.get('[data-automation-id="editors-email"]').find('input').should('exist')

    cy.get('[data-automation-id="editors-contact-editable-toggle"]').find('input').click({ force: true })

    // View-only: input is replaced by a plain display element (`-display` automation id).
    cy.get('[data-automation-id="editors-email-display"]').should('be.visible')
    cy.get('[data-automation-id="editors-contact-card"] input').should('not.exist')

    cy.get('[data-automation-id="editors-contact-editable-toggle"]').find('input').click({ force: true })
    cy.get('[data-automation-id="editors-email"]').find('input').should('exist')
  })
})
