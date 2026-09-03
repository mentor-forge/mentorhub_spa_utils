const STUB_TOKEN = {
  remote_ip: '203.0.113.10',
  display_name: 'Ada Lovelace',
  profile_id: 'A00000000000000000000001',
  customer_id: 'D00000000000000000000006',
  mentor_id: 'B00000000000000000000002',
  roles: ['admin'],
}

describe('Admin Page', () => {
  describe('Admin Access', () => {
    beforeEach(() => {
      cy.clearLocalStorage()
      cy.login(['admin'])
      cy.intercept('GET', '**/api/config', {
        statusCode: 200,
        body: {
          config_items: [],
          versions: [],
          enumerators: [],
          token: STUB_TOKEN,
        },
      }).as('configOk')
      cy.visit('/config')
      cy.waitForAdminPage()
    })
    
    afterEach(() => {
      cy.logout()
    })
    
    it('should show admin config page', () => {
      cy.contains('Admin - Configuration').should('be.visible')
      cy.url().should('include', '/config')
    })
    
    it('should show loading state while config loads', () => {
      cy.intercept('GET', '**/api/config', {
        delay: 500,
        statusCode: 200,
        body: { config_items: [], versions: [], enumerators: [], token: STUB_TOKEN }
      }).as('configDelay')
      
      cy.visit('/config')
      cy.contains('Admin - Configuration').should('be.visible')
      
      cy.get('.v-progress-linear').should('be.visible')
      
      cy.wait('@configDelay')
      cy.get('[data-automation-id="admin-tab-config"]', { timeout: 2000 }).should('be.visible')
    })
    
    it('should show config tabs when config loaded', () => {
      cy.get('[data-automation-id="admin-tab-config"]', { timeout: 10000 }).should('be.visible')
      cy.get('[data-automation-id="admin-tab-versions"]').should('be.visible')
      cy.get('[data-automation-id="admin-tab-enumerators"]').should('be.visible')
      cy.get('[data-automation-id="admin-tab-token"]').should('be.visible')
    })
    
    it('should show error alert when config load fails', () => {
      cy.intercept('GET', '**/api/config', { statusCode: 500, statusText: 'Internal Server Error' }).as('configFail')
      
      cy.visit('/config')
      cy.wait('@configFail')
      
      cy.get('.v-alert').should('be.visible')
      cy.get('.v-alert').should('contain', 'Failed to load config')
    })
    
    it('should allow switching between tabs', () => {
      cy.get('[data-automation-id="admin-tab-config"]', { timeout: 10000 }).should('be.visible')
      
      cy.get('[data-automation-id="admin-tab-versions"]').click()
      cy.get('[data-automation-id="admin-tab-versions"]').should('have.attr', 'aria-selected', 'true')
      
      cy.get('[data-automation-id="admin-tab-enumerators"]').click()
      cy.get('[data-automation-id="admin-tab-enumerators"]').should('have.attr', 'aria-selected', 'true')
      
      cy.get('[data-automation-id="admin-tab-token"]').click()
      cy.get('[data-automation-id="admin-tab-token"]').should('have.attr', 'aria-selected', 'true')
    })

    it('should show display_name, profile_id, customer_id, and mentor_id on the Token tab', () => {
      cy.get('[data-automation-id="admin-tab-token"]', { timeout: 10000 }).click()
      cy.get('[data-automation-id="admin-token-display-name-display"]')
        .should('be.visible')
        .find('input')
        .should('have.value', STUB_TOKEN.display_name)
      cy.get('[data-automation-id="admin-token-profile-id-display"]')
        .should('be.visible')
        .find('input')
        .should('have.value', STUB_TOKEN.profile_id)
      cy.get('[data-automation-id="admin-token-customer-id-display"]')
        .should('be.visible')
        .find('input')
        .should('have.value', STUB_TOKEN.customer_id)
      cy.get('[data-automation-id="admin-token-mentor-id-display"]')
        .should('be.visible')
        .find('input')
        .should('have.value', STUB_TOKEN.mentor_id)
    })

    it('should show N/A for display_name when the intercepted token omits the claim', () => {
      const { display_name: _omitted, ...tokenWithoutDisplayName } = STUB_TOKEN
      cy.intercept('GET', '**/api/config', {
        statusCode: 200,
        body: {
          config_items: [],
          versions: [],
          enumerators: [],
          token: tokenWithoutDisplayName,
        },
      }).as('configNoDisplayName')
      cy.visit('/config')
      cy.wait('@configNoDisplayName')
      cy.waitForAdminPage()
      cy.get('[data-automation-id="admin-tab-token"]', { timeout: 10000 }).click()
      cy.get('[data-automation-id="admin-token-display-name-display"]')
        .should('be.visible')
        .find('input')
        .should('have.value', 'N/A')
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
    
    it('should redirect to demo when non-admin tries to access /config', () => {
      cy.visit('/config')
      
      cy.url({ timeout: 5000 }).should((url) => {
        expect(url).to.include('/demo')
        expect(url).to.not.include('/config')
      })
    })
  })
})
