# F035 – Journey URLs through welcome nginx / ALB

**Status**: Shipped  
**Type**: Feature  
**Depends On**: F034  
**Description**: Add a compiled-in helper that builds cross-SPA URLs using L022 path prefixes on the mock ALB (local welcome **:8080**) or the cloud ALB (same-origin HTTPS), with **no** per-SPA URL configuration.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Sibling repos must all be sibling folders under a common parent.

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `README.md`, `src/utils/...`, `tests/utils/...`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md`
- `../mentorhub/DeveloperEdition/standards/sre_standards.md` — **Developer Edition welcome nginx (local path router)**
- `../mentorhub/tasks/SHIPPED.L022.welcome_nginx_journey_proxy.md` — welcome **:8080** forwards `/{journey}/*` without stripping the prefix (`/discovery/`, `/customer/`, `/admin/`, `/mentor/`, `/mentee/`)
- `../mentorhub/README.md` — same-origin JWT `localStorage` on **8080**; direct SPA ports remain for Cypress/debug only
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `src/utils/idpRedirect.ts` — origin/runtime patterns; **do not** use IdP login host as the ALB origin (production IdP is a different host)
- `src/utils/index.ts`
- `README.md`

**Locked decision (L022 supersedes L017 per-port map):** Cross-repo hrefs are **path prefixes on the ALB / welcome host**, not `http://<host>:8388/` style debug ports. Do not read CloudFormation repos. Do not add `albOrigin`, `baseUrls`, or journey-port props for consumers.

**Origin resolution (compiled in; no local config):**

1. If `window.location.port` is `8080`, `80`, `443`, or empty → `window.location.origin` (local welcome or cloud ALB).
2. Otherwise (Vite `npm run dev`, published debug ports **8386 / 8388 / 8390 / 8392 / 8394 / 8398**, etc.) → `{protocol}//{hostname}:8080` using **the current hostname** (so Tailscale MagicDNS matches welcome, not a hardcoded `127.0.0.1`).
3. Accept an optional `location` argument (or equivalent) **for unit tests only** — not a Vue prop.

**Journey prefixes (exact L022 table):** `discovery`, `customer`, `admin`, `mentor`, `mentee` → `/{journey}/`.

## Goals

- Add `src/utils/journeyUrls.ts` (name may vary; keep it next to `idpRedirect.ts`) exporting:
  - `JOURNEY_PREFIXES` — the five prefixes
  - `resolveAlbOrigin(...)` — rules above
  - `buildJourneyUrl(journey, path)` — `{origin}/{journey}/{path}` with normalized slashes (no `/discovery/discovery`, no missing slash after the prefix)
- Export from `src/utils/index.ts` (package `./utils` and root barrels already re-export utils).
- **Disallow** consumer overrides of origin or prefix map. Tests may inject `location`.
- Do **not** implement the hamburger/PageFrame (F036) or bump the version (F040).

### Locked in-app paths (used by F036; implement as constants here or in a sibling catalog file)

| Link | `buildJourneyUrl` |
|------|-------------------|
| Home (Discover) | `discovery`, `''` or `'/'` → `/discovery/` |
| CustomerEditPage | `customer`, `''` or `'/'` → `/customer/` |
| Members | `discovery`, `'members/'` → `/discovery/members/` |
| Resources | `discovery`, `'resources'` → `/discovery/resources` |
| Paths | `discovery`, `'paths'` → `/discovery/paths` |
| Plans | `discovery`, `'plans'` → `/discovery/plans` |
| Products | `discovery`, `'products'` → `/discovery/products` |
| Notifications | `discovery`, `'notifications'` → `/discovery/notifications` |
| Settings | `admin`, `'settings'` → `/admin/settings` |
| Profile | `customer`, `'profile/'` → `/customer/profile/` |

Trailing slash on journey **roots** and on `members/` / `profile/` as in the table; nested Discovery pages otherwise unslashed.

## Testing Expectations

Run all commands from **this spa_utils repository root**.

- Unit tests in `tests/utils/` covering:
  - port `8080` + path `/mentor/x` → origin is that location’s origin; Home is `{origin}/discovery/`
  - https, empty port, path `/discovery/` → same origin (cloud ALB)
  - port `8386` or `8392` on hostname `dev.example.ts.net` → origin `http://dev.example.ts.net:8080` (or current protocol)
  - slash normalization for empty vs `'/'` vs `'members/'`
  - every locked path in the table
- `npm run test`
- `npm run build`
- Confirm `dist/utils` (and root) declarations export `buildJourneyUrl` / `resolveAlbOrigin`.

## Outputs

- `src/utils/journeyUrls.ts` (or equivalent new util module)
- `src/utils/index.ts` — re-export
- `tests/utils/journeyUrls.test.ts`

The agent must not update files outside this list.

## Execution Notes

### Plan

1. Add `src/utils/journeyUrls.ts` next to `idpRedirect.ts`:
   - `JOURNEY_PREFIXES` — five L022 journey keys.
   - `resolveAlbOrigin(location?)` — ALB/welcome ports (`8080`, `80`, `443`, empty) use `location.origin`; Vite/debug ports map to `{protocol}//{hostname}:8080`. Optional `location` for unit tests only.
   - `buildJourneyUrl(journey, path)` — `{origin}/{journey}/{path}` with leading-slash strip and no duplicate journey segment.
   - `JOURNEY_APP_PATHS` — locked link catalog for F036 (home, members, settings, etc.).
2. Re-export from `src/utils/index.ts`.
3. Add `tests/utils/journeyUrls.test.ts` mirroring `idpRedirect.test.ts` (node env, inject `window.location` / pass `location` to `resolveAlbOrigin`).
4. Run `npm run test` and `npm run build`; verify `dist/utils` and root `.d.ts` export the new symbols.

### Results

- **Created** `src/utils/journeyUrls.ts` — `JOURNEY_PREFIXES`, `JOURNEY_APP_PATHS`, `resolveAlbOrigin(location?)`, `buildJourneyUrl(journey, path)`.
- **Updated** `src/utils/index.ts` — re-export.
- **Created** `tests/utils/journeyUrls.test.ts` — 19 tests (origin rules, slash normalization, all locked paths).
- **`npm run test`**: 37 files, 394 tests passed (including `journeyUrls.test.ts` and existing `index.test.ts`).
- **`npm run build`**: succeeded.
- **Dist exports**: `dist/utils/journeyUrls.d.ts` declares symbols; `dist/utils/index.d.ts` and root `dist/index.d.ts` re-export via barrel; `dist/index.js` bundles `buildJourneyUrl`, `resolveAlbOrigin`, `JOURNEY_PREFIXES`, `JOURNEY_APP_PATHS`.
- **Blockers**: none.

**Orchestrator confirmation:** Re-ran `npm run test` (37 files, 394 tests) and `npm run build`. Dist declarations export `buildJourneyUrl` / `resolveAlbOrigin` via `dist/utils/journeyUrls.d.ts` and root `export * from './utils'`. Origin rules and locked `JOURNEY_APP_PATHS` match the task table.
