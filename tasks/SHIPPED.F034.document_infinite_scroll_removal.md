# F034 – Document removal of infinite-scroll list APIs

**Status**: Shipped  
**Type**: Feature  
**Depends On**: F033  
**Description**: Update spa_utils consumer docs so infinite-scroll helpers are documented as **removed**, not deprecated, and list pages are directed to `CardGrid` / `MhCard` with offset/size header pagination.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Sibling repos must all be sibling folders under a common parent.

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `README.md`, `CONTRIBUTING.md`, `src/composables/index.ts`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md`
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `tasks/SHIPPED.F033.remove_infinite_scroll_composable.md` (filename may still be `PENDING.*` until F033 is marked shipped) — code and tests already gone
- `src/composables/index.ts` — confirm infinite-scroll exports are absent
- `README.md` — especially:
  - **Preferred UI: Cards + type-aligned field editors** (currently tells readers to prefer cards over infinite-scroll patterns)
  - **Deprecated: infinite-scroll list APIs** (table of still-exported helpers)
  - **useInfiniteScroll (deprecated)** under **Composables**
  - **useResourceList**
- `CONTRIBUTING.md` — only if it mentions infinite scroll (today it does not)

Do **not** bump the package version (F040 major **1.0.0**). Do **not** restore deleted source or tests.

## Goals

- Remove the README heading **Deprecated: infinite-scroll list APIs** and its table of live exports. Replace with a short **Removed** note that:
  - names the dropped public API: `useInfiniteScroll`, `InfiniteScrollResponse`, `InfiniteScrollParams`, `UseInfiniteScrollOptions`
  - states that cursor fields `after_id`, `limit`, `has_more`, and `next_cursor` must not appear in SPA ↔ API contracts
  - points replacements: list UIs use **`CardGrid` + `MhCard`** (or tables) driven by **offset/size request headers** and a **plain JSON array body**; `useResourceList` remains only for simple non-cursor lists
  - does **not** hard-code the next semver (F040 will add **Removed in 1.0.0** when the version is known)
- Delete the README **useInfiniteScroll (deprecated)** composable subsection (source/test links will be dead after F033).
- Reword the Preferred UI sentence so it no longer treats infinite-scroll list patterns as a current alternative (cards + typed editors remain the guidance; drop “or infinite-scroll list patterns”).
- Keep **useResourceList** documented; optionally add one sentence that it is not a cursor/infinite-scroll helper and is not a substitute for offset/size card dashboards.
- Search `README.md` and `CONTRIBUTING.md` for `useInfiniteScroll`, `InfiniteScroll`, `after_id`, `has_more`, and `next_cursor`. Remaining mentions must only appear in the **Removed** migration note (or not at all).
- Do **not** edit `src/`, `tests/`, `cypress/`, `package.json`, or `package-lock.json`.

## Testing Expectations

Run all commands from **this spa_utils repository root**.

- Manual review: README no longer advertises infinite-scroll helpers as available; replacement guidance matches F033 package surface.
- Confirm `src/composables/useInfiniteScroll.ts` is still absent (F033).
- `npm run test` — no regressions from incidental edits (should be docs-only).
- `npm run build` — still succeeds; dist still omits the four removed names.

## Outputs

- `README.md`

`CONTRIBUTING.md` only if a mention of infinite scroll is found at execution time.

The agent must not update files outside this list.

## Execution Notes

### Plan

1. Reword **Preferred UI** sentence: drop “or infinite-scroll list patterns”; keep cards + typed editors guidance.
2. Replace **Deprecated: infinite-scroll list APIs** (table + dead source links) with a short **Removed** note naming the four dropped exports, forbidding cursor contract fields, and pointing to `CardGrid` + `MhCard` / tables with offset/size headers + plain array body; mention `useResourceList` for simple non-cursor lists only (no semver).
3. Delete **useInfiniteScroll (deprecated)** composable subsection under **Composables**.
4. Keep **useResourceList**; add one sentence that it is not a cursor/infinite-scroll helper or offset/size dashboard substitute.
5. Grep `README.md` / `CONTRIBUTING.md` — remaining infinite-scroll identifiers only in the Removed note.
6. Run `npm run test`, `npm run build`; confirm dist omits the four removed names and `useInfiniteScroll.ts` stays absent.

### Results

**Summary:** Updated `README.md` only — replaced deprecated infinite-scroll docs with a **Removed** migration note, deleted the `useInfiniteScroll` composable subsection, reworded Preferred UI guidance, and clarified `useResourceList` is not a cursor/infinite-scroll helper. `CONTRIBUTING.md` unchanged (no infinite-scroll mentions). Confirmed `src/composables/useInfiniteScroll.ts` remains absent (F033).

**Commands run:**
- `npm run test` — pass (36 files, 375 tests)
- `npm run build` — pass
- `rg 'useInfiniteScroll|InfiniteScrollResponse|InfiniteScrollParams|UseInfiniteScrollOptions' dist/` — no matches
- `rg 'useInfiniteScroll|InfiniteScroll|after_id|has_more|next_cursor' README.md CONTRIBUTING.md` — matches only in README **Removed** note (line 185); `useResourceList` prose mentions “infinite-scroll” descriptively without those identifiers

**Blockers:** None.

**Orchestrator confirmation:** Re-ran `npm run test` (36 files, 375 tests) and `npm run build`. README Remaining mentions of dropped identifiers are only in the **Removed** note. `useInfiniteScroll.ts` still absent.
