# F042 – Token tab profile_id, customer_id, mentor_id

**Status**: Shipped  
**Type**: Feature  
**Depends On**: F041  
**Description**: On the packaged Config/Admin Token tab, rename the “ID” field to **profile_id** and add **customer_id** and **mentor_id** claims ([issue #31](https://github.com/mentor-forge/mentorhub_spa_utils/issues/31)).

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Sibling repos must all be sibling folders under a common parent.

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `README.md`, `src/components/admin/...`, `src/utils/admin.ts`, `tests/...`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md` — Automation IDs (`-display` for read-only fields)
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `README.md`
- `src/components/admin/TokenClaimsCard.vue` — Token tab UI; label **ID** currently binds `user_id` then `sub`
- `src/components/AdminPage.vue` — Token tab hosts `TokenClaimsCard`
- `src/utils/admin.ts` — `getTokenValue` / `getTokenRoles`
- `cypress/tasks/signCypressJwt.ts` / `cypress/config/jwtDefaults.ts` — JWT already has `profile_id`, `customer_id`, `mentor_id` (do not change Cypress in this task)
- `tasks/PENDING.F041.navigation_catalog_logout_padding.md` (or `SHIPPED.F041.*` at execution)

GitHub: https://github.com/mentor-forge/mentorhub_spa_utils/issues/31

Do **not** edit demo pages, Cypress, README, or package version (F043–F046). Do **not** edit sibling SPA repos. Do **not** change Config Items / Versions / Enumerators tabs.

`demo/components/TokenClaimsCard.vue` is a **duplicate** of a different Token UI. Leave it for F043 (demo should switch to the packaged card). This task owns the packaged `src/components/admin/TokenClaimsCard.vue` only.

## Goals

- Token tab field currently labeled **ID** becomes **profile_id** and reads the `profile_id` claim via `getTokenValue` (do **not** fall back to `user_id` / `sub` for that field).
- Add read-only fields **customer_id** and **mentor_id** from those claim keys. Missing values display `N/A` (same pattern as IP Address).
- Keep existing IP Address and Roles presentation.
- Add stable automation ids on the new/changed displays:
  - `admin-token-profile-id-display`
  - `admin-token-customer-id-display`
  - `admin-token-mentor-id-display`
- Add a unit test file for `TokenClaimsCard` (this component was previously untested). Cover present claims, missing token, and missing individual keys → `N/A`. Include a negative case: a token with only `user_id` / `sub` must **not** populate the profile_id field.

### Craftsmanship Expectations

- One Token claims UI in the package: `src/components/admin/TokenClaimsCard.vue`. Do not fork a second packaged implementation.
- Reuse `getTokenValue` / `getTokenRoles`. Do not decode JWTs inside the card.

## Testing Expectations

Run all commands from **this spa_utils repository root**.

- Vitest shallow-mount `TokenClaimsCard`: labels `profile_id`, `customer_id`, `mentor_id`; automation ids; values from the `token` prop; empty/missing → `N/A`; `user_id`/`sub` alone do not fill profile_id.
- Meet spa_standards component coverage targets for the changed SFC.
- `npm run test`
- `npm run build`

## Outputs

- `src/components/admin/TokenClaimsCard.vue`
- `tests/components/TokenClaimsCard.test.ts` (or `tests/components/admin/TokenClaimsCard.test.ts`)

The agent must not update files outside this list.

## Execution Notes

### Plan

- Update packaged `TokenClaimsCard` only: rename the ID field to `profile_id` and bind `getTokenValue(token, 'profile_id')` with `N/A` when missing — no `user_id` / `sub` fallback.
- Add matching read-only `customer_id` and `mentor_id` fields using the same helper and `N/A` pattern as IP Address. Keep IP Address and Roles unchanged.
- Attach automation ids `admin-token-profile-id-display`, `admin-token-customer-id-display`, `admin-token-mentor-id-display` on the display fields.
- Add `tests/components/TokenClaimsCard.test.ts` (shallow-mount): present claims, missing token, missing keys → `N/A`, and `user_id`/`sub` alone must not fill `profile_id`.
- Run `npm run test` and `npm run build` from spa_utils root; record results here.

### Results

- `src/components/admin/TokenClaimsCard.vue`: ID field is now `profile_id` via `getTokenValue` only (no `user_id`/`sub` fallback). Added read-only `customer_id` and `mentor_id`. Missing claims show `N/A`. Automation ids: `admin-token-profile-id-display`, `admin-token-customer-id-display`, `admin-token-mentor-id-display`. IP Address and Roles unchanged.
- `tests/components/TokenClaimsCard.test.ts`: 5 shallow-mount cases (present claims, missing token, missing keys → `N/A`, `user_id`/`sub` do not fill `profile_id`, IP/Roles retained).
- `npm run test`: **pass** — 40 files, 435 tests.
- TokenClaimsCard coverage: **100%** statements / branches / functions / lines (meets spa_standards 90/90/85).
- `npm run build`: **pass** (vite + tsc).
- Only Outputs files plus this Execution Notes section were edited. No version bump, no commit, no sibling SPA or demo/Cypress/README changes.

**Orchestrator confirmation:** Re-ran `npm run test` (40 files, 435 passed) and `npm run build`. Token tab shows `profile_id` / `customer_id` / `mentor_id` via `getTokenValue` with `N/A` and no `user_id`/`sub` fallback.
