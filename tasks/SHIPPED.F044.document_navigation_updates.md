# F044 – Document navigation, logout, and hosting `/config`

**Status**: Shipped  
**Type**: Feature  
**Depends On**: F043  
**Description**: Update README (and any remaining CONTRIBUTING gaps) so PageFrame catalog, logout `return_to`, Settings hosting href, and Token tab claims match issue #31.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Sibling repos must all be sibling folders under a common parent.

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `README.md`, `CONTRIBUTING.md`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md`
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `README.md` — Universal PageFrame role table still lists Customer / Members / Settings / Notifications-for-anyone; logout snippet still `` redirectToIdpLogin(`${window.location.origin}/`) ``
- `CONTRIBUTING.md` — after F043 demo `/config` edits
- `src/composables/universalNav.ts`
- `src/components/PageFrame.vue`
- `src/utils/journeyUrls.ts` — `hostingConfigHref`, `events`
- `src/components/admin/TokenClaimsCard.vue`
- `demo/router.ts` after F043
- `tasks/SHIPPED.F038.document_page_frame.md`
- `tasks/PENDING.F041.navigation_catalog_logout_padding.md` (or `SHIPPED.F041.*`)
- `tasks/PENDING.F042.token_claims_profile_ids.md` (or `SHIPPED.F042.*`)
- `tasks/PENDING.F043.demo_config_route_cypress.md` (or `SHIPPED.F043.*`)

GitHub: https://github.com/mentor-forge/mentorhub_spa_utils/issues/31

Do **not** bump the package version (F046). Do **not** pin **1.0.1** in install examples yet. Do **not** edit sibling SPA repos. Do **not** change implementation.

## Goals

- README **Universal PageFrame** catalog table matches F041 (Home, Events, Resources, Paths, Plans, Notifications **admin-only**, Settings **admin-only** hosting `/prefix/config`). Remove Customer, Customer Members, and **Products** rows.
- Document Settings: **admin-only**; href is the **current SPA** `{origin}/{journey}/config` from the pathname prefix — not `/admin/settings` and not `/admin/config` for every app, not welcome-port rewrite. Journey SPAs must host `AdminPage` at that route (downstream ISSUEs in F045). Cross-SPA collection entry (Products, Customer, Members, etc.) is Cards, not hamburger.
- Document logout: `logout()` then `redirectToIdpLogin(buildJourneyUrl('discovery'))` so `return_to` is runtime-hostname ALB `/discovery/`, never `${origin}/` and never a hardcoded `127.0.0.1` SPA URL. Keep the existing IdP URI resolution list (runtime `IDP_LOGIN_URI` may still be Developer Edition `127.0.0.1:8080/login.html` — that is the **login** host, not `return_to`).
- Replace the Authentication integration logout snippet that uses `` `${window.location.origin}/` ``.
- Token / AdminPage docs: Token tab shows `profile_id`, `customer_id`, `mentor_id` (not a generic **ID**).
- Note removed hamburger automation ids (`nav-products-link`, `nav-customer-link`, `nav-customer-members-link`) and new id `nav-events-link`. **Keep** `nav-settings-link` (href is now hosting `/config`).
- Optional `customerName` prop: still allowed for patch compatibility; no longer used for drawer labels.
- CONTRIBUTING: leftover mentions of Products-as-nav, `/admin/settings` as the Settings href, or Notifications-for-everyone. Do not duplicate F043 route edits.
- Demo usage blurb: admin config at `/config`.

### Craftsmanship Expectations

- Document behavior from the owning helpers (`universalNav`, `hostingConfigHref`, `buildJourneyUrl`). Do not invent a second URL scheme in prose.

## Testing Expectations

Run all commands from **this spa_utils repository root**.

- Manual review: docs match exported APIs and F041–F043 behavior (catalog, hosting `/config`, logout `return_to`, Token claims).
- `npm run test`
- `npm run build`

## Outputs

- `README.md`
- `CONTRIBUTING.md` — only if F043 left catalog/logout/Token wording stale

The agent must not update files outside this list.

## Execution Notes

### Plan

1. Align README **Universal PageFrame** with F041: catalog table is Home / Events / Resources / Paths / Plans / Notifications (admin) / Settings (admin, `hostingConfigHref`); drop Customer, Members, Products; empty roles → Home + Events.
2. Document Settings as hosting `{origin}/{prefix}/config` (not `/admin/settings` or welcome-port rewrite), logout as `logout()` then `redirectToIdpLogin(buildJourneyUrl('discovery'))`, Token tab as `profile_id` / `customer_id` / `mentor_id`, removed vs new automation ids, and optional `customerName` as unused-for-labels compatibility.
3. Demo blurbs: admin config at `/config`. Cross-SPA URL examples use `hostingConfigHref` for Settings, not `JOURNEY_APP_PATHS.settings`.
4. Review CONTRIBUTING after F043; edit only if Products-as-nav, `/admin/settings` href, or Notifications-for-everyone remain.
5. Manual API review; `npm run test`; `npm run build`; record Results.

### Results

- **README.md** — Universal PageFrame catalog matches F041 (Home, Events, Resources, Paths, Plans; Notifications + Settings admin-only). Settings documented as `hostingConfigHref()` (`{origin}/{prefix}/config`, no `/admin/settings`, no welcome-port rewrite). Logout snippet is `logout()` then `redirectToIdpLogin(buildJourneyUrl('discovery'))`. Token tab documents `profile_id` / `customer_id` / `mentor_id`. Removed ids `nav-products-link`, `nav-customer-link`, `nav-customer-members-link`; new `nav-events-link`; kept `nav-settings-link`. Optional `customerName` noted as unused-for-labels compatibility. Demo blurbs use `/config`. Install example still `@1.0.0` (no 1.0.1 pin).
- **CONTRIBUTING.md** — **no further edits.** F043 already has `/config` as the canonical demo route, catalog (Events in; Products/Customer/Members out), admin Notifications + Settings at hosting `/config`, and packaged TokenClaimsCard. No leftover Products-as-nav, `/admin/settings` href, or Notifications-for-everyone wording.
- **Manual review:** docs match `universalNav` catalog, `hostingConfigHref`, `PageFrame.handleLogout` (`buildJourneyUrl('discovery')`), and `TokenClaimsCard` claim fields.
- **`npm run test`:** 40 files, **435 passed**.
- **`npm run build`:** succeeded.
- **Blockers:** none. Only Outputs (`README.md`) plus this task’s Execution Notes were edited. Implementation, sibling SPAs, and package version unchanged. Working tree left uncommitted.

**Orchestrator confirmation:** Re-ran `npm run test` (40 files, 435 passed) and `npm run build`. README catalog, Settings `hostingConfigHref`, logout `buildJourneyUrl('discovery')`, Token claims, and demo `/config` match F041–F043. CONTRIBUTING needed no further edits. Install examples still pin `@1.0.0`.
