describe('Admin Page', () => {
  describe('Admin Access', () => {
    beforeEach(() => {
      cy.clearLocalStorage()
      cy.login(['admin'])
      cy.visit('/admin')
      cy.waitForAdminPage()
    })
    
    afterEach(() => {
      cy.logout()
    })
    
    it('should show admin config page', () => {
      cy.contains('Admin - Configuration').should('be.visible')
    })
    
    it('should show loading state while config loads', () => {
      // Intercept and delay config request
      cy.intercept('GET', '**/api/config', {
        delay: 500,
        statusCode: 200,
        body: { config_items: [], versions: [], enumerators: [], token: {} }
      }).as('configDelay')
      
      cy.visit('/admin')
      cy.contains('Admin - Configuration').should('be.visible')
      
      // Should show loading indicator
      cy.get('.v-progress-linear').should('be.visible')
      
      cy.wait('@configDelay')
      // After loading, tabs should appear
      cy.get('[data-automation-id="admin-tab-config"]', { timeout: 2000 }).should('be.visible')
    })
    
    it('should show config tabs when config loaded', () => {
      cy.get('[data-automation-id="admin-tab-config"]', { timeout: 10000 }).should('be.visible')
      cy.get('[data-automation-id="admin-tab-versions"]').should('be.visible')
      cy.get('[data-automation-id="admin-tab-enumerators"]').should('be.visible')
      cy.get('[data-automation-id="admin-tab-token"]').should('be.visible')
    })
    
    it('should show error alert when config load fails', () => {
      // Intercept and fail config request
      cy.intercept('GET', '**/api/config', { statusCode: 500, statusText: 'Internal Server Error' }).as('configFail')
      
      cy.visit('/admin')
      cy.wait('@configFail')
      
      // Should show error alert
      cy.get('.v-alert').should('be.visible')
      cy.get('.v-alert').should('contain', 'Failed to load config')
    })
    
    it('should allow switching between tabs', () => {
      cy.get('[data-automation-id="admin-tab-config"]', { timeout: 10000 }).should('be.visible')
      
      // Switch to versions tab
      cy.get('[data-automation-id="admin-tab-versions"]').click()
      cy.get('[data-automation-id="admin-tab-versions"]').should('have.attr', 'aria-selected', 'true')
      
      // Switch to enumerators tab
      cy.get('[data-automation-id="admin-tab-enumerators"]').click()
      cy.get('[data-automation-id="admin-tab-enumerators"]').should('have.attr', 'aria-selected', 'true')
      
      // Switch to token tab
      cy.get('[data-automation-id="admin-tab-token"]').click()
      cy.get('[data-automation-id="admin-tab-token"]').should('have.attr', 'aria-selected', 'true')
    })
  })
  
  describe('Non-Admin Access', () => {
    beforeEach(() => {
      cy.clearLocalStorage()
      cy.login(['developer'])
    })
    
    afterEach(() => {
      cy.logout()
    })
    
    it('should redirect to demo when non-admin tries to access admin', () => {
      cy.visit('/admin')
      
      // Should redirect to /demo since developer doesn't have admin role
      cy.url({ timeout: 5000 }).should((url) => {
        expect(url).to.include('/demo')
        expect(url).to.not.include('/admin')
      })
    })
  })
})
