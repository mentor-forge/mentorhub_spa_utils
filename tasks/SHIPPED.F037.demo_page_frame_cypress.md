# F037 – Demo PageFrame and Cypress nav roles

**Status**: Shipped  
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

### Plan

1. Replace demo `App.vue` local app-bar/drawer/logout with imported `PageFrame` (`pageTitle` only). Keep `v-app`, `provideEditorConfig`, and startup config load. Do not pass nav items or ALB config.
2. Add in-package DemoPage links (`/demo`, `/demo/editors`, `/demo/dashboard`, `/admin`) with stable automation ids. Hamburger stays product catalog only.
3. Rewrite `navigation.cy.ts` for role-filtered catalog hrefs (`:8080` Home, profile, logout, unauth/expiry). Reach editors/dashboard/admin via DemoPage links, not drawer ids.
4. Update `useRoles.cy.ts` to assert `nav-settings-link` / `nav-products-link` instead of `nav-admin-link`. Keep `/admin` access and redirect tests.
5. Update CONTRIBUTING.md so hamburger is product nav and demo/admin links live on DemoPage.
6. Run `npm run test`, `npm run build`, and Cypress (`navigation.cy.ts`, `useRoles.cy.ts`). Reuse or start `:8386` / demo API; record whether welcome `:8080` is up.

### Results

- **`demo/App.vue`**: local app-bar / drawer / logout removed. Host keeps `v-app`; imported `PageFrame` with static `pageTitle="spa_utils Demo"` plus existing `provideEditorConfig` / `loadConfig`. No nav items or ALB config passed in.
- **`demo/pages/DemoPage.vue`**: in-package links (`demo-page-demo-link`, `demo-page-editors-link`, `demo-page-dashboard-link`, `demo-page-admin-link`) to `/demo`, `/demo/editors`, `/demo/dashboard`, `/admin`. Hamburger is product catalog only.
- **`cypress/e2e/navigation.cy.ts`**: role-filter catalog (Home/Notifications; admin Products+Settings; customer org+members; mentor Resources/Paths/Plans), profile `/customer/profile/`, Home href `/discovery/` + `:8080`, logout + unauth/expiry IdP. Editors/dashboard/admin reached via DemoPage ids, not drawer `nav-*-link` demo ids. Used `cy.login(['user'])` because `registerAuthCommands` treats `cy.login([])` as admin.
- **`cypress/e2e/composables/useRoles.cy.ts`**: admin vs non-admin now asserts `nav-products-link` / `nav-settings-link`. `/admin` access and redirect tests kept.
- **`CONTRIBUTING.md`**: hamburger is product nav; demo/editors/dashboard/admin links live on DemoPage.
- **`npm run test`**: 39 files, **418 tests passed**.
- **`npm run build`**: succeeded.
- **Cypress** (`npx cypress run --spec cypress/e2e/navigation.cy.ts,cypress/e2e/composables/useRoles.cy.ts`): **19 passed** (navigation 15, useRoles 4). Dev server started on `:8386`; api_utils `pipenv run dev` on `:8385`; Mongo already up. **Welcome `:8080` was up** (`login.html` 200); logout/unauth/expiry IdP tests passed.
- **Blockers**: none. Working tree left uncommitted. Task file not renamed.

**Orchestrator confirmation:** Re-ran `npm run test` (39 files, 418 tests), `npm run build`, and Cypress `navigation.cy.ts` + `useRoles.cy.ts` (**19 passed**). Welcome `:8080` still up for IdP tests.
