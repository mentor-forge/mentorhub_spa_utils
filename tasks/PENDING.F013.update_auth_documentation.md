# F013 – Update auth integration documentation

**Status**: Pending  
**Type**: Feature  
**Depends On**: F012  
**Description**: Document the standard journey-SPA auth integration using spa_utils exports so consumers can remove local `loginRedirect.ts` and duplicated `useAuth` modules.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Sibling repos must all be sibling folders under a common parent.

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `README.md`, `CONTRIBUTING.md`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md` — Authentication Pattern
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `README.md`
- `CONTRIBUTING.md`
- `src/composables/useAuth.ts`
- `src/utils/idpRedirect.ts`
- `src/utils/urlAuthBootstrap.ts`
- `demo/router.ts` — reference implementation after F012

**External follow-up (not in scope for this repo):** After this package is published, sibling journey SPAs should delete `src/utils/loginRedirect.ts`, replace local `src/composables/useAuth.ts` with spa_utils imports, and add `syncAuthFromStorage()` to `initAuth.ts`. Record that as prose only — do not create tasks in other repos from this file.

## Goals

- `README.md` includes a cohesive **Authentication integration** section covering:
  - `initAuth.ts` pattern: `bootstrapAuthFromUrl()` then `syncAuthFromStorage()` before router mount
  - Shared `useAuth()` / `hasStoredRole()` for guards and layout
  - `redirectToIdpLogin()` for unauthenticated routes, `401` handling, and logout (with `return_to`)
  - `VITE_IDP_LOGIN_URI` for production builds; Developer Edition fallback when unset
  - Explicit note that local `loginRedirect.ts` wrappers are no longer required
- `CONTRIBUTING.md` demo structure reflects F012 routes (no `PublicAuthHint.vue`) and lists shared composables under `src/composables/useAuth.ts`.
- Documentation examples use correct import paths (`@mentor-forge/mentorhub_spa_utils` and subpath exports as appropriate).

## Testing Expectations

Run all commands from **this spa_utils repository root**.

- `npm run build` — packaging verification
- `npm run test` — ensure no regressions from doc-only adjacent changes
- Manual review: README auth section is accurate against `src/composables/useAuth.ts`, `idpRedirect.ts`, and demo router

## Outputs

- `README.md` — authentication integration documentation
- `CONTRIBUTING.md` — demo structure and composable references

The agent must not update files outside this list.

## Execution Notes

_Reserved for the task execution agent._
