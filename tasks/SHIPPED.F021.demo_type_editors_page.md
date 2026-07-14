# F021 – Demo page: all type editors across DataCards

**Status**: Shipped  
**Type**: Feature  
**Depends On**: F020  
**Description**: Extend the spa_utils demo server with a page that hosts all type-aligned editors across several collapsible DataCards, demonstrating reactive binding, view/edit modes, validation, and AutoSave feedback.

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
- `demo/pages/DemoPage.vue`
- `demo/router.ts`
- `demo/App.vue`
- `cypress/e2e/pages/demo.cy.ts`
- `cypress/e2e/navigation.cy.ts`
- Card / DataCard / editor components from F016–F020

## Goals

- Add a demo route/page (prefer `/demo/editors`) that places **every** configurator-aligned editor into **several** `DataCard`s inside a `CardGrid`, for example:
  - **Identity** — word, sentence, identifier (`editable=false` by default)
  - **Contact** — email, us_phone, url, ip_address
  - **Content** — markdown
  - **Time** — duration (structured units UX), date-time (picker UX); assert neither requires typing ISO wire format
  - **Metrics** — boolean, count, index, rating (boolean/rating demonstrate change-based save)
  - **Audit** — `BreadcrumbDisplay` (display-only)
- Use a local reactive demo `model` (in-memory save stubs) so users can see AutoSave, validation errors, and title-bar identifier updates via `nameField`.
- Include at least one card demonstrating collapse/show-hide (`v-model:collapsed` optional) and one demonstrating view-only vs editable controls (`editable` prop).
- Keep existing AutoSaveField/Select demos on `/demo` (or a short legacy section) without breaking navigation Cypress tests — typed editors are preferred; AutoSaveField remains as compatibility wrapper.
- Stable `data-automation-id`s (`automationId` props) for Cypress coverage of cards and a representative set of editors.
- Navigation drawer / router entry for the new page.

## Testing Expectations

Run all commands from **this spa_utils repository root**.

- Update/add Cypress E2E covering: navigate to editors demo, edit a field, see save affordance, collapse a card, validation failure on bad `word`/`email` (or similar).
- `npm run test`
- `npm run build`
- Start demo as needed (`npm run api` / backing services if required, `npm run dev`) and `npm run cypress:run`

## Outputs

- `demo/pages/` — new or updated editors demo page
- `demo/router.ts` — route registration
- `demo/App.vue` — nav link if applicable
- `cypress/e2e/pages/demo.cy.ts` and/or `cypress/e2e/pages/editors.cy.ts`
- `cypress/e2e/navigation.cy.ts` — if nav entries change

The agent must not bump the package version (F024) or write docs beyond tiny demo comments (F023).

## Execution Notes

Partial work found already in place on disk (uncommitted) fully satisfied the Goals on inspection; only verification/testing was needed, no functional gaps found:

- `demo/pages/EditorsPage.vue` — `/demo/editors` page with a `CardGrid` of six `DataCard`s:
  - **Identity**: `WordEditor`, `SentenceEditor`, `IdentifierEditor` (default `editable=false`, per-type lock).
  - **Contact**: `EmailEditor`, `UsPhoneEditor`, `UrlEditor`, `IpAddressEditor`, all bound to a page-level `contactEditable` switch demonstrating the `editable` prop toggling live across a whole card.
  - **Content**: `MarkdownEditor`.
  - **Time**: `DurationEditor` (structured days/hours/minutes/seconds number fields) and `DateTimeEditor` (native date + time pickers) — neither requires typing raw ISO-8601 text.
  - **Metrics**: `BooleanEditor`, `CountEditor`, `IndexEditor`, `RatingEditor` (boolean/rating AutoSave on change, count/index AutoSave on blur).
  - **Audit**: `BreadcrumbDisplay` (always display-only) inside a card using controlled `v-model:collapsed` (starts collapsed) to demo the collapse/show-hide contract.
  - Single shared `reactive` in-memory `model` + `handleSave` stub (artificial 300ms delay) feeds a "Save Log" panel so AutoSave/validation/title-bar `nameField` (Identity card shows the live `word` value) are all visible without a backing API.
  - Stable `data-automation-id`s on the grid, every card, and a representative editor per card.
- `demo/router.ts` — added `/demo/editors` route (`requiresAuth`).
- `demo/App.vue` — added "Type Editors" nav-drawer link (`nav-editors-link`).
- `cypress/e2e/pages/editors.cy.ts` — new spec: page heading, all 6 cards render, a representative editor per card renders, AutoSave + save-log affordance on a `word` edit, validation errors for bad `word`/`email`, controlled collapse/expand of the Audit card, and Contact-card editable↔view-only toggle.
- `cypress/e2e/navigation.cy.ts` — added a drawer-navigation test for the new "Type Editors" link; existing nav tests untouched/still passing.
- Legacy `/demo` page (`AutoSaveField`/`AutoSaveSelect` demos) left untouched; its Cypress spec (`pages/demo.cy.ts`) still passes.

**Test results** (from spa_utils repo root):

- `npm run test` — 332/332 passed (33 test files); pre-existing Vuetify `[Vue warn]` component-resolution noise in `DataCard.test.ts` is unrelated stub-rendering chatter, not a failure.
- `npm run build` — succeeded (`vite build` + `tsc --emitDeclarationOnly`).
- No backing API/services needed — the editors demo is purely client-side (no `/api` calls), and this repo has no `npm run api` script. The dev server (`npm run dev`, port 8386) and the Developer-Edition mock IdP (port 8080, already running in this environment) were sufficient.
- `npx cypress run --spec cypress/e2e/pages/editors.cy.ts,cypress/e2e/navigation.cy.ts` — 19/19 passed.
- Full `npm run cypress:run` (all 14 specs) — 46/50 passed; the 4 failures are all in `pages/admin.cy.ts` / `pages/admin-app.cy.ts` (missing `admin-tab-config` automation id) and were confirmed pre-existing by re-running the same spec against a `git stash` of all F021 changes (identical 4/6 failures on the unmodified F020 baseline) — out of scope for F021, not touched by this task.

No blockers. Task complete; do not commit per instructions (left for the requesting user/process to commit).
