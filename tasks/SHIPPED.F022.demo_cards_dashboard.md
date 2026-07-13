# F022 – Demo page: cards-based dashboard

**Status**: Shipped  
**Type**: Feature  
**Depends On**: F021  
**Description**: Add a demo dashboard page that uses the MhCard + CardGrid layout as a list-style adaptive card interface (mobile single column → desktop/wide multi-column) with title-bar actions.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Sibling repos must all be sibling folders under a common parent.

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `README.md`, `demo/...`, `cypress/...`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md`
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `tasks/SHIPPED.F015.peer_review_card_editor_approach.md`
- `README.md`
- `demo/router.ts`
- `demo/App.vue`
- `src/components/MhCard.vue` / `CardGrid.vue` (F016)
- `cypress/e2e/navigation.cy.ts`

## Goals

- Add a dashboard demo route (`/demo/dashboard`) showcasing:
  - `CardGrid` with F015 default breakpoints (`cols="12" sm="6" md="4" lg="3"`) and a set of sample entity `MhCard`s (static or reactive fixture data).
  - Each `MhCard` with colored title bar, name/identifier, body summary content, and right-justified action icons (e.g. view/edit/delete placeholders using `mdi-*` icons).
  - Responsive behavior at mobile, desktop, and wide breakpoints (document expected column counts in the page header or Cypress assertions on layout classes if practical).
- Register route and navigation entry alongside the editors demo.
- Automation ids (`automationId` → `data-automation-id`) for grid, cards, and action buttons.

## Testing Expectations

Run all commands from **this spa_utils repository root**.

- Cypress: visit dashboard, assert multiple cards render, assert an action button, smoke-check responsive class/structure if feasible.
- Update navigation E2E if drawer links change.
- `npm run test`
- `npm run build`
- `npm run cypress:run` against running `npm run dev` (and API backing services if the suite requires them)

## Outputs

- `demo/pages/DashboardPage.vue` (or equivalent name)
- `demo/router.ts`
- `demo/App.vue` — nav entry
- `cypress/e2e/pages/dashboard.cy.ts` (and navigation updates as needed)

The agent must not update package version or README (F023/F024).

## Execution Notes

### Plan
Ship `/demo/dashboard` using fixture entities in `MhCard`s inside default-breakpoint `CardGrid`, with view/edit/delete title actions, nav + Cypress including mobile/desktop column smoke checks.

### Results
- Added `demo/pages/DashboardPage.vue`, route `/demo/dashboard`, drawer link `nav-dashboard-link`.
- Cypress: `cypress/e2e/pages/dashboard.cy.ts` + navigation dashboard coverage.
- **Bugfix:** `CardGrid` now uses `resolveComponent('VRow'/'VCol')` so Vuetify grid columns resolve in consuming apps (plain `h('v-col')` tags were leaking into the DOM).
- Layout Cypress asserts breakpoint classes (`v-col-12` / `sm-6` / `md-4` / `lg-3`) instead of fragile pixel widths.
- Nav dashboard link uses `scrollIntoView` + `force: true` so the taller drawer still reaches the new item.
- Removed transient `cypress/e2e/debug.cy.ts` scaffolding.
- Verified: unit tests, build, `dashboard.cy.ts` + `navigation.cy.ts` Cypress.
