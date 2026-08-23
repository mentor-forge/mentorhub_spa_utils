Please create @_PLANNING.MD tasks to implement this issue. Only create tasks, do not edit any files outside of the @tasks folder.

**GitHub**: https://github.com/mentor-forge/mentorhub_customer_spa/issues/15

# F-CS12: Pin spa_utils 1.0.0, adopt PageFrame, remove list-card pages (Customer SPA)

This is the **first** `mentorhub_customer_spa` issue for the spa_utils **1.0.0** wave. It **owns this repo’s `@mentor-forge/mentorhub_spa_utils@1.0.0` pin bump**.

## Summary

Adopt imported `PageFrame` for shared app-bar / hamburger / logout chrome, and **remove** local CardGrid list dashboards that duplicate Discovery. Users find collections on Discovery; Customer keeps **detail / edit** pages — **CustomerEditPage** at `/customer/` and **profile** at `/customer/profile/`.

## Prerequisite

- `mentorhub_spa_utils` F033–F040 shipped (PR https://github.com/mentor-forge/mentorhub_spa_utils/pull/29) and **`@mentor-forge/mentorhub_spa_utils@1.0.0` published** to CodeArtifact.
- Vue `base` + SPA nginx prefix `/customer/` planned or shipped: https://github.com/mentor-forge/mentorhub_customer_spa/issues/14 (welcome nginx L022 on **:8080**).

## Pin (this issue owns the bump)

- Set `@mentor-forge/mentorhub_spa_utils` to **`1.0.0`** in `package.json` / `package-lock.json`.
- `mh` then `npm install --include=dev`. **1.0.0** does not export `useInfiniteScroll`.

## PageFrame (compiled-in chrome)

- Import `{ PageFrame }` from the package root. Host keeps a single `v-app`; wrap `router-view` in `<PageFrame page-title="...">`. PageFrame already wraps `v-main`.
- Allowed props: **`pageTitle`** and optional display-only **`customerName`** (JWT `customer_name` / `custom:customer_name` otherwise, else **`Customer`**). Do **not** pass `navItems`, ALB origin, URL maps, or role tables.
- Logout is built in. Keep IdP bootstrap / `urlAuthBootstrap` / `redirectToIdpLogin` as today.
- Drawer links are ALB `href`s (`buildJourneyUrl`), not Vue Router `to`. Remove duplicate local nav.

## Remove list pages; keep detail/edit

- **Remove** org/member/resource-style CardGrid list dashboards and their routes, Cypress, and local nav (members list is `/discovery/members/`).
- **Keep** **CustomerEditPage** at `/customer/` (`JOURNEY_APP_PATHS.customerEdit`) and **profile** at `/customer/profile/` (`JOURNEY_APP_PATHS.profile`).

## Cypress

Use spa_utils ids: `nav-drawer-toggle`, `page-frame-title`, `nav-profile-link`, `nav-customer-link`, `nav-customer-members-link`, `nav-logout-link`. Drop SPA-local drawer selectors. Remove or rewrite specs for deleted list-card routes.

## Notes

- Discovery is the only list-card interface. Do not reintroduce local hamburger config.
- See spa_utils README **Universal PageFrame (1.0.0)**.
