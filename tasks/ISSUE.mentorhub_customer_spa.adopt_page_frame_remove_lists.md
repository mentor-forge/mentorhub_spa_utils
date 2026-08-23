# Adopt spa_utils 1.0.0 PageFrame and remove list-card pages (Customer SPA)

## Summary

Pin `@mentor-forge/mentorhub_spa_utils@1.0.0`, adopt imported `PageFrame` for shared app-bar / hamburger / logout chrome, and **remove** local CardGrid list dashboards that duplicate Discovery. Users find collections on Discovery; Customer keeps **detail / edit** pages — **CustomerEditPage** at journey root `/customer/` and **profile** at `/customer/profile/`.

## Prerequisite

- `mentorhub_spa_utils` F033–F040 shipped and **`@mentor-forge/mentorhub_spa_utils@1.0.0`** published to CodeArtifact.
- Vue `base` and SPA nginx prefix (`/customer/`) already planned or shipped per mentorhub L022 (welcome nginx `/{journey}/` on **:8080**).

## Planning prompts (for `mentorhub_customer_spa` `tasks/_PLANNING.md`)

- Pin `@mentor-forge/mentorhub_spa_utils` to **`1.0.0`** in `package.json` / lockfile; run `npm install --include=dev` after CodeArtifact auth (`mh`).
- Replace local `v-app-bar`, hamburger drawer, profile link, and logout footer with `{ PageFrame }` wrapping `router-view` inside the host `v-app`. Pass **`pageTitle`** only (optional display-only `customerName` for drawer customer labels); default slot is page body.
- **Do not** pass `navItems`, ALB origin props, URL maps, role tables, or extra drawer slots — the universal catalog is compiled into spa_utils (F036).
- Remove duplicate local nav that mirrors the universal hamburger catalog.
- **Remove** org/member/resource-style CardGrid list dashboards and their routes, Cypress specs, and any local nav entries that duplicate Discovery list pages (e.g. members list now at `/discovery/members/`).
- **Keep** **CustomerEditPage** at `/customer/` (journey root) and **profile** at `/customer/profile/` — targets for Discovery cards and universal nav (`JOURNEY_APP_PATHS.customerEdit`, `JOURNEY_APP_PATHS.profile`).
- Keep IdP bootstrap, `urlAuthBootstrap`, and `redirectToIdpLogin` behavior unchanged.
- Cypress: use spa_utils drawer automation ids — `nav-drawer-toggle`, `page-frame-title`, `nav-profile-link`, `nav-customer-link`, `nav-customer-members-link`, `nav-logout-link`, etc. Drop SPA-local drawer selectors replaced by `PageFrame`. Remove or rewrite specs that asserted removed list-card routes.

## Notes

- Discovery is the only list-card interface; Customer is detail/edit only for org and profile flows.
- Do not reintroduce local hamburger config — add or change universal nav links in spa_utils, not in this repo.
- See spa_utils README **Universal PageFrame** for allowed props and role-gated catalog table.
