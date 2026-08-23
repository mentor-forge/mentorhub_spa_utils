Please create @_PLANNING.MD tasks to implement this issue. Only create tasks, do not edit any files outside of the @tasks folder.

**GitHub**: https://github.com/mentor-forge/mentorhub_admin_spa/issues/4

# F-AS02: Pin spa_utils 1.0.0, adopt PageFrame, remove list-card pages (Admin SPA)

This is the **first** `mentorhub_admin_spa` issue for the spa_utils **1.0.0** wave. It **owns this repo’s `@mentor-forge/mentorhub_spa_utils@1.0.0` pin bump**.

## Summary

Adopt imported `PageFrame` for shared app-bar / hamburger / logout chrome, and **remove** local CardGrid catalog list pages that duplicate Discovery. Users find products and similar collections on Discovery; Admin keeps **Settings** at `/admin/settings` and other detail/edit/create pages that Discovery cards and universal nav target.

## Prerequisite

- `mentorhub_spa_utils` F033–F040 shipped (PR https://github.com/mentor-forge/mentorhub_spa_utils/pull/29) and **`@mentor-forge/mentorhub_spa_utils@1.0.0` published** to CodeArtifact.
- Vue `base` + SPA nginx prefix `/admin/` planned or shipped: https://github.com/mentor-forge/mentorhub_admin_spa/issues/3 (welcome nginx L022 on **:8080**).

## Pin (this issue owns the bump)

- Set `@mentor-forge/mentorhub_spa_utils` to **`1.0.0`** in `package.json` / `package-lock.json`.
- `mh` then `npm install --include=dev`. **1.0.0** does not export `useInfiniteScroll`.

## PageFrame (compiled-in chrome)

- Import `{ PageFrame }` from the package root. Host keeps a single `v-app`; wrap `router-view` in `<PageFrame page-title="...">`. PageFrame already wraps `v-main`.
- Allowed props: **`pageTitle`** (optional display-only `customerName` unused unless needed). Do **not** pass `navItems`, ALB origin, URL maps, or role tables.
- Logout is built in. Keep IdP bootstrap / `urlAuthBootstrap` / `redirectToIdpLogin` as today.
- Drawer **Products** and **Settings** hrefs come from spa_utils (`/discovery/products`, `/admin/settings`). Remove duplicate local nav.

## Remove list pages; keep Settings

- **Remove** list-card catalog pages (e.g. Products CardGrid) and their routes, Cypress, and local nav that duplicate Discovery.
- **Keep** **Settings** at `/admin/settings` (`JOURNEY_APP_PATHS.settings`) and any detail/edit/create admin pages not hosted as Discovery lists.

## Cypress

Use spa_utils ids: `nav-drawer-toggle`, `page-frame-title`, `nav-profile-link`, `nav-products-link`, `nav-settings-link`, `nav-logout-link`. Drop SPA-local drawer selectors. Remove or rewrite specs for deleted list-card routes.

## Notes

- Products list lives on Discovery (`/discovery/products`). Do not reintroduce local hamburger config.
- See spa_utils README **Universal PageFrame (1.0.0)**.
