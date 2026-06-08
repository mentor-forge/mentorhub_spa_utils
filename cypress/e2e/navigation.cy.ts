describe('Navigation & Routing', () => {
  describe('Navigation Drawer', () => {
    beforeEach(() => {
      cy.clearLocalStorage()
      cy.login(['admin']) // Use admin role to access admin features
      cy.visit('/demo', { timeout: 10000 })
      cy.url({ timeout: 5000 }).should('include', '/demo')
      cy.get('body', { timeout: 10000 }).should('be.visible')
      cy.wait(1000)
    })
    
    afterEach(() => {
      cy.logout()
    })
    
    it('should show hamburger when authenticated', () => {
      cy.get('[data-automation-id="nav-drawer-toggle"]').should('be.visible')
    })
    
    it('should open drawer and show demo link', () => {
      cy.get('[data-automation-id="nav-drawer-toggle"]')
        .should('be.visible')
        .click({ force: true })
      
      // Wait for drawer to open
      cy.get('.v-navigation-drawer', { timeout: 5000 }).should('be.visible')
      cy.get('[data-automation-id="nav-demo-link"]', { timeout: 5000 })
        .should('exist')
        .should('be.visible')
    })
    
    it('should show admin link when user has admin role', () => {
      cy.get('[data-automation-id="nav-drawer-toggle"]').click()
      cy.get('.v-navigation-drawer', { timeout: 5000 }).should('be.visible')
      cy.get('[data-automation-id="nav-admin-link"]', { timeout: 5000 })
        .should('be.visible')
    })
    
    it('should close drawer when clicking toggle again', () => {
      cy.get('[data-automation-id="nav-drawer-toggle"]').click()
      cy.get('.v-navigation-drawer', { timeout: 5000 }).should('be.visible')
      cy.get('[data-automation-id="nav-demo-link"]', { timeout: 5000 })
        .should('be.visible')
      
      // Click toggle again to close drawer
      cy.get('[data-automation-id="nav-drawer-toggle"]').click()
      cy.wait(500) // Wait for drawer close animation
      
      // Drawer should close
      cy.get('.v-navigation-drawer', { timeout: 2000 }).should('not.be.visible')
    })
    
    it('should close drawer when navigating to a link', () => {
      cy.get('[data-automation-id="nav-drawer-toggle"]').click()
      cy.get('.v-navigation-drawer', { timeout: 5000 }).should('be.visible')
      cy.get('[data-automation-id="nav-demo-link"]', { timeout: 5000 })
        .should('be.visible')
      
      // Navigate via drawer link
      cy.get('[data-automation-id="nav-admin-link"]', { timeout: 5000 })
        .should('be.visible')
        .click()
      cy.url({ timeout: 5000 }).should('include', '/admin')
      
      // Drawer should close after navigation (temporary drawer)
      cy.get('.v-navigation-drawer', { timeout: 2000 }).should('not.be.visible')
    })
    
    it('should navigate to admin via drawer', () => {
      cy.get('[data-automation-id="nav-drawer-toggle"]').click()
      cy.get('.v-navigation-drawer', { timeout: 5000 }).should('be.visible')
      cy.get('[data-automation-id="nav-admin-link"]', { timeout: 5000 })
        .should('be.visible')
        .click()
      cy.url({ timeout: 5000 }).should('include', '/admin')
      cy.contains('Admin - Configuration', { timeout: 10000 }).should('be.visible')
    })
    
    it('should navigate to demo via drawer', () => {
      // Start on admin page
      cy.visit('/admin')
      cy.contains('Admin - Configuration', { timeout: 10000 }).should('be.visible')
      
      // Open drawer and navigate to demo
      cy.get('[data-automation-id="nav-drawer-toggle"]').click()
      cy.get('.v-navigation-drawer', { timeout: 5000 }).should('be.visible')
      cy.get('[data-automation-id="nav-demo-link"]', { timeout: 5000 })
        .should('be.visible')
        .click()
      cy.url({ timeout: 5000 }).should('include', '/demo')
      cy.contains('spa_utils Component Testing', { timeout: 10000 }).should('be.visible')
    })
    
    it('should logout and return to public entry', () => {
      cy.get('[data-automation-id="nav-drawer-toggle"]').click()
      cy.get('.v-navigation-drawer', { timeout: 5000 }).should('be.visible')
      cy.get('[data-automation-id="nav-logout-link"]', { timeout: 5000 })
        .should('be.visible')
        .click()
      cy.location('pathname', { timeout: 5000 }).should('eq', '/')
      
      // Verify localStorage is cleared
      cy.window().then((win) => {
        expect(win.localStorage.getItem('access_token')).to.be.null
        expect(win.localStorage.getItem('token_expires_at')).to.be.null
        expect(win.localStorage.getItem('user_roles')).to.be.null
      })
      
      cy.visit('/demo')
      cy.location('pathname', { timeout: 5000 }).should('eq', '/')
      cy.url().should('include', 'redirect=/demo')
    })
  })
  
  describe('Token Expiration', () => {
    it('should handle expired token gracefully', () => {
      // Set expired token in localStorage
      cy.visit('/', {
        onBeforeLoad(win) {
          const expiredTime = new Date(Date.now() - 1000 * 60 * 60).toISOString() // 1 hour ago
          win.localStorage.setItem('access_token', 'expired-token')
          win.localStorage.setItem('token_expires_at', expiredTime)
          win.localStorage.setItem('user_roles', JSON.stringify(['admin']))
        }
      })
      
      cy.location('pathname', { timeout: 5000 }).should('eq', '/')
    })
  })
})
