# F016 – Reusable Card and responsive card-grid layout

**Status**: Shipped  
**Type**: Feature  
**Depends On**: F015  
**Description**: Implement reusable `MhCard` and `CardGrid` layout components that drive adaptive list and form containers: solid-color title bar with identifier, action-icon slot, white body, border/radius/shadow, collapse toggle for form cards, and a responsive multi-column card grid.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Sibling repos must all be sibling folders under a common parent.

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `README.md`, `src/components/...`, `demo/...`, `tests/...`, `cypress/...`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md` — Component Patterns, Automation IDs, Testing Standards
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `tasks/SHIPPED.F015.peer_review_card_editor_approach.md` — peer-review decisions (locked)
- `README.md`
- `src/components/index.ts`
- `src/components/admin/TokenClaimsCard.vue` — existing card usage reference only
- `demo/pages/DemoPage.vue`
- `demo/router.ts`

## Goals

Ship these components under `src/components/` (cards stay at the components root; typed editors go under `editors/` in later tasks).

### `MhCard`

- Thin border, slightly rounded corners, elevation/shadow; white body background.
- Title bar with solid-color background (`color` prop, default Vuetify primary).
- Title text plus optional name/identifier shown in the title bar via `name` prop (static string) or, when composed by `DataCard` later, via `nameField` binding — F016 may accept a simple `name?: string` display prop.
- Right-justified `#actions` slot for action icons (Material Design Icons / `v-btn` icon buttons).
- Default `#default` slot for the body.
- **Collapse (F015 decision):**
  - Uncontrolled local collapse by default (`collapsed` internal ref, default `false` = expanded).
  - Optional `v-model:collapsed` for parent control.
  - **No persistence** (no localStorage / sessionStorage).
  - Optional show/hide toggle icon on the title bar; when body is visible, content grows to available width.
- Cards expand to fill available horizontal space in their grid cell/container.
- Prop `automationId` → attribute `data-automation-id` on the card root; also expose stable automation ids for title, collapse toggle, and actions region per spa_standards (`-button`, `-display` suffixes as appropriate).

### `CardGrid`

- Adaptive grid for list-style card interfaces using Vuetify `v-row` / `v-col`.
- **Default breakpoints (F015 locked):** `cols="12" sm="6" md="4" lg="3"` — document these as defaults and expose override props (`cols`, `sm`, `md`, `lg`, `xl`) so consumers can tune layout.
- Default slot projects cards; cards should stretch evenly within columns.
- Suitable as the layout primitive for both list dashboards and multi-card edit pages.
- Prop `automationId` → `data-automation-id` on the grid root.

### Package surface

- Export `MhCard` and `CardGrid` from `src/components/index.ts` (and package `./components` entry as already configured).
- Use only standard Vuetify / Material Design controls, icons, and styles — no custom CSS design system beyond thin card chrome that Vuetify does not cover.

## Testing Expectations

Run all commands from **this spa_utils repository root**.

- Add co-located Vitest unit tests for `MhCard` and `CardGrid` (mount/shallow-mount; assert slots, collapse toggle, uncontrolled + `v-model:collapsed`, default grid breakpoints, props, automation ids). Meet spa_standards coverage targets for components.
- `npm install --include=dev` if dependencies change (unlikely).
- `npm run test`
- `npm run build`
- Cypress smoke deferred to F021/F022.

## Outputs

- `src/components/MhCard.vue`
- `src/components/CardGrid.vue`
- `src/components/index.ts` — exports
- `tests/components/MhCard.test.ts`
- `tests/components/CardGrid.test.ts`

The agent must not update files outside this list (documentation in F023; demo pages in F021/F022).

## Execution Notes

### Plan

1. **`src/components/MhCard.vue`** (`<script setup>` + `<template>`, global Vuetify components, no imports — matches existing `AutoSaveField`/`AutoSaveSelect` convention):
   - Props: `title?: string`, `name?: string`, `color?: string` (default `'primary'`), `collapsible?: boolean` (default `false`, opt-in per F015 "form cards show/hide toggle"), `collapsed?: boolean` (optional `v-model:collapsed`, undefined = uncontrolled), `automationId?: string`.
   - Emits: `update:collapsed`.
   - Uncontrolled local `localCollapsed` ref (default `false`); `isCollapsed` computed picks `props.collapsed` when defined (controlled) else `localCollapsed` (uncontrolled) — standard optional-`v-model` pattern. No persistence.
   - Template: `v-card` (outlined, rounded, elevation, white body) with `data-automation-id="automationId"` root; `v-toolbar` title bar with `:color="color"` for the solid-color bar containing title text + optional `name`, a collapse `v-btn`+`v-icon` toggle (only when `collapsible`), and a right-justified actions region wrapping `#actions` slot; `v-card-text` body wrapping default `#default` slot, hidden via `v-show` when collapsed so layout keeps filling width when expanded.
   - Automation ids per spa_standards suffixes: `${automationId}-title-display`, `${automationId}-collapse-button`, `${automationId}-actions-display` (only rendered when `automationId` set).
2. **`src/components/CardGrid.vue`** (render-function component, no `<template>`, so raw slot VNodes can be re-parented into generated `v-col`s without cloning/remount churn):
   - Props: `cols` (default `'12'`), `sm` (default `'6'`), `md` (default `'4'`), `lg` (default `'3'`), `xl?`, `automationId?`.
   - `setup(props, { slots })` returns a render function: flattens `slots.default()` VNodes (unwrapping `Fragment` from `v-for`, dropping `Comment`/whitespace `Text` nodes) then wraps each in an `h('v-col', { cols, sm, md, lg, xl, key }, () => node)` inside `h('v-row', { class: 'mh-card-grid', 'data-automation-id': automationId }, () => cols)`. Uses global string component names (`'v-row'`/`'v-col'`) consistent with the rest of the package (Vuetify installed globally in consuming apps; no direct `vuetify/components` import needed).
3. **`src/components/index.ts`**: add `export { default as MhCard } from './MhCard.vue'` and `export { default as CardGrid } from './CardGrid.vue'`.
4. **Tests**: `tests/components/MhCard.test.ts` and `tests/components/CardGrid.test.ts` using `shallowMount` (existing global Vuetify stubs in `tests/setup.ts`), covering slots (`#default`, `#actions`), uncontrolled collapse toggle, controlled `v-model:collapsed` (prop + emitted event), default title/name rendering, automation ids, and CardGrid default breakpoints/prop overrides/automation id/child count via slot content.
5. Run `npm run test` and `npm run build` from repo root (run `mh` + `npm install --include=dev` first only if install/auth issues appear).
6. Rename task file to `SHIPPED.F016...` and flip `Status:` to `Shipped` once tests/build pass.

### Results

- Implemented `src/components/MhCard.vue`: `<script setup>` Vuetify `v-card` (outlined, `rounded="lg"`, elevation) with a `v-toolbar` title bar (`color` prop, default `primary`) showing `title` + optional `name`, an opt-in (`collapsible` prop, default `false`) collapse `v-btn`/`v-icon` toggle, a right-justified `#actions` slot region, and a `v-card-text` body wrapping the default slot (`v-show`-hidden when collapsed). Collapse is uncontrolled by default (`localCollapsed` ref) with optional `v-model:collapsed` support (`collapsed` prop + `update:collapsed` emit) — no persistence. `automationId` → `data-automation-id` on the card root plus derived `-title-display` / `-collapse-button` / `-actions-display` ids, only rendered when `automationId` is set.
  - **Gap found & fixed during testing:** Vue's implicit boolean-prop cast defaults an absent `collapsed` (typed `boolean` in the TS props interface) to `false` rather than `undefined`, which would have broken the uncontrolled/controlled distinction. Fixed via an explicit `collapsed: undefined` default in `withDefaults(...)`, which gives the prop an explicit (`hasDefault`) `undefined` default and suppresses Vue's cast-to-`false` fallback. Covered by a dedicated unit test.
- Implemented `src/components/CardGrid.vue`: no `<template>` block — a `defineComponent` render function that reads `slots.default()`, flattens `v-for`-produced `Fragment` nodes and drops `Comment`/`Text`/nullish nodes, then wraps each remaining card VNode in a generated `v-col` (`cols`/`sm`/`md`/`lg`/`xl`, defaults `12`/`6`/`4`/`3`/unset per F015) inside one `v-row` (`data-automation-id`). Uses plain string component names (`'v-row'`/`'v-col'`) since Vuetify is installed globally by consuming apps, matching the rest of the package's convention of not importing `vuetify/components` directly.
  - **Gap found & fixed during testing:** initially passed a slots-object (`{ default: () => [...] }`) as `h()`'s children argument; that form is only meaningful for component VNodes, and both `v-row`/`v-col` resolve to plain elements in the unit-test environment (no Vuetify plugin installed), so nothing rendered. Fixed by passing a plain VNode array as children, which Vue normalizes correctly for both plain elements and components.
- `src/components/index.ts`: added `MhCard` and `CardGrid` exports (also flow through `src/index.ts`'s `export * from './components'` and the package's `./components` entry).
- Tests: `tests/components/MhCard.test.ts` (10 tests — slots, name display, color default/override, uncontrolled + controlled collapse toggle incl. the boolean-cast regression, automation ids present/absent, exposed `isCollapsed`/`toggleCollapsed`) and `tests/components/CardGrid.test.ts` (7 tests — default breakpoints, breakpoint overrides, grid automation id, per-card `v-col` wrapping/content, `v-for`/`Fragment` flattening, comment/null skipping, empty-slot row).
- `npm run test`: **126/126 passed** (14 test files; no regressions in existing suites). `MhCard.vue` and `CardGrid.vue` each show **100% line/statement/function coverage** individually (`CardGrid.vue` 88.23% branch, above the 80% component target); the whole-package `npm run test:coverage` script still fails on pre-existing, out-of-scope gaps (`AdminPage.vue`, `components/admin/*`, `utils/admin.ts`, `utils/urlAuthBootstrap.ts`) unrelated to this task.
- `npm run build`: **succeeded** (Vite bundle + `tsc --emitDeclarationOnly`); confirmed `dist/components/index.d.ts` exports `MhCard` and `CardGrid`.
- No `mh` / `npm install --include=dev` was needed — no dependency changes, and the CodeArtifact-backed `node_modules` were already present/authenticated in this workspace.
- No files outside the task's **Outputs** list were modified; demo pages, docs, and `tests/setup.ts` were left untouched.
- No commit/push performed (orchestrator owns change control).
- No blockers.
