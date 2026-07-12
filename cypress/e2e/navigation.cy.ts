describe('Navigation & Routing', () => {
  describe('Navigation Drawer', () => {
    beforeEach(() => {
      cy.clearLocalStorage()
      cy.login(['admin']) // Use admin role to access admin features
      cy.url({ timeout: 5000 }).should('include', '/demo')
      cy.get('body', { timeout: 10000 }).should('be.visible')
      cy.wait(1000)
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
    
    it('should logout and redirect to IdP login', () => {
      cy.get('[data-automation-id="nav-drawer-toggle"]').click()
      cy.get('.v-navigation-drawer', { timeout: 5000 }).should('be.visible')
      cy.get('[data-automation-id="nav-logout-link"]', { timeout: 5000 })
        .should('be.visible')
        .click()

      cy.origin('http://127.0.0.1:8080', () => {
        cy.location('pathname', { timeout: 10000 }).should('eq', '/login.html')
        cy.location('search').should('include', 'return_to=')
      })
    })
  })
  
  describe('Unauthenticated access', () => {
    it('should redirect to IdP login when visiting a protected route', () => {
      cy.visit('/demo')

      cy.origin('http://127.0.0.1:8080', () => {
        cy.location('pathname', { timeout: 10000 }).should('eq', '/login.html')
        cy.location('search').should('include', 'return_to=')
      })
    })
  })

  describe('Token Expiration', () => {
    it('should redirect expired sessions to IdP login', () => {
      cy.login(['admin'])
      cy.window().then((win) => {
        const expiredTime = new Date(Date.now() - 1000 * 60 * 60).toISOString()
        win.localStorage.setItem('token_expires_at', expiredTime)
      })
      cy.reload()
      cy.origin('http://127.0.0.1:8080', () => {
        cy.location('pathname', { timeout: 10000 }).should('eq', '/login.html')
        cy.location('search').should('include', 'return_to=')
      })
    })
  })
})
