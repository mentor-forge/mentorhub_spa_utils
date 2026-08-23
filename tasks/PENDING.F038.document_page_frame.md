# F038 – Document PageFrame and ALB cross-repo links

**Status**: Pending  
**Type**: Feature  
**Depends On**: F037  
**Description**: Document `PageFrame`, the baked-in nav catalog, ALB/welcome URL rules, and the rule that journey SPAs must not supply local nav configuration.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Sibling repos must all be sibling folders under a common parent.

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `README.md`, `CONTRIBUTING.md`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md`
- `../mentorhub/DeveloperEdition/standards/sre_standards.md` — welcome nginx local path router
- `../mentorhub/tasks/SHIPPED.L022.welcome_nginx_journey_proxy.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `README.md`
- `CONTRIBUTING.md`
- `src/components/PageFrame.vue`
- `src/utils/journeyUrls.ts`
- Demo `App.vue` after F037

Do **not** bump the package version (F040). Do **not** edit sibling SPA repos.

## Goals

- README section **Universal PageFrame**:
  - Import `{ PageFrame }` and wrap `router-view` inside host `v-app`; only `pageTitle` + default slot.
  - **Local nav config is disallowed** — no `navItems`, URL maps, or ALB origin props. New links belong in spa_utils.
  - Role table (Home, Customer, Members, Resources, Paths, Plans, Products, Notifications, Settings) and profile-pic → `/customer/profile/`.
  - Cross-repo hrefs use L022 prefixes on welcome **:8080** (local) or the page origin when already on 8080/80/443 (cloud ALB). Direct SPA debug ports are not used.
  - `buildJourneyUrl` / `resolveAlbOrigin` for Discovery **card** deep links (same helper as the hamburger).
  - Logout is built in.
- Update CONTRIBUTING project structure / Demo App: hamburger is product nav; demo editors/dashboard links live on DemoPage.
- Mention Discovery as the **only** list-card surface; other journey SPAs keep detail/edit pages (downstream ISSUEs in F039).
- Do **not** pin **1.0.0** in install examples yet (F040).

## Testing Expectations

Run all commands from **this spa_utils repository root**.

- Manual review: docs match exported APIs and F035 origin rules.
- `npm run test`
- `npm run build`

## Outputs

- `README.md`
- `CONTRIBUTING.md`

The agent must not update files outside this list.

## Execution Notes

Reserved for the task execution agent.
