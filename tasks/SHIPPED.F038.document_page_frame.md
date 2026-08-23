# F038 – Document PageFrame and ALB cross-repo links

**Status**: Shipped  
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

### Plan

1. Add README section **Universal PageFrame** after Authentication integration: import/wrap pattern (`v-app` + `PageFrame` + slot), allowed props only, disallowed local nav config, role table + profile href, L022/F035 origin rules, `buildJourneyUrl` / `resolveAlbOrigin` for Discovery card deep links, logout built-in, Discovery-only list-card note.
2. Review CONTRIBUTING (F037 baseline): ensure project structure lists `PageFrame`, `universalNav`, `journeyUrls`; Demo App wording matches hamburger = product catalog vs DemoPage in-package links.
3. Manual review against `PageFrame.vue`, `journeyUrls.ts`, `universalNav.ts`, demo `App.vue`.
4. Run `npm run test` and `npm run build`; record results here.

### Results

- **README.md** — added **Universal PageFrame** section (import/wrap pattern, allowed props, disallowed local nav, role table, profile → `/customer/profile/`, L022/F035 origin rules, `buildJourneyUrl` / `resolveAlbOrigin` / `JOURNEY_APP_PATHS` for Discovery card deep links, logout built-in, Discovery-only list-card note). Updated Usage and Demo App blurbs to reference PageFrame instead of generic navigation drawer.
- **CONTRIBUTING.md** — F037 already documented Demo App hamburger vs DemoPage links; added `PageFrame`, `universalNav`, and `journeyUrls` to project structure comments.
- **Manual review:** docs match exported APIs (`pageTitle`, optional `customerName`, default slot; no nav/ALB props), F035 origin rules (`8080`/`80`/`443`/empty → current origin; debug ports → `:8080`), and F036 role catalog.
- **`npm run test`:** 39 files, **418 tests passed**.
- **`npm run build`:** succeeded.
- **Blockers:** none. Working tree left uncommitted.

**Orchestrator confirmation:** Re-ran `npm run test` and `npm run build`. README Universal PageFrame matches F035 origin rules and F036 catalog; install example still `0.5.7` (no 1.0.0 pin).
