# F035 – Journey URLs through welcome nginx / ALB

**Status**: Pending  
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

Reserved for the task execution agent.
