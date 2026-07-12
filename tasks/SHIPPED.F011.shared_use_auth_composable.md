# F011 – Shared useAuth composable with storage hydration

**Status**: Shipped  
**Type**: Feature  
**Depends On**: F010  
**Description**: Publish a shared `useAuth` composable (with `syncAuthFromStorage`) so journey SPAs can drop duplicated local auth state and post-bootstrap hydration workarounds.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Sibling repos must all be sibling folders under a common parent.

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `README.md`, `src/composables/`, `tests/composables/`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md` — Authentication Pattern (localStorage keys, `bootstrapAuthFromUrl`, `useAuth`)
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `README.md`
- `src/utils/urlAuthBootstrap.ts` — localStorage key names (`access_token`, `token_expires_at`, `user_roles`)
- `src/composables/useRoles.ts` — `AuthProvider` interface
- `src/composables/index.ts`
- `demo/composables/useAuth.ts` — current demo-only implementation to align with

**Reference pattern (external, do not read sibling SPA repos during execution):** Journey SPAs call `bootstrapAuthFromUrl()` then `syncAuthFromStorage()` from `initAuth.ts` before the router mounts, and re-call `syncAuthFromStorage()` after clearing tokens on `401`. Local `useAuth` copies expose `syncAuthFromStorage`, `getStoredRoles`, and `hasStoredRole` for router guards. This task centralizes that composable in spa_utils.

## Goals

- New `src/composables/useAuth.ts` exported from `src/composables/index.ts` (and main package entry).
- `useAuth()` returns reactive `isAuthenticated`, `roles`, and `logout()` using the same localStorage keys as `urlAuthBootstrap.ts`.
- `syncAuthFromStorage()` re-reads localStorage into reactive refs; invoked once on module load and callable after `bootstrapAuthFromUrl()` or token clears.
- `getStoredRoles()` and `hasStoredRole(role)` helpers support router guards without reading localStorage directly.
- `logout()` clears reactive state and localStorage keys.
- `useAuth` roles ref satisfies the existing `AuthProvider` interface used by `useRoles`.
- Unit tests in `tests/composables/useAuth.test.ts` cover authentication state, hydration, logout, and role helpers (mirror coverage expectations from journey SPA auth tests).
- `README.md` documents the shared composable and the recommended `initAuth` sequence: `bootstrapAuthFromUrl()` then `syncAuthFromStorage()`.

## Testing Expectations

Run all commands from **this spa_utils repository root**.

- `npm install --include=dev` — refresh dependencies if needed
- `npm run test` — Vitest; new `tests/composables/useAuth.test.ts` must pass; existing composable tests must remain green
- `npm run lint` — ESLint on `src/`
- `npm run build` — compile library; confirm `useAuth` and `syncAuthFromStorage` appear in `dist/composables/index.d.ts`

Coverage thresholds for `src/composables/**` must remain satisfied.

## Outputs

- `src/composables/useAuth.ts` — shared auth composable
- `src/composables/index.ts` — export `useAuth`, `syncAuthFromStorage`, `getStoredRoles`, `hasStoredRole`
- `tests/composables/useAuth.test.ts` — unit tests
- `README.md` — composables section for `useAuth`

The agent must not update files outside this list.

## Execution Notes

- Added `src/composables/useAuth.ts` with module-load hydration, `syncAuthFromStorage`, role helpers.
- Exported from `src/composables/index.ts`; confirmed in `dist/composables/index.d.ts`.
- Tests: `npm run test` — 109 passed (10 new). `npm run build` — success.
