Please create @_PLANNING.MD tasks to implement this issue. Only create tasks, do not edit any files outside of the @tasks folder.

# F-DS04: Pin spa_utils 1.0.1, host AdminPage at /discovery/config, add Events list

This is the **first** `mentorhub_discovery_spa` issue for the spa_utils **1.0.1** wave. It **owns this repo’s `@mentor-forge/mentorhub_spa_utils@1.0.1` pin bump**.

## Summary

Pin spa_utils **1.0.1** (catalog, logout `return_to=/discovery/`, Settings → hosting `/config`, Token claims). Add a Vue route for packaged `AdminPage` at `/discovery/config` (`path: '/config'` under existing journey `base`). Add an Events CardGrid/list at `/discovery/events` so hamburger `nav-events-link` is not a dead path. Do not pass nav items into `PageFrame`.

## Prerequisite

- `mentorhub_spa_utils` F041–F046 shipped and **`@mentor-forge/mentorhub_spa_utils@1.0.1` published** to CodeArtifact.
- Vue `base` + SPA nginx prefix `/discovery/` already planned or shipped per mentorhub L022 (welcome nginx forwards `/{journey}/*` on **:8080**).

## Pin (this issue owns the bump)

- Set `@mentor-forge/mentorhub_spa_utils` to **`1.0.1`** in `package.json` / `package-lock.json`.
- `mh` then `npm install --include=dev` (CodeArtifact).

## Config route (packaged AdminPage)

- Import `{ AdminPage }` from `@mentor-forge/mentorhub_spa_utils`.
- Add Vue route `path: '/config'` under existing journey `base` so the page is **`/discovery/config`**.
- Do **not** pass `navItems`, ALB URLs, or role tables into `PageFrame`. Settings is already in the compiled catalog and must land in **this** SPA (`hostingConfigHref()` → `{origin}/discovery/config`).
- Gate `/discovery/config` with the **admin** role; non-admins redirect away.

## Events surface

- Add an **Events** CardGrid/list at `/discovery/events` (`path: '/events'`, `JOURNEY_APP_PATHS.events`) consistent with other Discovery collections so `nav-events-link` is not a dead ALB path.
- Keep existing list pages (home, members, resources, paths, plans, products, notifications). Config is in addition to those lists.

## PageFrame / auth

- Keep IdP bootstrap / `urlAuthBootstrap` / `redirectToIdpLogin` as today.
- Logout `return_to` is owned by spa_utils (`logout()` then `redirectToIdpLogin(buildJourneyUrl('discovery'))` → `/discovery/`). Do not override locally.

## Cypress

- `nav-settings-link` is **admin-only** and opens **this** SPA’s `/discovery/config` page.
- Token tab shows `profile_id` / `customer_id` / `mentor_id` (`admin-token-profile-id-display`, `admin-token-customer-id-display`, `admin-token-mentor-id-display`).
- Hamburger no longer has Products / Customer / Customer Members (`nav-products-link`, `nav-customer-link`, `nav-customer-members-link` absent).
- Notifications (`nav-notifications-link`) and Settings only for `admin`.
- Gate `/discovery/config`: non-admins redirected away.
- `nav-events-link` reaches `/discovery/events` (not a 404).

## Notes

- Do not pass local nav config, ALB origins, or role tables into `PageFrame`.
- See spa_utils README **Universal PageFrame** (1.0.1 catalog) and **Admin config and Token claims**.
