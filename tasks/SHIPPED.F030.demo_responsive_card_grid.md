# F030 – Demonstrate responsive equal-height CardGrid

**Status**: Shipped  
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

### Plan

1. **`demo/pages/DashboardPage.vue`**
   - Switch to `v-container fluid` so the page provides enough width for 5–8 columns.
   - Replace obsolete VRow/VCol breakpoint copy with the fixed CSS Grid contract: 1→8 columns at 0/600/960/1280/1600/1920/2240/2560px; note that consumers must provide width; document how to verify 5–8 columns manually.
   - Keep existing entity automation IDs and action buttons; vary body lengths deliberately so equal-height rows are obvious.
   - Add a collapsible `MhCard` that starts collapsed (`v-model:collapsed`) with a distinct generic demo automation ID so Cypress can assert intrinsic (non-stretched) height.
   - Ensure ≥8 fixture cards so an 8-column row is fully populated at 2560px.

2. **`demo/pages/EditorsPage.vue`**
   - Remove only obsolete `cols`/`md`/`lg` props from `CardGrid`; leave editors content, DataCards, and `editors-demo-grid` unchanged.

3. **`cypress/e2e/pages/dashboard.cy.ts`**
   - Drop Vuetify `v-col-*` / `.mh-card-grid__col` assertions.
   - Assert column counts via computed `grid-template-columns` at representative viewports (incl. 8 at 2560 and still 8 wider).
   - Assert equal heights for expanded cards sharing a visual row despite varied body lengths.
   - Assert the collapsed demo card is shorter than expanded siblings in the same row.
   - Keep existing heading / grid / card / action smoke coverage.

4. Run `npm run test`, `npm run build`, start `npm run dev` if needed, run dashboard Cypress spec, kill dev server if started; record results; Status Shipped; rename to `SHIPPED.F030...`.

### Results

- **`demo/pages/DashboardPage.vue`**: fluid container; documents 1→8 breakpoints and consumer-width requirement for verifying 5–8 columns; varied body lengths; collapsed `MhCard` (`dashboard-card-collapsed-demo`) inserted after the first entity so it shares a multi-column row; existing entity/action automation IDs preserved.
- **`demo/pages/EditorsPage.vue`**: removed obsolete `cols`/`md`/`lg` from `CardGrid` only; `editors-demo-grid` and editor content unchanged.
- **`cypress/e2e/pages/dashboard.cy.ts`**: replaced Vuetify `v-col-*` assertions with computed `grid-template-columns` checks (1/2/3/4/5/6/7/8 at 500/600/960/1280/1600/1920/2240/2560, still 8 at 3000); equal-height expanded row; collapsed shorter than same-row expanded siblings; existing smoke tests kept.
- `npm run test`: **383/383 passed** (36 files).
- `npm run build`: **succeeded**.
- `npm run cypress:run -- --spec cypress/e2e/pages/dashboard.cy.ts` (dev server on :8386): **8/8 passed**.
- Column counts verified via Cypress at 1600→5, 1920→6, 2240→7, 2560→8, 3000→8 (still capped). Equal heights and collapsed intrinsic height asserted at 1280px.
- Outputs only as listed; no CardGrid/README/package/journey SPA edits. No commit/push.
- **Blockers**: none.

