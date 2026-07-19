# F029 – Harvest responsive equal-height CardGrid

**Status**: Pending  
**Type**: Feature  
**Depends On**: none  
**Description**: Replace the shared Vuetify row/column `CardGrid` layout with the validated domain-independent CSS Grid behavior: equal-width tracks, equal-height expanded cards, responsive growth from one through eight columns, stable slot identity, and collapsed-card intrinsic height.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `README.md`, `src/components/...`, `tests/components/...`, `tasks/...`

Do not read, edit, or depend on implementation files in journey SPA repositories. The complete validated layout contract needed for this task is recorded below.

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md` — component, testing, and automation-ID standards
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `tasks/SHIPPED.F016.card_and_card_grid_layout.md` — current public API and slot-flattening rationale
- `README.md`
- `src/components/CardGrid.vue`
- `src/components/MhCard.vue`
- `src/components/index.ts`
- `src/index.ts`
- `tests/components/CardGrid.test.ts`
- `tests/components/MhCard.test.ts`

### Locked API decision

Evolve the existing `CardGrid`; do not add a parallel `ResponsiveCardGrid` export or an opt-in mode. The responsive CSS Grid and equal-height expanded-card behavior become the default.

This replaces the prior `CardGrid` defaults (intended early-dev behavior; release is a patch, not a major):

- Remove the obsolete Vuetify `cols`, `sm`, `md`, `lg`, and `xl` props rather than accepting props that no longer control the fixed layout.
- Replace `VRow`/`VCol` rendering with domain-independent HTML grid/grid-item wrappers.
- Keep the existing `CardGrid` package-root and `./components` export name.
- Keep `automationId` and the existing `.mh-card-grid` root class stable.

Do not modify global `MhCard` styles. Expanded-card stretch overrides belong only inside `CardGrid`; non-grid `MhCard` instances retain intrinsic height.

## Goals

- Render one `.mh-card-grid__item` per meaningful default-slot VNode inside the `.mh-card-grid` root.
- Recursively flatten `Fragment`/`v-for` slot content, skip null, comment, and whitespace/text nodes, and preserve each card VNode key with fallback to its flattened index.
- Apply `automationId` as `data-automation-id` on the grid root.
- Implement CSS Grid with `width: 100%`, a 16px gap, stretched grid items, and equal-width `minmax(0, 1fr)` tracks.
- Fix the responsive column contract and document it in source comments:
  - 1 column from 0
  - 2 columns from 600px
  - 3 columns from 960px
  - 4 columns from 1280px
  - 5 columns from 1600px
  - 6 columns from 1920px
  - 7 columns from 2240px
  - 8 columns from 2560px, with no rule that permits more than eight
- Scope `:deep` rules beneath `.mh-card-grid__item` so `.mh-card:not(.mh-card--collapsed)` uses `align-self: stretch`, `height: 100%`, and `flex: 1 1 auto`.
- Scope the explicit collapsed contract beneath the grid: `.mh-card--collapsed` uses `align-self: flex-start`, `height: auto`, `flex: 0 0 auto`, and `min-height: 0`.
- Preserve the existing `CardGrid` exports through `src/components/index.ts`, `src/index.ts`, package root, and `./components`; no export-file edit is expected because those exports already exist.
- Keep all journey-specific content, routes, API behavior, statuses, and automation IDs out of the shared component.

## Testing Expectations

Run all commands from this repository root.

- Update `tests/components/CardGrid.test.ts` to cover:
  - one generic grid-item wrapper per card and preserved content;
  - nested Fragment flattening;
  - null/comment/text-node skipping;
  - VNode key preservation and fallback index keys;
  - an empty grid;
  - `automationId` on the root;
  - removal of the legacy breakpoint-prop contract;
  - CSS source/rendered contracts for equal-width tracks, stretch, every 1→8 breakpoint, and no 9+ column rule;
  - expanded `MhCard` stretch versus collapsed `MhCard` intrinsic height;
  - domain independence (no Paths/journey naming).
- Confirm existing `MhCard` tests still prove intrinsic height outside `CardGrid`.
- `npm run test -- tests/components/CardGrid.test.ts`
- `npm run test`
- `npm run test:coverage` (record any known unrelated repository-wide threshold failure separately)
- `npm run lint`
- `npm run build`
- Inspect generated declarations/build output to confirm `CardGrid` remains available from package root and `./components`.

## Outputs

- `src/components/CardGrid.vue`
- `tests/components/CardGrid.test.ts`

The agent must not edit `MhCard.vue`, exports, README, demo/Cypress files, package versions, publishing workflows, or any journey SPA in this task.

## Execution Notes

