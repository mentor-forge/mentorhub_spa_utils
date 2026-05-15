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
    
    it('should show admin link in navigation drawer for admin users', () => {
      cy.get('[data-automation-id="nav-drawer-toggle"]').click()
      cy.get('[data-automation-id="nav-admin-link"]')
        .should('be.visible')
    })
    
    it('should allow access to admin page', () => {
      cy.visit('/admin')
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
    
    it('should not show admin link in navigation drawer for non-admin users', () => {
      cy.get('[data-automation-id="nav-drawer-toggle"]').click()
      cy.get('[data-automation-id="nav-admin-link"]')
        .should('not.exist')
    })
    
    it('should redirect non-admin users from admin page', () => {
      cy.visit('/admin')
      cy.url({ timeout: 5000 }).should((url) => {
        expect(url).to.include('/demo')
        expect(url).to.not.include('/admin')
      })
    })
  })
})
