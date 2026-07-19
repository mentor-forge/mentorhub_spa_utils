# F030 – Demonstrate responsive equal-height CardGrid

**Status**: Pending  
**Type**: Feature  
**Depends On**: F029  
**Description**: Update the cards dashboard and its Cypress coverage to demonstrate varied-content equal-height rows, collapsed-card intrinsic height, and responsive growth through eight columns. Also remove obsolete `CardGrid` breakpoint props from other in-repo demo consumers so the demo app builds cleanly after F029.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `README.md`, `demo/...`, `cypress/e2e/...`, `src/components/...`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md` — page E2E and automation-ID standards
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- the status-prefixed task record matching `F029.harvest_responsive_card_grid.md`
- `README.md`
- `src/components/CardGrid.vue`
- `src/components/MhCard.vue`
- `demo/pages/DashboardPage.vue`
- `demo/pages/EditorsPage.vue` — currently passes removed `cols`/`md`/`lg` props into `CardGrid`
- `cypress/e2e/pages/dashboard.cy.ts`

## Goals

- Keep `/demo/dashboard` a generic shared-component showcase; do not introduce Paths, journey routes, journey API behavior, or journey automation IDs.
- Replace the obsolete `VRow`/`VCol` breakpoint explanation with the fixed CSS Grid progression: 1/2/3/4/5/6/7/8 columns at 0/600/960/1280/1600/1920/2240/2560px.
- Use enough generic fixture cards and deliberately varied body lengths so equal-height expanded siblings are visually obvious.
- Include a collapsible/collapsed `MhCard` example that visibly remains title-bar/intrinsic height while expanded siblings stretch.
- Let this demo page, as a `CardGrid` consumer, provide enough content width to verify 5–8 columns. A page-level `v-container fluid` choice is permitted here but must not be built into the shared component.
- Explain on the page that wide layouts require consumer-provided width, and document browser widths for manually checking 5–8 columns.
- Preserve existing dashboard automation IDs and action behavior unless fixture additions require new generic demo IDs.
- On `/demo/editors`, remove the obsolete `CardGrid` props (`cols="12" md="6" lg="4"`) so the page compiles against the harvested API. Keep editor content, `DataCard` composition, and `editors-demo-grid` automation IDs stable; do not redesign the editors gallery beyond that compatibility cleanup.
- Replace Cypress assertions for removed Vuetify breakpoint classes with behavior-based checks against the CSS Grid.
- Add practical Cypress coverage for:
  - expected column counts at representative viewports, including the 2560px maximum of eight;
  - no growth beyond eight at a wider viewport;
  - equal heights for expanded cards in one visual row despite varied body lengths;
  - a collapsed card remaining shorter/intrinsic rather than stretching;
  - existing dashboard rendering and action smoke behavior.

## Testing Expectations

Run all commands from this repository root.

- `npm run test`
- `npm run build`
- Start the demo with `npm run dev` and run `npm run cypress:run -- --spec cypress/e2e/pages/dashboard.cy.ts`.
- Manually inspect `/demo/dashboard` at 1600, 1920, 2240, 2560, and greater-than-2560px widths; record observed 5, 6, 7, 8, and still-8 column counts.
- Confirm expanded cards sharing a row have equal heights and the collapsed example does not.

## Outputs

- `demo/pages/DashboardPage.vue`
- `demo/pages/EditorsPage.vue` — remove removed breakpoint props only
- `cypress/e2e/pages/dashboard.cy.ts`

The agent must not edit shared component implementation, README, package versions, publishing workflows, or any journey SPA in this task.

## Execution Notes

