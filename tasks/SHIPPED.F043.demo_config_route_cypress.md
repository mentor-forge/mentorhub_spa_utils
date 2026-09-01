# F043 – Demo `/config` route and Cypress nav coverage

**Status**: Shipped  
**Type**: Feature  
**Depends On**: F042  
**Description**: Point the demo Admin/config page at `/config`, show the packaged Token claims card, and rewrite Cypress so the issue #31 catalog (Events in, Products out), hosting Settings href, logout `return_to=/discovery/`, and Token tab fields are verified in the browser.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Sibling repos must all be sibling folders under a common parent.

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `demo/...`, `cypress/...`, `CONTRIBUTING.md`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md`
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `CONTRIBUTING.md` — demo routes currently `/admin`
- `demo/router.ts` — `/admin` requires `admin` role
- `demo/pages/AdminPage.vue` — imports demo-local TokenClaimsCard
- `demo/pages/DemoPage.vue` — `demo-page-admin-link` → `/admin`
- `demo/components/TokenClaimsCard.vue` — duplicate; F042 updated the packaged card
- `src/components/admin/TokenClaimsCard.vue` — source of truth after F042
- `cypress/e2e/navigation.cy.ts`
- `cypress/e2e/composables/useRoles.cy.ts`
- `cypress/e2e/pages/admin.cy.ts`
- `cypress/e2e/pages/admin-app.cy.ts`
- `cypress/support/commands.ts` — `waitForAdminPage` asserts `/admin`
- `tasks/SHIPPED.F037.demo_page_frame_cypress.md`
- `tasks/PENDING.F041.navigation_catalog_logout_padding.md` (or `SHIPPED.F041.*`)
- `tasks/PENDING.F042.token_claims_profile_ids.md` (or `SHIPPED.F042.*`)

GitHub: https://github.com/mentor-forge/mentorhub_spa_utils/issues/31

Do **not** bump the package version (F046). Do **not** rewrite README PageFrame tables (F044). Do **not** edit sibling SPA repos.

The demo app has **no** L022 journey prefix. Settings href must be `{demoOrigin}/config` (F041 `hostingConfigHref` when prefix is `null`).

## Goals

- Add authenticated route **`/config`** rendering the existing Admin/config page. Keep **`requiresRole: 'admin'`** — Settings is admin-only in the catalog; non-admins must not reach the page by URL either.
- Redirect `/admin` → `/config` so old bookmarks still work.
- Update DemoPage in-package link to `/config` (keep `demo-page-admin-link`).
- Switch `demo/pages/AdminPage.vue` to the packaged `TokenClaimsCard` (import from `src/components/admin/TokenClaimsCard.vue` or the package components barrel). **Delete** `demo/components/TokenClaimsCard.vue` if nothing else imports it.
- Cypress navigation:
  - Non-admin/non-mentor/non-customer: Home + Events visible; Notifications, Settings, Products, Customer, Customer Members **absent**.
  - `admin`: Notifications + Settings present; Products/Customer/Members **absent**.
  - `customer`: no Customer / Customer Members rows.
  - `mentor`: Resources/Paths/Plans present; Notifications and Settings absent.
  - Settings `href` (`nav-settings-link`, admin session) is the **current demo origin** + `/config` (not `/admin/settings`, not welcome `:8080`, not hardcoded `127.0.0.1` unless the demo itself is served there).
  - Events `href` includes `/discovery/events` and welcome `:8080` when the demo runs on a Vite debug port.
  - Logout: IdP `/login.html` `return_to` query includes `/discovery/` (URL-encoded ok) and the ALB/welcome host (`:8080` from debug), **not** `{viteOrigin}/` as the return target. `cy.origin('http://127.0.0.1:8080')` remains valid **only** as the Developer Edition IdP host, not as a hardcoded SPA return_to.
  - Profile link still `/customer/profile/`.
- Cypress `useRoles.cy.ts`: Settings (`nav-settings-link`) and Notifications are both admin-only; Products must **not** appear. Keep “non-admin redirected away from admin/config”: visiting `/config` (or `/admin`) as a non-admin lands on `/demo`, not the config page.
- Cypress admin specs and `waitForAdminPage`: assert `/config`. Token tab shows `profile_id`, `customer_id`, `mentor_id` (automation ids from F042). Stub `/api/config` token when the live API payload is not guaranteed.
- Update CONTRIBUTING demo route list (`/config` not `/admin` as the canonical path) and hamburger wording if it still mentions Products as a drawer item or `/admin/settings` as the Settings href.

### Craftsmanship Expectations

- Demo must not pass nav items into `PageFrame`. Hamburger stays the product catalog; DemoPage keeps in-package editor/dashboard links.
- Prefer the packaged TokenClaimsCard over the demo duplicate; delete the obsolete local copy.

## Testing Expectations

Run all commands from **this spa_utils repository root**.

- `cd ../mentorhub_api_utils && pipenv run db && pipenv run dev` when admin config E2E needs a backing `/api/config` (Cypress stubs are acceptable where the suite already intercepts).
- `npm run test`
- `npm run build`
- `npm run dev` (demo on `:8386`) plus Developer Edition welcome on `:8080` for logout/unauth specs.
- `npx cypress run --spec cypress/e2e/navigation.cy.ts,cypress/e2e/composables/useRoles.cy.ts,cypress/e2e/pages/admin.cy.ts,cypress/e2e/pages/admin-app.cy.ts`
- Record if welcome `:8080` is down: logout/unauthenticated IdP tests need it; catalog href assertions do not require journey SPA upstreams.

## Outputs

- `demo/router.ts`
- `demo/pages/DemoPage.vue`
- `demo/pages/AdminPage.vue`
- `demo/components/TokenClaimsCard.vue` — **deleted** if unused
- `cypress/e2e/navigation.cy.ts`
- `cypress/e2e/composables/useRoles.cy.ts`
- `cypress/e2e/pages/admin.cy.ts`
- `cypress/e2e/pages/admin-app.cy.ts`
- `cypress/support/commands.ts` — `waitForAdminPage` URL
- `CONTRIBUTING.md` — demo routes / admin-role wording for `/config`

The agent must not update files outside this list.

## Execution Notes

### Plan

1. Add `/config` (AdminPage, `requiresAuth` + `requiresRole: 'admin'`) and redirect `/admin` → `/config`. Point DemoPage `demo-page-admin-link` at `/config`.
2. Import packaged `src/components/admin/TokenClaimsCard.vue` in `demo/pages/AdminPage.vue`; delete unused `demo/components/TokenClaimsCard.vue`.
3. Rewrite Cypress role matrix for issue #31 (Events in; Products/Customer/Members out; Notifications + Settings admin-only). Assert Settings `href` is `{demoOrigin}/config`, Events includes `/discovery/events` + `:8080` on Vite, logout `return_to` includes `/discovery/` on welcome `:8080` (not the Vite origin). `waitForAdminPage` and admin specs use `/config`. Stub `/api/config` token for profile/customer/mentor ids.
4. Update CONTRIBUTING demo routes and hamburger wording. Run unit tests, build, and listed Cypress specs.

### Results

- **`demo/router.ts`**: `/config` renders AdminPage with `requiresAuth` + `requiresRole: 'admin'`. `/admin` redirects to `/config`.
- **`demo/pages/DemoPage.vue`**: `demo-page-admin-link` now `to="/config"`.
- **`demo/pages/AdminPage.vue`**: imports packaged `src/components/admin/TokenClaimsCard.vue`.
- **Deleted** `demo/components/TokenClaimsCard.vue` (unused after the switch).
- **Cypress**: issue #31 catalog (Events in; Products/Customer/Members out; Notifications + Settings admin-only). Settings href is `{demoOrigin}/config` (no `:8080`, no `/admin/`). Events href includes `/discovery/events` + `:8080`. Logout `return_to` includes `/discovery/` on welcome `:8080`, not Vite `:8386`. Profile still `/customer/profile/`. `waitForAdminPage` asserts `/config`. Token tab asserts `profile_id` / `customer_id` / `mentor_id` via stubbed `/api/config`.
- **`CONTRIBUTING.md`**: canonical demo route is `/config`; hamburger wording updated (no Products drawer item, Settings is hosting `/config`).
- **`npm run test`**: 40 files, **435 passed**.
- **`npm run build`**: succeeded.
- **Welcome `:8080`**: **up** (`login.html` 200). Demo `:8386` was down; started `npm run dev` for Cypress.
- **Cypress** `navigation.cy.ts`, `useRoles.cy.ts`, `admin.cy.ts`, `admin-app.cy.ts`: **34 passed**, 0 failed.
- **Blockers**: none. Only Outputs files plus this task’s Execution Notes were edited. Package version not bumped. README PageFrame tables not rewritten. Sibling SPAs not edited. Demo still does not pass nav items into `PageFrame`.

**Orchestrator confirmation:** Re-ran `npm run test` (40 files, 435 passed), `npm run build`, and `npx cypress run` for the four listed specs (**34 passed**). Welcome `:8080` was up; demo `:8386` was restarted for confirmation. Settings href, Events `/discovery/events`, logout `return_to=/discovery/`, `/config` route, and Token tab claim ids all match the task.
