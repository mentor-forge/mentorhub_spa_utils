Please create @_PLANNING.MD tasks to implement this issue. Only create tasks, do not edit any files outside of the @tasks folder.

**GitHub**: https://github.com/mentor-forge/mentorhub_mentee_spa/issues/29

# F-ES10: Pin spa_utils 1.0.0, adopt PageFrame, remove list-card pages (Mentee SPA)

This is the **first** `mentorhub_mentee_spa` issue for the spa_utils **1.0.0** wave. It **owns this repo’s `@mentor-forge/mentorhub_spa_utils@1.0.0` pin bump**.

## Summary

Adopt imported `PageFrame` for shared app-bar / hamburger / logout chrome, and **remove** local CardGrid home/dashboard list pages. Users find mentee journeys and collections on Discovery; Mentee keeps **detail** pages for journey, rating, and note targets that Discovery cards link to.

## Prerequisite

- `mentorhub_spa_utils` F033–F040 shipped (PR https://github.com/mentor-forge/mentorhub_spa_utils/pull/29) and **`@mentor-forge/mentorhub_spa_utils@1.0.0` published** to CodeArtifact.
- Vue `base` + SPA nginx prefix `/mentee/` planned or shipped: https://github.com/mentor-forge/mentorhub_mentee_spa/issues/28 (welcome nginx L022 on **:8080**).

## Pin (this issue owns the bump)

- Set `@mentor-forge/mentorhub_spa_utils` to **`1.0.0`** in `package.json` / `package-lock.json`.
- `mh` then `npm install --include=dev`. **1.0.0** does not export `useInfiniteScroll`.

## PageFrame (compiled-in chrome)

- Import `{ PageFrame }` from the package root. Host keeps a single `v-app`; wrap `router-view` in `<PageFrame page-title="...">`. PageFrame already wraps `v-main`.
- Allowed props: **`pageTitle`**. Do **not** pass `navItems`, ALB origin, URL maps, or role tables.
- Logout is built in. Keep IdP bootstrap / `urlAuthBootstrap` / `redirectToIdpLogin` as today.
- Authenticated hamburger shows **Home** + **Notifications** (and role-gated rows if the token has extra roles). Remove duplicate local nav.

## Remove list pages; keep detail

- **Remove** list-card home/dashboard pages and their routes, Cypress, and local nav — collection browsing moves to Discovery.
- **Keep** journey, rating, and note **detail** pages (and create/edit flows) under `/mentee/` for Discovery card targets.

## Cypress

Use spa_utils ids: `nav-drawer-toggle`, `page-frame-title`, `nav-profile-link`, `nav-home-link`, `nav-notifications-link`, `nav-logout-link`. Drop SPA-local drawer selectors. Remove list-dashboard specs; keep detail-page coverage.

## Notes

- Discovery is the entry point for collection browsing; this SPA is detail-oriented for card targets.
- See spa_utils README **Universal PageFrame (1.0.0)**.
