# F012 – Refactor demo SPA to standard IdP auth redirect and shared useAuth

**Status**: Shipped  
**Type**: Feature  
**Depends On**: F010, F011  
**Description**: Replace the demo app's local public-auth hint page with the standard journey-SPA pattern: IdP redirect to `:8080/login.html`, shared `useAuth` hydration, and logout redirect.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Sibling repos must all be sibling folders under a common parent.

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `demo/`, `cypress/e2e/`, `vite.config.dev.ts`, `vitest.config.ts`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md` — Authentication Pattern
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `README.md`
- `src/utils/idpRedirect.ts` — `redirectToIdpLogin` (after F010)
- `src/composables/useAuth.ts` — shared composable (after F011)
- `demo/router.ts` — current public-entry + query `redirect` guard
- `demo/App.vue` — logout currently navigates to `/`
- `demo/bootstrap-auth.ts` — only calls `bootstrapAuthFromUrl`
- `demo/pages/PublicAuthHint.vue` — to be removed
- `cypress/e2e/navigation.cy.ts` — unauthenticated and logout expectations
- `cypress/support/registerAuthCommands.ts` — `cy.login` / `cy.logout`

**Reference pattern (external, do not read sibling SPA repos during execution):** Journey SPAs redirect unauthenticated `requiresAuth` routes with `redirectToIdpLogin(window.location.origin + to.fullPath)`, use `/` → default authenticated route, logout clears storage then redirects to IdP with `return_to`, and E2E logout asserts `cy.origin('http://127.0.0.1:8080', ...)` on `/login.html`.

## Goals

- Demo app uses shared `useAuth`, `syncAuthFromStorage`, and `hasStoredRole` from `@mentor-forge/mentorhub_spa_utils` (or relative `../src` imports during local dev — match existing demo import style).
- `demo/bootstrap-auth.ts` (or renamed `demo/initAuth.ts`) runs `bootstrapAuthFromUrl()` then `syncAuthFromStorage()` before the Vue app mounts.
- `demo/router.ts`:
  - `/` redirects to `/demo` (no local public auth hint route).
  - `beforeEach` guard: unauthenticated access to `requiresAuth` routes calls `redirectToIdpLogin(window.location.origin + to.fullPath)` and `next(false)`.
  - Role guard uses `hasStoredRole` from shared composable instead of parsing localStorage inline.
- `demo/App.vue` logout clears auth then `redirectToIdpLogin` with `return_to` set to the SPA origin root (not `router.push('/')`).
- Remove `demo/pages/PublicAuthHint.vue` and `demo/composables/useAuth.ts`.
- Add `.env.development` with `VITE_IDP_LOGIN_URI=http://127.0.0.1:8080/login.html` for the demo dev server.
- `vitest.config.ts` sets `VITE_IDP_LOGIN_URI` in test `env` for consistency (if any demo-adjacent tests need it).
- Cypress `navigation.cy.ts` updated:
  - Unauthenticated visit to `/demo` no longer lands on `/` with `redirect=/demo`; logout uses `cy.origin('http://127.0.0.1:8080', ...)` asserting `/login.html` and `return_to=` (Developer Edition welcome server must be reachable for that spec, or stub `location.replace` if the project convention prefers stubs — prefer `cy.origin` to match journey SPA E2E).
  - Token-expiration case redirects to IdP login rather than local public entry.
- Other Cypress specs that rely on `cy.login()` continue to pass without change.

## Testing Expectations

Run all commands from **this spa_utils repository root**.

- `npm install --include=dev`
- `npm run test` — unit tests
- `npm run lint`
- `npm run build`
- `npm run dev` — manual: visit `/demo` without auth; confirm browser navigates to `http://127.0.0.1:8080/login.html?return_to=...` (Developer Edition welcome server running on `:8080`)
- `npm run cypress:run` — headless E2E (dev server on `:8386`; for logout spec, welcome server on `:8080` per Developer Edition)

**Packaging verification:**

- `npm run build` — demo is not published, but library build must succeed after demo import changes

## Outputs

- `demo/bootstrap-auth.ts` — add `syncAuthFromStorage` (or replace with `demo/initAuth.ts` and update `demo/main.ts` import)
- `demo/main.ts` — import path if bootstrap file renamed
- `demo/router.ts` — standard IdP redirect guards; remove public hint route
- `demo/App.vue` — shared `useAuth`; logout via `redirectToIdpLogin`
- `demo/composables/useAuth.ts` — **delete**
- `demo/pages/PublicAuthHint.vue` — **delete**
- `.env.development` — `VITE_IDP_LOGIN_URI`
- `vitest.config.ts` — test env for `VITE_IDP_LOGIN_URI` (if needed)
- `cypress/e2e/navigation.cy.ts` — updated auth redirect expectations
- `CONTRIBUTING.md` — demo structure section (remove PublicAuthHint references)

The agent must not update files outside this list.

## Execution Notes

- Demo uses shared `useAuth` / `redirectToIdpLogin`; removed `PublicAuthHint.vue` and local `useAuth`.
- Router guards redirect unauthenticated users to `:8080/login.html`; logout uses `redirectToIdpLogin`.
- Added `.env.development` and vitest `VITE_IDP_LOGIN_URI` env.
- Updated `cypress/e2e/navigation.cy.ts` and `cypress/support/commands.ts` (logout no longer asserts `/` pathname after IdP redirect).
- Tests: `npm run test` 109 passed; `npm run build` success; `npm run cypress:run` 41 passed.
