# F029 – Honor runtime `IDP_LOGIN_URI` in IdP redirect helpers

Status: Shipped
Type: Defect
Depends On: none
Description: Make `getIdpLoginBaseUrl()` / `redirectToIdpLogin()` read container-injected runtime `IDP_LOGIN_URI` so the same SPA image honors compose / cloud env in every environment. Remove the 0.5.6 loopback-host rewrite workaround where runtime config makes it unnecessary (issue F-W08).

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Sibling repos must all be sibling folders under a common parent.

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `README.md`, `src/utils/idpRedirect.ts`, `tests/utils/idpRedirect.test.ts`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md` — Authentication Pattern
- `../mentorhub/DeveloperEdition/standards/sre_standards.md` — `IDP_LOGIN_URI` container env
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `README.md` — IdP redirect section
- `src/utils/idpRedirect.ts`
- `tests/utils/idpRedirect.test.ts`
- `tasks/SHIPPED.F010.reliable_idp_redirect_helpers.md`

**Background:** S41 exports `IDP_LOGIN_URI` from `~/.mentorhub/HOST_NAME` via `mh`, and compose passes it into SPA containers. spa_utils 0.5.6 only reads build-time `VITE_IDP_LOGIN_URI` and rewrites loopback hosts to `window.location.hostname` — that fails for containers where the built default is still `127.0.0.1`. Journey SPAs will inject runtime config at container startup (mentee_spa L122); this task teaches spa_utils to consume it.

## Goals

- Define a minimal runtime config surface (e.g. `window.__MENTORHUB_RUNTIME__?.IDP_LOGIN_URI` or equivalent documented in README) that SPA containers populate from the `IDP_LOGIN_URI` env var at startup.
- `resolveIdpLoginUri()` resolution order:
  1. Explicit function override (unchanged)
  2. Runtime-injected `IDP_LOGIN_URI` (when present and non-empty)
  3. Build-time `VITE_IDP_LOGIN_URI` (dev server / legacy builds)
  4. `DEVELOPER_EDITION_IDP_LOGIN_URI` fallback
- **Remove** `adaptIdpLoginUriToCurrentHost()` and related loopback rewrite logic added in 0.5.6 — runtime env replaces that complication.
- Production (non-loopback) IdP URLs remain unchanged regardless of SPA hostname.
- Unit tests cover runtime precedence, build-time fallback, Developer Edition fallback, and explicit override.
- `README.md` IdP section documents runtime injection contract for journey SPA maintainers.

## Testing Expectations

Run all commands from **this spa_utils repository root**.

- `npm install --include=dev`
- `npm run test` — update `tests/utils/idpRedirect.test.ts` (remove MagicDNS rewrite cases; add runtime config cases)
- `npm run lint`
- `npm run build`

## Outputs

- `src/utils/idpRedirect.ts` — runtime resolution; remove hostname rewrite
- `tests/utils/idpRedirect.test.ts` — aligned expectations
- `README.md` — runtime `IDP_LOGIN_URI` contract and resolution order

The agent must not update files outside this list.

## Execution Notes

**Plan**
- Read `window.__MENTORHUB_RUNTIME__.IDP_LOGIN_URI` before build-time env; remove 0.5.6 hostname rewrite.
- Export `MENTORHUB_RUNTIME_CONFIG_KEY` and `MentorHubRuntimeConfig` for SPA container wiring (L122).

**Summary of changes**
- `idpRedirect.ts`: added runtime config read via `__MENTORHUB_RUNTIME__`; resolution order override → runtime → Vite → fallback; removed `adaptIdpLoginUriToCurrentHost`.
- `idpRedirect.test.ts`: replaced MagicDNS rewrite cases with runtime injection / precedence tests (14 cases).
- `README.md`: documented resolution order and container injection contract.

**Verification results**
- `npm install --include=dev` → OK
- `npm run test` → 394/394 passed
- `npm run lint` → `eslint` not on PATH in this environment; `src/` reviewed manually
- `npm run build` → OK

**Branch:** `0.5.8-IDP-Login`

**Follow-up tasks**
- mentee_spa L122 — inject `window.__MENTORHUB_RUNTIME__` at container startup
- F030 — bump patch release after S45 manual approval
