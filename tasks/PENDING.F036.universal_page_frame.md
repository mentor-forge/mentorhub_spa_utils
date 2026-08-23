# F036 – Universal PageFrame and role-gated nav catalog

**Status**: Pending  
**Type**: Feature  
**Depends On**: F035  
**Description**: Ship a compiled-in `PageFrame` (title, hamburger, profile-pic) whose nav catalog is baked into spa_utils and filtered by JWT roles — journey SPAs import the component and **must not** supply nav or ALB configuration.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Sibling repos must all be sibling folders under a common parent.

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `README.md`, `src/components/...`, `src/composables/...`, `tests/components/...`, `tests/composables/...`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md` — Automation IDs, Authentication Pattern
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `../mentorhub/tasks/SHIPPED.L022.welcome_nginx_journey_proxy.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `tasks/PENDING.F035.journey_alb_url_helpers.md` (or `SHIPPED.F035.*` at execution)
- `src/utils/journeyUrls.ts` (F035)
- `src/composables/useAuth.ts` — `roles`, `isAuthenticated`, `logout`
- `src/utils/idpRedirect.ts` — logout → `redirectToIdpLogin`
- `src/components/index.ts`
- `demo/App.vue` — current local app-bar/drawer (**do not** rewrite the demo in this task; F037)

### Locked decision: local nav config is **disallowed**

The catalog, role gates, and ALB URLs live in this package. Do **not** add props or provide/inject for `navItems`, extra links, journey URL maps, or ALB origin. A journey SPA that needs a new link changes **this** catalog in a later spa_utils task.

Allowed local inputs:

- `pageTitle` (string) — app-bar title for the current page
- default slot — page body (`router-view`)

Disallowed: `navItems`, `nav-extra` slot, `albOrigin`, `customerName` as a way to inject extra links. Optional **display-only** `customerName` for the two customer-role labels is allowed; if omitted, decode JWT `customer_name` / `custom:customer_name` when present, else the literal **`Customer`**. Do **not** call Customer API from spa_utils.

## Goals

### Nav catalog (compiled constant)

| Link-Name | Roles with access | URL (via F035) |
|-----------|-------------------|----------------|
| Home | Anyone (authenticated) | `/discovery/` |
| `[Customer Name]` | `roles` contains `customer` | `/customer/` |
| `[Customer Name] Members` | `roles` contains `customer` | `/discovery/members/` |
| Learning Resources | `roles` contains `mentor` | `/discovery/resources` |
| Learning Paths | `roles` contains `mentor` | `/discovery/paths` |
| Encounter Plans | `roles` contains `mentor` | `/discovery/plans` |
| Products | `roles` contains `admin` | `/discovery/products` |
| Notifications | Anyone (authenticated) | `/discovery/notifications` |
| Settings | `roles` contains `admin` | `/admin/settings` |

- Filter with `useAuth().roles` (localStorage `user_roles` / JWT roles already hydrated).
- Href is `href` (full ALB URL from `buildJourneyUrl`), **not** Vue Router `to` — these targets are other SPAs.
- Include **Logout** in the drawer footer (existing `nav-logout-link` behavior: `logout()` then `redirectToIdpLogin`).

### `PageFrame` component

- `v-app-bar`: hamburger (`nav-drawer-toggle`) when authenticated; `pageTitle`; trailing **profile pic** (`v-avatar` / `mdi-account` fallback; `picture` JWT claim if present) linking to `/customer/profile/` (`data-automation-id="nav-profile-link"`).
- Temporary `v-navigation-drawer` listing **only** catalog rows the token allows.
- Does **not** wrap `v-app` (host SPA keeps a single `v-app`). Does wrap `v-main` around the default slot.
- Stock Vuetify; stable automation ids: `nav-drawer-toggle`, `nav-home-link`, `nav-customer-link`, `nav-customer-members-link`, `nav-resources-link`, `nav-paths-link`, `nav-plans-link`, `nav-products-link`, `nav-notifications-link`, `nav-settings-link`, `nav-logout-link`, `nav-profile-link`, `page-frame-title`.
- Export from `src/components/index.ts` and any small `visibleUniversalNavItems(roles, customerName)` helper from composables or the same module.

Do **not** change `demo/App.vue` (F037). Do **not** bump version (F040).

## Testing Expectations

Run all commands from **this spa_utils repository root**.

- Vitest: catalog completeness (every table row); role matrix (no roles → Home + Notifications only; `customer` → org + members; `mentor` → three learning links; `admin` → Products + Settings; combined roles union).
- Vitest: `PageFrame` shallow-mount — title, hamburger, profile href, absence of disallowed props, drawer items hidden when role missing; logout calls through (mock `useAuth` / `redirectToIdpLogin`).
- Meet spa_standards coverage targets for components/composables.
- `npm run test`
- `npm run build`
- Dist declarations export `PageFrame`.

## Outputs

- `src/components/PageFrame.vue` (path may be `src/components/frame/PageFrame.vue`)
- Nav catalog module (e.g. `src/composables/universalNav.ts` or `src/components/frame/universalNav.ts`)
- `src/components/index.ts` — export `PageFrame`
- `src/composables/index.ts` — export helper/types if public
- `tests/components/PageFrame.test.ts`
- `tests/composables/universalNav.test.ts` (or co-located equivalent)

The agent must not update files outside this list (except a tiny barrel export already listed).

## Execution Notes

Reserved for the task execution agent.
