/** Count CSS Grid tracks from computed `grid-template-columns` (handles `minmax(...)` tokens). */
function countGridColumns($grid: JQuery<HTMLElement>): number {
  const template = window.getComputedStyle($grid[0]).gridTemplateColumns.trim()
  if (!template || template === 'none') return 0
  return template.split(/ (?![^(]*\))/).filter(Boolean).length
}

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

  it('should use responsive CSS Grid column counts through eight', () => {
    const cases: Array<{ width: number; columns: number }> = [
      { width: 500, columns: 1 },
      { width: 600, columns: 2 },
      { width: 960, columns: 3 },
      { width: 1280, columns: 4 },
      { width: 1600, columns: 5 },
      { width: 1920, columns: 6 },
      { width: 2240, columns: 7 },
      { width: 2560, columns: 8 },
      { width: 3000, columns: 8 }, // capped — no growth beyond eight
    ]

    cases.forEach(({ width, columns }) => {
      cy.viewport(width, 900)
      cy.get('[data-automation-id="dashboard-grid"]').should(($grid) => {
        expect(countGridColumns($grid), `columns at ${width}px`).to.eq(columns)
      })
    })
  })

  it('should stretch expanded cards in a row to equal height despite varied body lengths', () => {
    cy.viewport(1280, 900)
    cy.get('[data-automation-id="dashboard-grid"] .mh-card-grid__item .mh-card:not(.mh-card--collapsed)')
      .should('have.length.greaterThan', 1)
      .then(($cards) => {
        const firstTop = $cards[0].getBoundingClientRect().top
        const rowHeights = [...$cards]
          .filter((el) => Math.abs(el.getBoundingClientRect().top - firstTop) < 2)
          .map((el) => el.getBoundingClientRect().height)

        expect(rowHeights.length).to.be.greaterThan(1)
        const firstHeight = rowHeights[0]
        rowHeights.forEach((h) => expect(h).to.be.closeTo(firstHeight, 2))
      })
  })

  it('should keep the collapsed demo card shorter than expanded siblings', () => {
    cy.viewport(1280, 900)
    cy.get('[data-automation-id="dashboard-card-collapsed-demo"]')
      .should('have.class', 'mh-card--collapsed')
      .then(($collapsed) => {
        const collapsedHeight = $collapsed[0].getBoundingClientRect().height
        const collapsedTop = $collapsed[0].getBoundingClientRect().top

        cy.get('[data-automation-id="dashboard-grid"] .mh-card:not(.mh-card--collapsed)').then(($expanded) => {
          const sameRowExpanded = [...$expanded].filter(
            (el) => Math.abs(el.getBoundingClientRect().top - collapsedTop) < 2
          )
          expect(sameRowExpanded.length, 'expanded sibling in same visual row').to.be.greaterThan(0)
          const expandedHeight = sameRowExpanded[0].getBoundingClientRect().height
          expect(collapsedHeight).to.be.lessThan(expandedHeight - 8)
        })
      })
  })
})
