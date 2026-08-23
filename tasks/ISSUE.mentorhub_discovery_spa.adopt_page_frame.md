# Adopt spa_utils 1.0.0 PageFrame (Discovery SPA)

## Summary

Replace local app-bar, hamburger, and logout chrome with imported `PageFrame` from `@mentor-forge/mentorhub_spa_utils@1.0.0`. Discovery remains the **only** journey SPA that hosts CardGrid list dashboards (home, members, resources, paths, plans, products, notifications). Wire card and in-page deep links with `buildJourneyUrl` / `JOURNEY_APP_PATHS` so detail views open the owning SPA through welcome/ALB path prefixes — not direct debug ports.

## Prerequisite

- `mentorhub_spa_utils` F033–F040 shipped and **`@mentor-forge/mentorhub_spa_utils@1.0.0`** published to CodeArtifact.
- Vue `base` and SPA nginx prefix (`/discovery/`) already planned or shipped per mentorhub L022 (welcome nginx `/{journey}/` on **:8080**).

## Planning prompts (for `mentorhub_discovery_spa` `tasks/_PLANNING.md`)

- Pin `@mentor-forge/mentorhub_spa_utils` to **`1.0.0`** in `package.json` / lockfile; run `npm install --include=dev` after CodeArtifact auth (`mh`).
- Replace local `v-app-bar`, hamburger drawer, profile link, and logout footer with `{ PageFrame }` wrapping `router-view` inside the host `v-app`. Pass **`pageTitle`** only (optional display-only `customerName` if needed); default slot is page body.
- **Do not** pass `navItems`, ALB origin props, URL maps, role tables, or extra drawer slots — the universal catalog is compiled into spa_utils (F036).
- Remove duplicate local nav entries that mirror the universal hamburger catalog (Home, Members, Resources, Paths, Plans, Products, Notifications, Settings, etc.).
- **Keep** existing and planned CardGrid list pages: home (`/`), `members/`, `resources`, `paths`, `plans`, `products`, `notifications` under Vue base **`/discovery/`**. Align routes with F035 locked paths in `JOURNEY_APP_PATHS`.
- Import `buildJourneyUrl`, `resolveAlbOrigin`, and `JOURNEY_APP_PATHS` from spa_utils for card `href`s and in-page links to detail/edit/create routes in Customer, Admin, Mentor, and Mentee SPAs (e.g. `/customer/profile/`, `/admin/settings`, mentor resource detail). Hrefs must use welcome **:8080** / ALB origin rules — never debug ports (8398, 8388, …).
- Keep IdP bootstrap, `urlAuthBootstrap`, and `redirectToIdpLogin` behavior unchanged.
- Cypress: use spa_utils drawer automation ids — `nav-drawer-toggle`, `page-frame-title`, `nav-profile-link`, `nav-home-link`, `nav-notifications-link`, role-gated `nav-*-link` items, `nav-logout-link`. Drop SPA-local drawer selectors replaced by `PageFrame`. Assert cross-SPA card/deep-link `href`s include **:8080** when served from Vite/debug port.

## Notes

- List CardGrid dashboards stay on Discovery only; other journey SPAs remove duplicate list pages (spa_utils F039 sibling ISSUE seeds).
- Profile avatar and hamburger links are full ALB URLs (`href`), not Vue Router `to`.
- See spa_utils README **Universal PageFrame** and **Cross-SPA URLs** sections for import pattern and origin rules.
