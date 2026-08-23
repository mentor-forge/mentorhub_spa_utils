# Adopt spa_utils 1.0.0 PageFrame and remove list-card pages (Mentor SPA)

## Summary

Pin `@mentor-forge/mentorhub_spa_utils@1.0.0`, adopt imported `PageFrame` for shared app-bar / hamburger / logout chrome, and **remove** local CardGrid list pages now hosted on Discovery. Users browse resources, paths, and plans on Discovery; Mentor keeps **detail / edit / create** pages for resources, paths, plans, and encounters that Discovery cards and universal nav deep-link into.

## Prerequisite

- `mentorhub_spa_utils` F033–F040 shipped and **`@mentor-forge/mentorhub_spa_utils@1.0.0`** published to CodeArtifact.
- Vue `base` and SPA nginx prefix (`/mentor/`) already planned or shipped per mentorhub L022 (welcome nginx `/{journey}/` on **:8080**).

## Planning prompts (for `mentorhub_mentor_spa` `tasks/_PLANNING.md`)

- Pin `@mentor-forge/mentorhub_spa_utils` to **`1.0.0`** in `package.json` / lockfile; run `npm install --include=dev` after CodeArtifact auth (`mh`).
- Replace local `v-app-bar`, hamburger drawer, profile link, and logout footer with `{ PageFrame }` wrapping `router-view` inside the host `v-app`. Pass **`pageTitle`** only; default slot is page body.
- **Do not** pass `navItems`, ALB origin props, URL maps, role tables, or extra drawer slots — the universal catalog is compiled into spa_utils (F036).
- Remove duplicate local nav that mirrors the universal hamburger catalog (Resources, Paths, Plans links now target `/discovery/resources`, `/discovery/paths`, `/discovery/plans` via spa_utils).
- **Remove** local CardGrid list pages for resources, paths, and plans (and any similar list dashboards) plus their routes, Cypress specs, and local nav entries — lists now live on Discovery.
- **Keep** detail/edit/create routes for resources, paths, plans, and encounters; ensure Discovery card `buildJourneyUrl` targets resolve correctly under `/mentor/`.
- Keep IdP bootstrap, `urlAuthBootstrap`, and `redirectToIdpLogin` behavior unchanged.
- Cypress: use spa_utils drawer automation ids — `nav-drawer-toggle`, `page-frame-title`, `nav-profile-link`, `nav-resources-link`, `nav-paths-link`, `nav-plans-link`, `nav-logout-link`, etc. Drop SPA-local drawer selectors replaced by `PageFrame`. Remove or rewrite specs that asserted removed list-card routes; keep detail/edit flow coverage.

## Notes

- Hamburger mentor links open Discovery lists; mentor detail pages are reached from Discovery cards or direct ALB URLs, not from local list dashboards.
- Do not reintroduce local hamburger config — add or change universal nav links in spa_utils, not in this repo.
- See spa_utils README **Universal PageFrame** and **Cross-SPA URLs** for `buildJourneyUrl` usage from Discovery card authors.
