# F041 – Navigation catalog, logout return_to, profile padding

**Status**: Shipped  
**Type**: Feature  
**Depends On**: none  
**Description**: Update the compiled hamburger catalog and PageFrame chrome for [issue #31](https://github.com/mentor-forge/mentorhub_spa_utils/issues/31): logout `return_to` is runtime ALB `/discovery/`, Events is added, Products/Customer/Customer Members are removed (cross-SPA collections are Cards), Settings (admin-only) links to the hosting SPA `/prefix/config`, Notifications is admin-only, and the profile icon gains right padding.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Sibling repos must all be sibling folders under a common parent.

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `README.md`, `src/components/...`, `src/composables/...`, `src/utils/...`, `tests/...`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md` — Automation IDs, Authentication Pattern
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `../mentorhub/tasks/SHIPPED.L022.welcome_nginx_journey_proxy.md` — `/{journey}/` on welcome **:8080**
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `README.md`
- `src/utils/journeyUrls.ts` — `JOURNEY_APP_PATHS`, `resolveAlbOrigin`, `buildJourneyUrl`, `AlbOriginLocation`
- `src/composables/universalNav.ts` — compiled catalog and `visibleUniversalNavItems`
- `src/components/PageFrame.vue` — logout currently `${window.location.origin}/`; profile link has no trailing margin
- `src/utils/idpRedirect.ts` — `redirectToIdpLogin(returnTo)` (do **not** hardcode IdP or return_to to `127.0.0.1`)
- `tests/utils/journeyUrls.test.ts`
- `tests/composables/universalNav.test.ts`
- `tests/components/PageFrame.test.ts`
- `tasks/SHIPPED.F035.journey_alb_url_helpers.md`
- `tasks/SHIPPED.F036.universal_page_frame.md`

GitHub: https://github.com/mentor-forge/mentorhub_spa_utils/issues/31

Do **not** edit demo, Cypress, README, or package version in this task (F043–F046). Do **not** edit sibling SPA repos. Do **not** add PageFrame props for nav items, journey prefix, or ALB origin.

### Locked catalog (issue #31 + maintainer)

Hamburger is Discovery collection routes plus hosting Settings. **All other cross-SPA entry points are Cards**, not drawer rows.

| Link-Name | Roles with access | Href |
|-----------|-------------------|------|
| Home | authenticated (any) | ALB `buildJourneyUrl('discovery')` → `/discovery/` |
| Events | authenticated (any) | ALB `buildJourneyUrl('discovery', 'events')` → `/discovery/events` |
| Resources | `mentor` | `/discovery/resources` |
| Paths | `mentor` | `/discovery/paths` |
| Plans | `mentor` | `/discovery/plans` |
| Notifications | `admin` only | `/discovery/notifications` |
| Settings | `admin` only | **hosting SPA** `{currentOrigin}/{journeyPrefix}/config` |

**Remove from the hamburger:** Products (`nav-products-link` / `/discovery/products`), Customer (`nav-customer-link` / `/customer/`), Customer Members (`nav-customer-members-link` / `/discovery/members/`). Keep the **Settings** label and `nav-settings-link`; change its href from `/admin/settings` to hosting `/{prefix}/config`.

Keep `JOURNEY_APP_PATHS.products`, `customerEdit`, `members`, `profile`, and `settings` for card/deep-link consumers. Add `events`. Do **not** add a single-journey `config` path — Settings is always the **current hosting app**.

## Goals

### Journey URL helpers

- Add `events: { journey: 'discovery', path: 'events' }` to `JOURNEY_APP_PATHS`.
- Extend `AlbOriginLocation` with optional `pathname` (tests already pass it in some cases).
- Export `currentJourneyPrefix(pathname)` that returns the matching `JOURNEY_PREFIXES` entry when `pathname` is `/{prefix}` or `/{prefix}/...`, else `null`.
- Export `hostingConfigHref(location?)`:
  - **Stay on the hosting app origin** (`location.origin` / `window.location.origin`). Do **not** rewrite debug ports to `:8080` (that would leave the current SPA).
  - When a journey prefix is detected: `{origin}/{prefix}/config` (no duplicate slashes).
  - When none is detected (spa_utils demo at `/demo`): `{origin}/config`.
  - Must use the **runtime hostname** from location. Must **not** hardcode `127.0.0.1`.

### Nav catalog

- Replace `UNIVERSAL_NAV_CATALOG` with the locked table. New automation id: `nav-events-link`. Keep `nav-settings-link` (href changes to hosting config). Do **not** render `nav-products-link`.
- Notifications and Settings `requiredRoles: ['admin']`. Empty / mentee / customer / mentor-without-admin must **not** see Notifications or Settings.
- Events has `requiredRoles: []` (any authenticated user). Resources / Paths / Plans remain `mentor`.
- `visibleUniversalNavItems` builds ALB hrefs via `buildJourneyUrl` except Settings, which uses `hostingConfigHref()`.
- Keep the `customerName` argument and `resolveCustomerDisplayName` (patch-safe public surface) even though customer drawer labels are gone. Do not add local nav config props.

### PageFrame logout

- `handleLogout` must pass `buildJourneyUrl('discovery')` to `redirectToIdpLogin` — **`return_to` is `/discovery/` on the runtime ALB/welcome origin**, not `${window.location.origin}/`.
- Origin comes from `resolveAlbOrigin()` (current hostname; debug ports → `{hostname}:8080`). Do **not** hardcode `127.0.0.1`. Developer Edition IdP **login** URL may still be the `IDP_LOGIN_URI` fallback; that is not `return_to`.
- Call order unchanged: `logout()` then `redirectToIdpLogin(returnTo)`.

### Profile padding

- Increase right/end padding on the profile avatar link (`data-automation-id="nav-profile-link"`). Locked class: Vuetify `me-4` on that `<a>` (margin-end so the icon is not flush with the app-bar edge).

### Craftsmanship Expectations

- Reuse `buildJourneyUrl` / `resolveAlbOrigin` for Discovery hrefs and logout `return_to`. Derive the Settings prefix from the current pathname (`JOURNEY_PREFIXES`), not from a host-SPA prop.
- Do not reintroduce Products, Customer, or Customer Members drawer rows; those collections are Cards.
- Do not treat Settings as `/admin/settings` or `/admin/config` for every SPA — it is `/{currentPrefix}/config`.

## Testing Expectations

Run all commands from **this spa_utils repository root**.

- Vitest `journeyUrls`: `events` → `/discovery/events`; `currentJourneyPrefix` matrix (`/discovery/events` → `discovery`, `/admin` → `admin`, `/demo` → `null`); `hostingConfigHref` on ALB `/mentor/x` → `{origin}/mentor/config`; on Vite `dev.example.ts.net:8392` + `/customer/profile/` → `http://dev.example.ts.net:8392/customer/config` (**not** `:8080`, **not** `127.0.0.1`); demo-style `/demo` → `{origin}/config`.
- Vitest catalog completeness (every locked row); role matrix: no roles → Home + Events only; `customer` → same (no org/members, no Products); `mentor` → plus Resources/Paths/Plans, no Notifications, no Settings; `admin` → plus Notifications + Settings (no Products); combined roles union. Assert Products / Customer / Customer Members ids are absent.
- Vitest PageFrame: Settings href uses hosting origin (when admin); Events/Notifications/Settings visibility by role; logout called with `buildJourneyUrl('discovery')` **not** `${origin}/`; profile link has `me-4`; no `127.0.0.1` in logout `returnTo` beyond whatever jsdom origin `buildJourneyUrl` produces (compare to the helper, do not concatenate `'/'`).
- Attempt to prove the implementation wrong: a `customer` role must not resurrect Customer links; an `admin` role must not resurrect Products; a non-admin must not see Notifications or Settings; Settings on a debug port must not bounce to welcome `:8080`.
- Meet spa_standards coverage targets for touched components/composables/utils.
- `npm run test`
- `npm run build`

## Outputs

- `src/utils/journeyUrls.ts` — `events` path, `currentJourneyPrefix`, `hostingConfigHref`, optional `pathname` on `AlbOriginLocation`
- `src/composables/universalNav.ts`
- `src/components/PageFrame.vue`
- `tests/utils/journeyUrls.test.ts`
- `tests/composables/universalNav.test.ts`
- `tests/components/PageFrame.test.ts`

The agent must not update files outside this list.

## Execution Notes

### Plan

1. Extend `journeyUrls.ts`: add `events` to `JOURNEY_APP_PATHS` (keep products/customer/members/profile/settings for cards); optional `pathname` on `AlbOriginLocation`; export `currentJourneyPrefix(pathname)` from `JOURNEY_PREFIXES`; export `hostingConfigHref(location?)` that stays on `location.origin` (no `:8080` rewrite) and returns `{origin}/{prefix}/config` or `{origin}/config`.
2. Replace `UNIVERSAL_NAV_CATALOG` with Home, Events, Resources, Paths, Plans, Notifications (admin), Settings (admin / `hostingConfigHref`). Drop Products, Customer, and Customer Members rows. Keep `customerName` + `resolveCustomerDisplayName`.
3. `PageFrame.handleLogout`: `logout()` then `redirectToIdpLogin(buildJourneyUrl('discovery'))`. Add Vuetify `me-4` on `nav-profile-link`.
4. Update Vitest for helpers, role matrix (including negative cases), logout `return_to`, Settings debug-port origin, and profile padding. Run `npm run test` and `npm run build`.

### Results

- **`src/utils/journeyUrls.ts`**: `JOURNEY_APP_PATHS.events`; optional `AlbOriginLocation.pathname`; `currentJourneyPrefix`; `hostingConfigHref` stays on `location.origin` (no `:8080` rewrite). Kept products / customerEdit / members / profile / settings; no `config` path.
- **`src/composables/universalNav.ts`**: catalog is Home, Events, Resources, Paths, Plans, Notifications (admin), Settings (admin / `hostingConfigHref`). Removed Products, Customer, Customer Members. `customerName` + `resolveCustomerDisplayName` retained.
- **`src/components/PageFrame.vue`**: logout `return_to` is `buildJourneyUrl('discovery')`; profile link has Vuetify `me-4`.
- **Tests**: `journeyUrls` 29 (events, prefix matrix, hosting config on ALB / debug port / demo); catalog + role matrix including customer-must-not-resurrect-Customer and admin-must-not-resurrect-Products; PageFrame 12 (Events/Notifications/Settings by role, Settings debug-port origin, logout helper, `me-4`).
- **`npm run test`**: 39 files, **430 passed**.
- **`npm run build`**: succeeded.
- **Coverage (touched files)**: `journeyUrls.ts` 100% lines/funcs/branches; `universalNav.ts` 100%; `PageFrame.vue` 100% lines/stmts/branches, 66.66% functions (Vue SFC compiler split, same as F036).
- **Blockers**: none. Demo, Cypress, README, and version bump left for F043–F046. Only Outputs files plus this task’s Execution Notes were edited.

**Orchestrator confirmation:** Re-ran `npm run test` (39 files, 430 passed) and `npm run build`. Catalog, `hostingConfigHref` (no `:8080` rewrite), logout `return_to` via `buildJourneyUrl('discovery')`, and profile `me-4` match the task.
