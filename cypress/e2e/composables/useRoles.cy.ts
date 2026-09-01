describe('useRoles Composable', () => {
  describe('Admin Role Access', () => {
    beforeEach(() => {
      cy.clearLocalStorage()
      cy.login(['admin'])
      cy.visit('/demo', { timeout: 10000 })
      cy.url({ timeout: 5000 }).should('include', '/demo')
      cy.get('body', { timeout: 10000 }).should('be.visible')
      cy.wait(1000)
    })
    
    afterEach(() => {
      cy.logout()
    })
    
    it('should show Notifications and Settings in the product catalog for admin users', () => {
      cy.get('[data-automation-id="nav-drawer-toggle"]').click()
      cy.get('.v-navigation-drawer', { timeout: 5000 }).should('be.visible')
      cy.get('[data-automation-id="nav-notifications-link"]').should('be.visible')
      cy.get('[data-automation-id="nav-settings-link"]').should('be.visible')
      cy.get('[data-automation-id="nav-products-link"]').should('not.exist')
    })
    
    it('should allow access to the config page', () => {
      cy.visit('/config')
      cy.url({ timeout: 5000 }).should('include', '/config')
      cy.contains('Admin - Configuration', { timeout: 10000 })
        .should('be.visible')
    })
  })
  
  describe('Non-Admin Role Access', () => {
    beforeEach(() => {
      cy.clearLocalStorage()
      cy.login(['developer'])
      cy.visit('/demo', { timeout: 10000 })
      cy.url({ timeout: 5000 }).should('include', '/demo')
      cy.get('body', { timeout: 10000 }).should('be.visible')
      cy.wait(1000)
    })
    
    afterEach(() => {
      cy.logout()
    })
    
    it('should not show Notifications, Settings, or Products for non-admin users', () => {
      cy.get('[data-automation-id="nav-drawer-toggle"]').click()
      cy.get('.v-navigation-drawer', { timeout: 5000 }).should('be.visible')
      cy.get('[data-automation-id="nav-notifications-link"]').should('not.exist')
      cy.get('[data-automation-id="nav-products-link"]').should('not.exist')
      cy.get('[data-automation-id="nav-settings-link"]').should('not.exist')
    })
    
    it('should redirect non-admin users away from /config', () => {
      cy.visit('/config')
      cy.url({ timeout: 5000 }).should((url) => {
        expect(url).to.include('/demo')
        expect(url).to.not.include('/config')
      })
    })

    it('should redirect non-admin users from /admin to /demo, not /config', () => {
      cy.visit('/admin')
      cy.url({ timeout: 5000 }).should((url) => {
        expect(url).to.include('/demo')
        expect(url).to.not.include('/admin')
        expect(url).to.not.include('/config')
      })
    })
  })
})
