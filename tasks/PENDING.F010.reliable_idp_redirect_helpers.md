# F010 – Reliable IdP redirect helpers (Developer Edition fallback + location.replace)

**Status**: Pending  
**Type**: Feature  
**Depends On**: none  
**Description**: Harden `redirectToIdpLogin` and related helpers so Developer Edition redirects always reach `http://127.0.0.1:8080/login.html` without per-SPA `loginRedirect.ts` wrappers.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Sibling repos must all be sibling folders under a common parent.

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `README.md`, `src/utils/idpRedirect.ts`, `tests/utils/idpRedirect.test.ts`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md` — Authentication Pattern (`VITE_IDP_LOGIN_URI`, IdP redirect)
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `README.md` — IdP redirect section
- `src/utils/idpRedirect.ts`
- `tests/utils/idpRedirect.test.ts`
- `tests/utils/index.test.ts`

**Reference pattern (external, do not read sibling SPA repos during execution):** Journey SPAs currently ship a local `loginRedirect.ts` that passes an explicit Developer Edition default URI and calls `location.replace`, because `redirectToIdpLogin` no-ops when `VITE_IDP_LOGIN_URI` is unset and uses `location.href`. This task moves that reliability into spa_utils so consumers can call `redirectToIdpLogin` directly.

## Goals

- `idpRedirect.ts` defines a documented Developer Edition fallback login URI: `http://127.0.0.1:8080/login.html`.
- `getIdpLoginBaseUrl()` resolves `VITE_IDP_LOGIN_URI` when set; otherwise returns the Developer Edition fallback (no longer `undefined` when env is unset).
- `buildIdpLoginRedirectUrl()` uses the resolved base URL when no explicit `idpLoginUri` override is passed (no throw solely because env is unset).
- `redirectToIdpLogin()` always navigates when `window` is defined: uses `window.location.replace(...)` instead of `window.location.href`, and never no-ops in Developer Edition because of a missing env var.
- Explicit `idpLoginUri` override parameter behavior is unchanged for production / test injection.
- Unit tests cover fallback resolution, `location.replace` navigation, and override precedence.
- `README.md` IdP redirect section documents that journey SPAs no longer need local `loginRedirect.ts` wrappers for Developer Edition.

## Testing Expectations

Run all commands from **this spa_utils repository root**.

- `npm install --include=dev` — refresh dependencies if needed (CodeArtifact auth; run `mh` first if needed)
- `npm run test` — Vitest; `tests/utils/idpRedirect.test.ts` and `tests/utils/index.test.ts` must pass
- `npm run lint` — ESLint on `src/`
- `npm run build` — compile library (`vite build` + `tsc`)

Manual spot-check (optional): in a Node REPL or unit test, confirm `buildIdpLoginRedirectUrl('http://127.0.0.1:8388/demo')` produces `return_to` query against `:8080/login.html` when env is unset.

## Outputs

- `src/utils/idpRedirect.ts` — fallback URI, `location.replace`, resolved base URL behavior
- `tests/utils/idpRedirect.test.ts` — updated expectations (replace mock, fallback when env unset)
- `README.md` — IdP redirect documentation aligned with new behavior

The agent must not update files outside this list.

## Execution Notes

_Reserved for the task execution agent._
