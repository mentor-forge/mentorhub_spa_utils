describe('Type Editors Demo Page', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    // Stub startup `/api/config` so EnumEditor / EnumArrayEditor resolve real named enumerators.
    cy.intercept('GET', '**/api/config', { fixture: 'editor-config.json' }).as('editorConfig')
    cy.login()
    cy.visit('/demo/editors', { timeout: 10000 })
    cy.url({ timeout: 5000 }).should('include', '/demo/editors')
    cy.get('body', { timeout: 10000 }).should('be.visible')
    cy.wait('@editorConfig')
    cy.wait(1000) // Wait for Vue app to render after config inject
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
    cy.get('[data-automation-id="editors-enums-card"]').should('be.visible')
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
    cy.get('[data-automation-id="editors-status"]').should('exist')
    cy.get('[data-automation-id="editors-tags"]').should('exist')
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

  it('should select a scalar enum from startup config and save the wire value', () => {
    // Options come from fixture enumerators named "status" (description labels, wire values).
    cy.get('[data-automation-id="editors-status"]').click()
    cy.contains('.v-list-item-title', 'Archived').should('be.visible').click()

    cy.wait(300)
    cy.get('body').click(0, 0) // blur → AutoSave

    cy.get('[data-automation-id="editors-save-log"]', { timeout: 3000 })
      .should('be.visible')
      .and('contain', 'Saved "status"')
      .and('contain', '"archived"')
  })

  it('should autocomplete enum_array values, manage pills, and save a string array', () => {
    // Starts with ["alpha"]; add "beta", then remove "alpha", then blur to save.
    cy.get('[data-automation-id="editors-tags"]').click()
    cy.contains('.v-list-item-title', 'Beta tag').should('be.visible').click()

    // Closable chips render in the input area for selected values.
    cy.get('[data-automation-id="editors-tags"]').within(() => {
      cy.contains('.v-chip', 'Alpha tag').should('be.visible')
      cy.contains('.v-chip', 'Beta tag').should('be.visible')
      // Remove the alpha pill via its close icon.
      cy.contains('.v-chip', 'Alpha tag').find('.v-chip__close').click({ force: true })
    })

    cy.wait(300)
    cy.get('body').click(0, 0) // focus leaves the control → AutoSave

    cy.get('[data-automation-id="editors-save-log"]', { timeout: 3000 })
      .should('be.visible')
      .and('contain', 'Saved "tags"')
      .and('contain', '["beta"]')
  })

  it('should show enum read-only displays with description labels and pills', () => {
    cy.get('[data-automation-id="editors-enums-editable-toggle"]').find('input').click({ force: true })

    cy.get('[data-automation-id="editors-status-display"]')
      .should('be.visible')
      .and('contain', 'Active')

    cy.get('[data-automation-id="editors-tags-display"]').should('be.visible')
    cy.get('[data-automation-id="editors-tags-pill-alpha"]')
      .should('be.visible')
      .and('contain', 'Alpha tag')
  })

  it('should not invent options when enumerator payload is empty', () => {
    cy.intercept('GET', '**/api/config', {
      statusCode: 200,
      body: { config_items: [], versions: [], enumerators: [], token: {} },
    }).as('emptyConfig')

    cy.visit('/demo/editors', { timeout: 10000 })
    cy.wait('@emptyConfig')
    cy.contains('Type Editor Gallery').should('be.visible')
    cy.get('[data-automation-id="editors-enums-card"]').scrollIntoView().should('be.visible')
    cy.wait(500)

    // Select still mounts; opening it must not invent Active/Archived/Draft options.
    // Vuetify shows a single "No data available" placeholder when items are empty.
    cy.get('[data-automation-id="editors-status"]').should('be.visible').click()
    cy.contains('.v-overlay--active .v-list-item-title', 'No data available', { timeout: 4000 })
      .should('be.visible')
    cy.get('.v-overlay--active .v-list-item-title').should('have.length', 1)
    cy.get('body').click(0, 0)
  })
})
