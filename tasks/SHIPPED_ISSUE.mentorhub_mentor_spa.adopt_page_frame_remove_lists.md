Please create @_PLANNING.MD tasks to implement this issue. Only create tasks, do not edit any files outside of the @tasks folder.

**GitHub**: https://github.com/mentor-forge/mentorhub_mentor_spa/issues/34

# F-RS16: Pin spa_utils 1.0.0, adopt PageFrame, remove list-card pages (Mentor SPA)

This is the **first** `mentorhub_mentor_spa` issue for the spa_utils **1.0.0** wave. It **owns this repo’s `@mentor-forge/mentorhub_spa_utils@1.0.0` pin bump**.

## Summary

Adopt imported `PageFrame` for shared app-bar / hamburger / logout chrome, and **remove** local CardGrid list pages now hosted on Discovery. Users browse resources, paths, and plans on Discovery; Mentor keeps **detail / edit / create** pages for resources, paths, plans, and encounters that Discovery cards deep-link into.

## Prerequisite

- `mentorhub_spa_utils` F033–F040 shipped (PR https://github.com/mentor-forge/mentorhub_spa_utils/pull/29) and **`@mentor-forge/mentorhub_spa_utils@1.0.0` published** to CodeArtifact.
- Vue `base` + SPA nginx prefix `/mentor/` planned or shipped: https://github.com/mentor-forge/mentorhub_mentor_spa/issues/33 (welcome nginx L022 on **:8080**).

## Pin (this issue owns the bump)

- Set `@mentor-forge/mentorhub_spa_utils` to **`1.0.0`** in `package.json` / `package-lock.json`.
- `mh` then `npm install --include=dev`. **1.0.0** does not export `useInfiniteScroll`.

## PageFrame (compiled-in chrome)

- Import `{ PageFrame }` from the package root. Host keeps a single `v-app`; wrap `router-view` in `<PageFrame page-title="...">`. PageFrame already wraps `v-main`.
- Allowed props: **`pageTitle`**. Do **not** pass `navItems`, ALB origin, URL maps, or role tables.
- Logout is built in. Keep IdP bootstrap / `urlAuthBootstrap` / `redirectToIdpLogin` as today.
- Hamburger Learning Resources / Paths / Plans hrefs target Discovery (`/discovery/resources`, `/paths`, `/plans`) via spa_utils. Remove duplicate local nav.

## Remove list pages; keep detail/edit

- **Remove** local CardGrid list pages for resources, paths, and plans (and similar dashboards) plus routes, Cypress, and local nav.
- **Keep** detail/edit/create routes for resources, paths, plans, and encounters under `/mentor/` so Discovery `buildJourneyUrl` card targets resolve.

## Cypress

Use spa_utils ids: `nav-drawer-toggle`, `page-frame-title`, `nav-profile-link`, `nav-resources-link`, `nav-paths-link`, `nav-plans-link`, `nav-logout-link`. Drop SPA-local drawer selectors. Remove list-page specs; keep detail/edit coverage.

## Notes

- Hamburger mentor links open Discovery lists; mentor detail pages come from Discovery cards, not local list dashboards.
- See spa_utils README **Universal PageFrame (1.0.0)** and **Cross-SPA URLs**.
