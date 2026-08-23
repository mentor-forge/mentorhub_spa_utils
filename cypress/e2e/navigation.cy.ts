describe('Navigation & Routing', () => {
  const catalogIds = {
    home: 'nav-home-link',
    notifications: 'nav-notifications-link',
    products: 'nav-products-link',
    settings: 'nav-settings-link',
    customer: 'nav-customer-link',
    customerMembers: 'nav-customer-members-link',
    resources: 'nav-resources-link',
    paths: 'nav-paths-link',
    plans: 'nav-plans-link',
  } as const

  function openDrawer() {
    cy.get('[data-automation-id="nav-drawer-toggle"]')
      .should('be.visible')
      .click({ force: true })
    cy.get('.v-navigation-drawer', { timeout: 5000 }).should('be.visible')
  }

  function assertVisible(automationId: string) {
    cy.get(`[data-automation-id="${automationId}"]`, { timeout: 5000 })
      .should('exist')
      .should('be.visible')
  }

  function assertAbsent(automationId: string) {
    cy.get(`[data-automation-id="${automationId}"]`).should('not.exist')
  }

  describe('Navigation Drawer', () => {
    it('should show hamburger when authenticated', () => {
      cy.clearLocalStorage()
      cy.login(['user'])
      cy.url({ timeout: 5000 }).should('include', '/demo')
      cy.get('[data-automation-id="nav-drawer-toggle"]').should('be.visible')
    })

    it('should show Home and Notifications only for a non-admin/non-mentor/non-customer role', () => {
      cy.clearLocalStorage()
      // registerAuthCommands treats cy.login([]) as admin; use a non-catalog role instead.
      cy.login(['user'])
      cy.url({ timeout: 5000 }).should('include', '/demo')
      openDrawer()
      assertVisible(catalogIds.home)
      assertVisible(catalogIds.notifications)
      assertAbsent(catalogIds.products)
      assertAbsent(catalogIds.settings)
      assertAbsent(catalogIds.customer)
      assertAbsent(catalogIds.customerMembers)
      assertAbsent(catalogIds.resources)
      assertAbsent(catalogIds.paths)
      assertAbsent(catalogIds.plans)
    })

    it('should show Products and Settings for admin and hide customer/mentor links', () => {
      cy.clearLocalStorage()
      cy.login(['admin'])
      cy.url({ timeout: 5000 }).should('include', '/demo')
      openDrawer()
      assertVisible(catalogIds.home)
      assertVisible(catalogIds.notifications)
      assertVisible(catalogIds.products)
      assertVisible(catalogIds.settings)
      assertAbsent(catalogIds.customer)
      assertAbsent(catalogIds.customerMembers)
      assertAbsent(catalogIds.resources)
      assertAbsent(catalogIds.paths)
      assertAbsent(catalogIds.plans)
    })

    it('should show customer org and members links for customer role', () => {
      cy.clearLocalStorage()
      cy.login(['customer'])
      cy.url({ timeout: 5000 }).should('include', '/demo')
      openDrawer()
      assertVisible(catalogIds.customer)
      assertVisible(catalogIds.customerMembers)
      assertAbsent(catalogIds.products)
      assertAbsent(catalogIds.settings)
      assertAbsent(catalogIds.resources)
      assertAbsent(catalogIds.paths)
      assertAbsent(catalogIds.plans)
    })

    it('should show Resources, Paths, and Plans for mentor role', () => {
      cy.clearLocalStorage()
      cy.login(['mentor'])
      cy.url({ timeout: 5000 }).should('include', '/demo')
      openDrawer()
      assertVisible(catalogIds.resources)
      assertVisible(catalogIds.paths)
      assertVisible(catalogIds.plans)
      assertAbsent(catalogIds.products)
      assertAbsent(catalogIds.settings)
      assertAbsent(catalogIds.customer)
      assertAbsent(catalogIds.customerMembers)
    })

    it('should show profile control with customer profile href', () => {
      cy.clearLocalStorage()
      cy.login(['user'])
      cy.url({ timeout: 5000 }).should('include', '/demo')
      cy.get('[data-automation-id="nav-profile-link"]')
        .should('be.visible')
        .and('have.attr', 'href')
        .and('include', '/customer/profile/')
    })

    it('should build Home href to discovery on welcome :8080 from the Vite debug port', () => {
      cy.clearLocalStorage()
      cy.login(['user'])
      cy.url({ timeout: 5000 }).should('include', '/demo')
      openDrawer()
      cy.get(`[data-automation-id="${catalogIds.home}"]`)
        .should('have.attr', 'href')
        .and('include', '/discovery/')
        .and('include', ':8080')
    })

    it('should close drawer when clicking toggle again', () => {
      cy.clearLocalStorage()
      cy.login(['admin'])
      cy.url({ timeout: 5000 }).should('include', '/demo')
      openDrawer()
      assertVisible(catalogIds.home)

      cy.get('[data-automation-id="nav-drawer-toggle"]').click()
      cy.wait(500)
      cy.get('.v-navigation-drawer', { timeout: 2000 }).should('not.be.visible')
    })

    it('should logout and redirect to IdP login', () => {
      cy.clearLocalStorage()
      cy.login(['admin'])
      cy.url({ timeout: 5000 }).should('include', '/demo')
      openDrawer()
      cy.get('[data-automation-id="nav-logout-link"]', { timeout: 5000 })
        .should('be.visible')
        .click()

      cy.origin('http://127.0.0.1:8080', () => {
        cy.location('pathname', { timeout: 10000 }).should('eq', '/login.html')
        cy.location('search').should('include', 'return_to=')
      })
    })
  })

  describe('In-package DemoPage links', () => {
    beforeEach(() => {
      cy.clearLocalStorage()
      cy.login(['admin'])
      cy.url({ timeout: 5000 }).should('include', '/demo')
      cy.get('body', { timeout: 10000 }).should('be.visible')
      cy.contains('spa_utils Component Testing', { timeout: 10000 }).should('be.visible')
    })

    it('should navigate to the type editors page from DemoPage', () => {
      cy.get('[data-automation-id="demo-page-editors-link"]', { timeout: 5000 })
        .should('be.visible')
        .click()
      cy.url({ timeout: 5000 }).should('include', '/demo/editors')
      cy.contains('Type Editor Gallery', { timeout: 10000 }).should('be.visible')
    })

    it('should navigate to the dashboard page from DemoPage', () => {
      cy.get('[data-automation-id="demo-page-dashboard-link"]', { timeout: 5000 })
        .should('be.visible')
        .click()
      cy.url({ timeout: 5000 }).should('include', '/demo/dashboard')
      cy.contains('h1', 'Dashboard', { timeout: 10000 }).should('be.visible')
    })

    it('should navigate to the admin config page from DemoPage', () => {
      cy.get('[data-automation-id="demo-page-admin-link"]', { timeout: 5000 })
        .should('be.visible')
        .click()
      cy.url({ timeout: 5000 }).should('include', '/admin')
      cy.contains('Admin - Configuration', { timeout: 10000 }).should('be.visible')
    })

    it('should return to the component demo from another in-package page', () => {
      cy.visit('/admin')
      cy.contains('Admin - Configuration', { timeout: 10000 }).should('be.visible')
      cy.visit('/demo')
      cy.contains('spa_utils Component Testing', { timeout: 10000 }).should('be.visible')
      cy.get('[data-automation-id="demo-page-demo-link"]').should('be.visible')
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
