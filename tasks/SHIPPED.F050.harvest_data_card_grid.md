# F050 – Harvest DataCardGrid

**Status**: Shipped  
**Type**: Feature  
**Depends On**: none  
**Description**: Add a shared `DataCardGrid` layout for multi-card view/edit pages. Downstream SPAs adopt it by importing the new export after the **1.0.6** patch (F056). This does not remove `CardGrid` (F054).

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `README.md`, `src/components/...`, `tests/components/...`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md` — component, testing, and automation-ID standards
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `README.md`
- `src/components/index.ts`
- `src/components/DataCard.vue`
- `src/components/CardGrid.vue` — existing list grid; do not modify it in this task
- `tests/components/CardGrid.test.ts` — source-contract test style to follow
- GitHub: [issue #41](https://github.com/mentor-forge/mentorhub_spa_utils/issues/41)

Do **not** read, edit, or depend on implementation files in journey SPA repositories. The validated layout contract is recorded below.

### Locked API decision

Add `DataCardGrid` as a new package-root and `./components` export. Do not fold this behavior into `CardGrid`, `MhCard`, or `DataCard`.

`DataCardGrid` is a slot wrapper, not a VNode flattener:

- Root element is a `div` with class `data-card-grid` and hardcoded `data-automation-id="data-card-grid"`.
- No props. Do not add `automationId`, breakpoint props, or an `mh-` class prefix.
- Default slot renders children as authored. Do not flatten Fragments or re-parent VNodes.
- Scoped CSS Grid, domain-independent (no journey, path, plan, or mentor naming):
  - `display: grid`
  - `width: 100%`
  - `gap: 16px`
  - `align-items: stretch`
  - `grid-template-columns: minmax(0, 1fr)` below 641px (one column)
  - `repeat(2, minmax(0, 1fr))` from `min-width: 641px` (two columns)
  - `repeat(4, minmax(0, 1fr))` from `min-width: 1920px` (four columns)
  - No three-column step and no rule that permits five or more columns
- Document that 1 → 2 → 4 contract in a source comment.
- Do not add `:deep` stretch rules. Equal-height card chrome stays owned by `CardGrid` until F054 removes it; `DataCardGrid` only provides the grid tracks.

## Goals

- `DataCardGrid` renders the default slot inside `.data-card-grid` with `data-automation-id="data-card-grid"`.
- Empty slot still renders the root.
- Column contract matches the locked breakpoints above.
- Export `DataCardGrid` from `src/components/index.ts` so package root and `./components` both expose it (`src/index.ts` already re-exports `./components`).

### Craftsmanship Expectations

- Keep list-dashboard layout in `CardGrid` for this task. `DataCardGrid` owns multi-card edit/view layout only.
- Do not copy journey-specific titles, routes, or sample entities into the shared component.
- Do not introduce a second grid API (no `ResponsiveDataCardGrid`, no opt-in mode).

## Testing Expectations

Run all commands from this repository root.

- Add `tests/components/DataCardGrid.test.ts` covering:
  - root class and `data-automation-id="data-card-grid"`
  - slotted children rendered inside the root, in order, with their own automation ids intact
  - an empty grid
  - SFC source contract for the 1 / 2 / 4 column rules, 16px gap, stretch, and the absence of a 3-column or 5+ column rule
  - domain independence (source does not name a journey, Paths, Plans, or Mentor)
- `npm run test -- tests/components/DataCardGrid.test.ts`
- `npm run test`
- `npm run test:coverage` (record any known unrelated repository-wide threshold failure separately)
- `npm run lint`
- `npm run build`
- Inspect generated declarations and confirm `DataCardGrid` is exported from package root and `./components`, and that `CardGrid` is still exported.

## Outputs

- `src/components/DataCardGrid.vue`
- `src/components/index.ts`
- `tests/components/DataCardGrid.test.ts`

The agent must not edit `CardGrid.vue`, `MarkdownEditor.vue`, demo/Cypress files, README, package version, publishing workflows, or any journey SPA in this task.

## Execution Notes

### Plan
1. Add `src/components/DataCardGrid.vue` as a no-props SFC slot wrapper: root `div.data-card-grid` with hardcoded `data-automation-id="data-card-grid"`, default slot as authored, scoped CSS 1→2→4 columns (641px / 1920px), gap 16px, stretch; no `:deep`, no Fragment flattening.
2. Export `DataCardGrid` from `src/components/index.ts` next to `CardGrid`.
3. Add `tests/components/DataCardGrid.test.ts` mirroring CardGrid source-contract style for root attrs, slot order/automation ids, empty root, CSS contract, and domain independence.
4. Run Testing Expectations from repo root; record Results (continue past known eslint-missing / unrelated coverage-threshold failures).

### Results
- Implemented Outputs only: `DataCardGrid.vue`, `index.ts` export, `DataCardGrid.test.ts`.
- `npm run test -- tests/components/DataCardGrid.test.ts` — **PASS** (6/6)
- `npm run test` — **PASS** (42 files, 449/449)
- `npm run test:coverage` — tests **PASS** (449/449); exit 1 only on known unrelated `src/utils/**` thresholds (lines/funcs/stmts/branches < 100%). `DataCardGrid.vue` coverage 100%.
- `npm run lint` — **SKIP/known**: `eslint: command not found` (exit 127)
- `npm run build` — **PASS**
- Dist declarations: `dist/components/index.d.ts` exports both `CardGrid` and `DataCardGrid`; package root `dist/index.d.ts` re-exports `./components` so both are available at package root.
- Status left **Pending** for orchestrator confirmation.

**Orchestrator confirmation:** Re-ran `npm run test -- tests/components/DataCardGrid.test.ts` — 6/6 passed. `DataCardGrid` export remains beside `CardGrid` in `src/components/index.ts`. Component matches the 1 / 2 / 4 column slot-wrapper contract.
