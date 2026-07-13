# F021 – Demo page: all type editors across DataCards

**Status**: Pending  
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
- `README.md`
- `demo/pages/DemoPage.vue`
- `demo/router.ts`
- `demo/App.vue`
- `cypress/e2e/pages/demo.cy.ts`
- `cypress/e2e/navigation.cy.ts`
- Card / DataCard / editor components from F016–F020

## Goals

- Add or reshape a demo route/page (e.g. `/demo/editors` or replace sections of `/demo`) that places **every** configurator-aligned editor into **several** `DataCard`s inside a `CardGrid`, for example:
  - **Identity** — word, sentence, identifier
  - **Contact** — email, us_phone, url, ip_address
  - **Content** — markdown, duration, date-time
  - **Metrics** — boolean, count, index, rating
  - **Audit** — breadcrumb display
- Use a local reactive demo model (in-memory save stubs are fine) so users can see AutoSave, validation errors, and title-bar identifier updates.
- Include at least one card demonstrating collapse/show-hide and one demonstrating view-only vs editable controls.
- Keep/align existing AutoSaveField/Select demos: either migrate them onto the new editors page or leave a short legacy section without breaking navigation Cypress tests.
- Stable `data-automation-id`s for Cypress coverage of cards and a representative set of editors.
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

(reserved for execution agent)
