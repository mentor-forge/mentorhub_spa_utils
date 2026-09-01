Please create @_PLANNING.MD tasks to implement this issue. Only create tasks, do not edit any files outside of the @tasks folder.

# F-RS17: Pin spa_utils 1.0.1 and host AdminPage at /mentor/config

This is the **first** `mentorhub_mentor_spa` issue for the spa_utils **1.0.1** wave. It **owns this repo’s `@mentor-forge/mentorhub_spa_utils@1.0.1` pin bump**.

## Summary

Pin spa_utils **1.0.1** (catalog, logout `return_to=/discovery/`, Settings → hosting `/config`, Token claims). Add a Vue route for packaged `AdminPage` at `/mentor/config` (`path: '/config'` under existing journey `base`). Keep existing detail/edit/create pages. Do not restore Products / Customer / Members drawer rows locally.

## Prerequisite

- `mentorhub_spa_utils` F041–F046 shipped and **`@mentor-forge/mentorhub_spa_utils@1.0.1` published** to CodeArtifact.
- Vue `base` + SPA nginx prefix `/mentor/` already planned or shipped per mentorhub L022 (welcome nginx forwards `/{journey}/*` on **:8080**).

## Pin (this issue owns the bump)

- Set `@mentor-forge/mentorhub_spa_utils` to **`1.0.1`** in `package.json` / `package-lock.json`.
- `mh` then `npm install --include=dev` (CodeArtifact).

## Config route (packaged AdminPage)

- Import `{ AdminPage }` from `@mentor-forge/mentorhub_spa_utils`.
- Add Vue route `path: '/config'` under existing journey `base` so the page is **`/mentor/config`**.
- Do **not** pass `navItems`, ALB URLs, or role tables into `PageFrame`. Settings is already in the compiled catalog and must land in **this** SPA (`hostingConfigHref()` → `{origin}/mentor/config`).
- Gate `/mentor/config` with the **admin** role; non-admins redirect away.
- Keep existing detail/edit/create pages for resources, paths, plans, and encounters. Config route only — no new list dashboards.

## PageFrame / auth

- Keep IdP bootstrap / `urlAuthBootstrap` / `redirectToIdpLogin` as today.
- Logout `return_to` is owned by spa_utils (`logout()` then `redirectToIdpLogin(buildJourneyUrl('discovery'))` → `/discovery/`). Do not override locally.
- Do **not** restore Products / Customer / Customer Members hamburger rows locally.

## Cypress

- `nav-settings-link` is **admin-only** and opens **this** SPA’s `/mentor/config` page.
- Token tab shows `profile_id` / `customer_id` / `mentor_id` (`admin-token-profile-id-display`, `admin-token-customer-id-display`, `admin-token-mentor-id-display`).
- Hamburger no longer has Products / Customer / Customer Members (`nav-products-link`, `nav-customer-link`, `nav-customer-members-link` absent).
- Notifications (`nav-notifications-link`) and Settings only for `admin`.
- Gate `/mentor/config`: non-admins redirected away.

## Notes

- Do not pass local nav config, ALB origins, or role tables into `PageFrame`.
- See spa_utils README **Universal PageFrame** (1.0.1 catalog) and **Admin config and Token claims**.
