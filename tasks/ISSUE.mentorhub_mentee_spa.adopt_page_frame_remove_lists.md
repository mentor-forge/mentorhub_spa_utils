# Adopt spa_utils 1.0.0 PageFrame and remove list-card pages (Mentee SPA)

## Summary

Pin `@mentor-forge/mentorhub_spa_utils@1.0.0`, adopt imported `PageFrame` for shared app-bar / hamburger / logout chrome, and **remove** local CardGrid home/dashboard list pages. Users find mentee journeys and collections on Discovery; Mentee keeps **detail** pages for journey, rating, and note targets that Discovery cards link to.

## Prerequisite

- `mentorhub_spa_utils` F033–F040 shipped and **`@mentor-forge/mentorhub_spa_utils@1.0.0`** published to CodeArtifact.
- Vue `base` and SPA nginx prefix (`/mentee/`) already planned or shipped per mentorhub L022 (welcome nginx `/{journey}/` on **:8080**).

## Planning prompts (for `mentorhub_mentee_spa` `tasks/_PLANNING.md`)

- Pin `@mentor-forge/mentorhub_spa_utils` to **`1.0.0`** in `package.json` / lockfile; run `npm install --include=dev` after CodeArtifact auth (`mh`).
- Replace local `v-app-bar`, hamburger drawer, profile link, and logout footer with `{ PageFrame }` wrapping `router-view` inside the host `v-app`. Pass **`pageTitle`** only; default slot is page body.
- **Do not** pass `navItems`, ALB origin props, URL maps, role tables, or extra drawer slots — the universal catalog is compiled into spa_utils (F036).
- Remove duplicate local nav that mirrors the universal hamburger catalog.
- **Remove** list-card home/dashboard pages and their routes, Cypress specs, and local nav entries — collection browsing moves to Discovery.
- **Keep** journey, rating, and note **detail** pages (and any create/edit flows) that Discovery cards and universal nav deep-link into under `/mentee/`.
- Keep IdP bootstrap, `urlAuthBootstrap`, and `redirectToIdpLogin` behavior unchanged.
- Cypress: use spa_utils drawer automation ids — `nav-drawer-toggle`, `page-frame-title`, `nav-profile-link`, `nav-home-link`, `nav-notifications-link`, `nav-logout-link`, etc. Drop SPA-local drawer selectors replaced by `PageFrame`. Remove or rewrite specs that asserted removed list-card dashboard routes; keep detail-page flow coverage.

## Notes

- Discovery is the entry point for mentee collection browsing; this SPA is detail-oriented for card targets.
- Do not reintroduce local hamburger config — add or change universal nav links in spa_utils, not in this repo.
- See spa_utils README **Universal PageFrame** for allowed props and role-gated catalog table.
