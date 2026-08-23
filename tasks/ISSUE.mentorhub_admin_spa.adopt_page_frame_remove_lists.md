# Adopt spa_utils 1.0.0 PageFrame and remove list-card pages (Admin SPA)

## Summary

Pin `@mentor-forge/mentorhub_spa_utils@1.0.0`, adopt imported `PageFrame` for shared app-bar / hamburger / logout chrome, and **remove** local CardGrid catalog list pages that duplicate Discovery. Users find product and similar collections on Discovery; Admin keeps **Settings** at `/admin/settings` and other detail/edit/create pages that Discovery cards and universal nav target.

## Prerequisite

- `mentorhub_spa_utils` F033–F040 shipped and **`@mentor-forge/mentorhub_spa_utils@1.0.0`** published to CodeArtifact.
- Vue `base` and SPA nginx prefix (`/admin/`) already planned or shipped per mentorhub L022 (welcome nginx `/{journey}/` on **:8080**).

## Planning prompts (for `mentorhub_admin_spa` `tasks/_PLANNING.md`)

- Pin `@mentor-forge/mentorhub_spa_utils` to **`1.0.0`** in `package.json` / lockfile; run `npm install --include=dev` after CodeArtifact auth (`mh`).
- Replace local `v-app-bar`, hamburger drawer, profile link, and logout footer with `{ PageFrame }` wrapping `router-view` inside the host `v-app`. Pass **`pageTitle`** only; default slot is page body.
- **Do not** pass `navItems`, ALB origin props, URL maps, role tables, or extra drawer slots — the universal catalog is compiled into spa_utils (F036).
- Remove duplicate local nav that mirrors the universal hamburger catalog (Products list link now points to `/discovery/products` via spa_utils).
- **Remove** list-card catalog pages (e.g. Products CardGrid dashboard) and their routes, Cypress specs, and local nav entries that duplicate Discovery list pages.
- **Keep** **Settings** at `/admin/settings` (`JOURNEY_APP_PATHS.settings`) and any detail/edit/create admin pages not hosted as Discovery lists.
- Keep IdP bootstrap, `urlAuthBootstrap`, and `redirectToIdpLogin` behavior unchanged.
- Cypress: use spa_utils drawer automation ids — `nav-drawer-toggle`, `page-frame-title`, `nav-profile-link`, `nav-products-link`, `nav-settings-link`, `nav-logout-link`, etc. Drop SPA-local drawer selectors replaced by `PageFrame`. Remove or rewrite specs that asserted removed list-card routes.

## Notes

- Products list lives on Discovery (`/discovery/products`); Admin Settings remains the hamburger **Settings** target for `admin` role.
- Do not reintroduce local hamburger config — add or change universal nav links in spa_utils, not in this repo.
- See spa_utils README **Universal PageFrame** for allowed props and role-gated catalog table.
