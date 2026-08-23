# F033 – Remove deprecated useInfiniteScroll composable

**Status**: Pending  
**Type**: Feature  
**Depends On**: none  
**Description**: Delete the deprecated cursor-based infinite-scroll composable and its tests from this package so `useInfiniteScroll`, `InfiniteScrollResponse`, `InfiniteScrollParams`, and `UseInfiniteScrollOptions` are no longer part of the public API.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Sibling repos must all be sibling folders under a common parent.

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `README.md`, `src/composables/...`, `tests/composables/...`, `cypress/e2e/composables/...`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md`
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `README.md` — sections **Preferred UI: Cards + type-aligned field editors**, **Deprecated: infinite-scroll list APIs**, and **useInfiniteScroll (deprecated)**
- `src/composables/useInfiniteScroll.ts` — cursor pagination (`after_id`, `limit`, `has_more`, `next_cursor`) via TanStack `useInfiniteQuery`
- `src/composables/index.ts` — public re-exports of the composable and types
- `src/index.ts` — `export * from './composables'`
- `src/composables/useResourceList.ts` — keep; not part of this removal
- `src/components/ListPageSearch.vue` — keep; independently used by `useResourceList` and the demo
- `tests/composables/useInfiniteScroll.test.ts`
- `cypress/e2e/composables/useInfiniteScroll.cy.ts`
- `cypress/e2e/composables/useResourceList.cy.ts` — keep
- `cypress/e2e/components/ListPageSearch.cy.ts` — keep

The README already marks these exports **deprecated**. APIs and SPAs use header-based offset/size pagination with a plain array body. List UIs should use `CardGrid` + `MhCard` (or tables). `useResourceList` remains for simple non-cursor lists. This task removes the deprecated code; documentation is F034; universal PageFrame/nav is F035–F039; the breaking **major** version bump to **1.0.0** is F040.

Do **not** inspect or edit sibling journey SPA repositories. If a consumer still imports these symbols, that is an **external prerequisite** for upgrading to the next package version — out of scope here.

## Goals

- Delete `src/composables/useInfiniteScroll.ts`.
- Remove from `src/composables/index.ts`:
  - `export { useInfiniteScroll } from './useInfiniteScroll'`
  - `export type { InfiniteScrollResponse, InfiniteScrollParams, UseInfiniteScrollOptions } from './useInfiniteScroll'`
- Delete `tests/composables/useInfiniteScroll.test.ts`.
- Delete `cypress/e2e/composables/useInfiniteScroll.cy.ts`.
- After `npm run build`, package-root and `./composables` declaration files must **not** export `useInfiniteScroll`, `InfiniteScrollResponse`, `InfiniteScrollParams`, or `UseInfiniteScrollOptions`.
- Leave in place: `useResourceList`, `ListPageSearch`, `@tanstack/vue-query`, demo `/demo` ListPageSearch usage, and all other composables.
- Do **not** edit `README.md` (F034) or bump the package version (F040).
- Do **not** add a replacement offset/size list composable in this task.

## Testing Expectations

Run all commands from **this spa_utils repository root**.

- Run `mh` first if CodeArtifact credentials are required.
- `npm install --include=dev` only if install is needed to run tests.
- `npm run test` — all remaining unit tests pass; no `useInfiniteScroll` suite remains.
- `npm run build` — compiles and emits declarations without the removed module.
- Inspect `dist/composables/index.d.ts` and `dist/index.d.ts` and confirm the four removed names are absent.
- Repo-wide search of `src/`, `tests/`, and `cypress/` must find **no** remaining `useInfiniteScroll` / `InfiniteScroll*` identifiers.
- Cypress: remaining specs still discoverable. Prefer `npx cypress run --spec cypress/e2e/composables/useResourceList.cy.ts,cypress/e2e/components/ListPageSearch.cy.ts` against `npm run dev` (requires `cd ../mentorhub_api_utils && pipenv run db && pipenv run dev` if the demo needs the backing API). Record if Cypress cannot run in this environment; unit tests + build + export inspection are the required gate.

## Outputs

- `src/composables/useInfiniteScroll.ts` — **deleted**
- `src/composables/index.ts` — drop infinite-scroll value and type exports
- `tests/composables/useInfiniteScroll.test.ts` — **deleted**
- `cypress/e2e/composables/useInfiniteScroll.cy.ts` — **deleted**

The agent must not update files outside this list.

## Execution Notes

Reserved for the task execution agent.
