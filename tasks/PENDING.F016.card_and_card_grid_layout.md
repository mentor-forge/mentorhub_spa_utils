# F016 – Reusable Card and responsive card-grid layout

**Status**: Pending  
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

(reserved for execution agent)
