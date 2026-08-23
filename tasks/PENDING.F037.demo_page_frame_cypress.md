# F037 – Demo PageFrame and Cypress nav roles

**Status**: Pending  
**Type**: Feature  
**Depends On**: F036  
**Description**: Replace the demo’s local app-bar/drawer with imported `PageFrame`, move in-package demo routes off the hamburger, and cover role-filtered ALB links in Cypress.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Sibling repos must all be sibling folders under a common parent.

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `demo/...`, `cypress/...`, `src/components/PageFrame.vue`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md`
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `tasks/SHIPPED.F036.universal_page_frame.md` (filename may still be `PENDING.*`)
- `demo/App.vue`
- `demo/pages/DemoPage.vue`
- `demo/router.ts`
- `cypress/e2e/navigation.cy.ts`
- `cypress/support/registerAuthCommands.ts` — `cy.login(roles?)`
- `CONTRIBUTING.md` — Demo App section

**Locked:** Demo must **not** pass nav items or ALB config into `PageFrame`. In-package routes (`/demo`, `/demo/editors`, `/demo/dashboard`, `/admin` config page) are **not** hamburger entries; put those links on `DemoPage` (and keep router). Hamburger is the product catalog only (hrefs to mock ALB `:8080/...`). Logout stays inside `PageFrame`.

## Goals

- `demo/App.vue`: `<v-app><PageFrame :page-title="...">` + existing `provideEditorConfig` / config load; remove local `v-app-bar` / `v-navigation-drawer` / local logout.
- Page title can be a static `"spa_utils Demo"` or derived from route; do not invent a nav config API.
- `DemoPage.vue`: links to editors, dashboard, and admin config so Cypress can still reach them without hamburger demo items.
- Rewrite `cypress/e2e/navigation.cy.ts`:
  - Authenticated hamburger still `nav-drawer-toggle`.
  - `cy.login([])` or a non-admin/non-mentor/non-customer role set → Home + Notifications visible; Products/Settings/customer/mentor links **absent**.
  - `cy.login(['admin'])` → Products + Settings present; customer/mentor links absent.
  - `cy.login(['customer'])` → customer org + members present.
  - `cy.login(['mentor'])` → Resources, Paths, Plans present.
  - Profile control `nav-profile-link` present; `href` includes `/customer/profile/`.
  - Home `href` includes `/discovery/` and host **:8080** when the demo is served from Vite/debug port.
  - Logout still lands on `http://127.0.0.1:8080/login.html`.
  - Unauthenticated / expiry cases remain.
  - **Do not** assert `nav-demo-link` / `nav-editors-link` / `nav-dashboard-link` / `nav-admin-link` in the drawer. Reach editors/dashboard via DemoPage links (update `editors.cy.ts` / `dashboard.cy.ts` / `admin*.cy.ts` only if they depended on drawer items).
- Do **not** bump version (F040).

## Testing Expectations

Run all commands from **this spa_utils repository root**.

- Run `mh` if CodeArtifact is needed; start `cd ../mentorhub_api_utils && pipenv run db && pipenv run dev` if Cypress needs the demo API.
- `npm run test`
- `npm run build`
- `npm run dev` + `npx cypress run --spec cypress/e2e/navigation.cy.ts` (and any specs updated for DemoPage links).
- Record if welcome `:8080` is down: logout/unauthenticated IdP tests need it; role-filter href assertions do not require journey SPA upstreams (502 from welcome is acceptable for click-through).

## Outputs

- `demo/App.vue`
- `demo/pages/DemoPage.vue`
- `cypress/e2e/navigation.cy.ts`
- Other `cypress/e2e/**/*.cy.ts` only if they break because drawer demo links moved
- `CONTRIBUTING.md` — Demo App bullet if it still describes a local hamburger of demo routes

The agent must not update files outside this list.

## Execution Notes

Reserved for the task execution agent.
