Please create @_PLANNING.MD tasks to implement this issue. Only create tasks, do not edit any files outside of the @tasks folder.

**GitHub**: https://github.com/mentor-forge/mentorhub_discovery_spa/issues/6

# F-DS03: Pin spa_utils 1.0.0 and adopt PageFrame (Discovery SPA)

This is the **first** `mentorhub_discovery_spa` issue for the spa_utils **1.0.0** wave. It **owns the `@mentor-forge/mentorhub_spa_utils@1.0.0` pin bump**. Sibling journey SPAs have their own PageFrame issues and pin independently.

## Summary

Replace local app-bar, hamburger, and logout chrome with imported `PageFrame`. Discovery remains the **only** journey SPA that hosts CardGrid list dashboards (home, members, resources, paths, plans, products, notifications). Wire card and in-page deep links with `buildJourneyUrl` / `JOURNEY_APP_PATHS` so detail views open the owning SPA through welcome/ALB path prefixes — not direct debug ports.

## Prerequisite

- `mentorhub_spa_utils` F033–F040 shipped (PR https://github.com/mentor-forge/mentorhub_spa_utils/pull/29) and **`@mentor-forge/mentorhub_spa_utils@1.0.0` published** to CodeArtifact (`npm run tag-release` on `main`).
- Vue `base` + SPA nginx prefix `/discovery/` planned or shipped: https://github.com/mentor-forge/mentorhub_discovery_spa/issues/5 (welcome nginx L022 already forwards `/{journey}/*` on **:8080**).

## Pin (this issue owns the bump)

- Set `@mentor-forge/mentorhub_spa_utils` to **`1.0.0`** in `package.json` / `package-lock.json`.
- `mh` then `npm install --include=dev` (CodeArtifact). Do **not** stay on `0.5.x`.
- **1.0.0** no longer exports `useInfiniteScroll` / `InfiniteScroll*`. List UIs stay on **`CardGrid` + `MhCard`** with offset/size header pagination.

## PageFrame (compiled-in chrome)

- Import `{ PageFrame }` from `@mentor-forge/mentorhub_spa_utils`. Host keeps a single `v-app`; wrap `router-view` in `<PageFrame page-title="...">`. PageFrame already wraps `v-main`.
- Allowed props: **`pageTitle`** (required) and optional display-only **`customerName`**. Do **not** pass `navItems`, URL maps, ALB origin, role tables, or extra drawer slots.
- Logout is built in (`nav-logout-link`: `logout()` then `redirectToIdpLogin`). Keep IdP bootstrap / `urlAuthBootstrap` as today.
- Drawer hrefs are full ALB URLs (`href`), not Vue Router `to`.
- Remove duplicate local nav that mirrors the universal catalog.

## Keep Discovery list pages

- **Keep** CardGrid list pages: home (`/`), `members/`, `resources`, `paths`, `plans`, `products`, `notifications` under Vue base **`/discovery/`**. Align with `JOURNEY_APP_PATHS`.
- Import `buildJourneyUrl`, `resolveAlbOrigin`, and `JOURNEY_APP_PATHS` for card `href`s to Customer / Admin / Mentor / Mentee detail pages. Origin is welcome **:8080** (or current origin on 8080/80/443). Never debug ports (8388, 8392, 8394, 8398, …).

## Cypress

Use spa_utils ids: `nav-drawer-toggle`, `page-frame-title`, `nav-profile-link` (`/customer/profile/`), `nav-home-link`, `nav-notifications-link`, role-gated `nav-*-link`, `nav-logout-link`. Drop SPA-local drawer selectors. Assert card/deep-link `href`s include **:8080** when served from Vite/debug port.

## Notes

- Other journey SPAs **remove** list-card pages; Discovery is the only list-card surface.
- See spa_utils README **Universal PageFrame (1.0.0)** and **Cross-SPA URLs**.
