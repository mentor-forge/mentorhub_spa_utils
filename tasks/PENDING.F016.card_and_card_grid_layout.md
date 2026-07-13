# F016 – Reusable Card and responsive card-grid layout

**Status**: Pending  
**Type**: Feature  
**Depends On**: F015  
**Description**: Implement reusable Card and layout components that drive adaptive list and form containers: solid-color title bar with identifier, action-icon slot, white body, border/radius/shadow, collapse toggle for form cards, and a responsive multi-column card grid.

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
- `tasks/PENDING.F015.peer_review_card_editor_approach.md` — peer-review decisions
- `README.md`
- `src/components/index.ts`
- `src/components/admin/TokenClaimsCard.vue` — existing card usage reference only
- `demo/pages/DemoPage.vue`
- `demo/router.ts`

## Goals

Ship the following components (names may follow F015 naming decisions; default names below):

### `MhCard` (or equivalent)

- Thin border, slightly rounded corners, elevation/shadow; white body background.
- Title bar with solid-color background (`color` prop, default Vuetify primary or a documented theme color).
- Title text plus optional Name/identifier shown in the title bar.
- Right-justified `#actions` slot for action icons (Material Design Icons / `v-btn` icon buttons).
- Default `#default` slot for the body.
- Optional show/hide (collapse) toggle icon on the title bar for form/input-container usage; body expands/collapses; controls in the body should grow to available width when visible.
- Cards expand to fill available horizontal space in their grid cell/container.
- Stable `data-automation-id` props for the card root, title, collapse toggle, and actions region per spa_standards naming guidance.

### `CardGrid` (or equivalent)

- Adaptive grid for list-style card interfaces.
- Breakpoints: single column on mobile; multiple columns on desktop and wide-screen breakpoints (use standard Vuetify grid: e.g. `cols="12" sm="6" md="4" lg="3"` or values decided in F015).
- Default slot projects cards; cards should stretch evenly within columns.
- Suitable as the layout primitive for both list dashboards and multi-card edit pages.

### Package surface

- Export new components from `src/components/index.ts` (and package `./components` entry as already configured).
- Use only standard Vuetify / Material Design controls, icons, and styles — no custom CSS design system beyond thin card chrome that Vuetify does not cover.

## Testing Expectations

Run all commands from **this spa_utils repository root**.

- Add co-located Vitest unit tests for Card and CardGrid (mount/shallow-mount; assert slots, collapse toggle, props, automation ids). Meet spa_standards coverage targets for components.
- `npm install --include=dev` if dependencies change (unlikely).
- `npm run test`
- `npm run build`
- Manual or Cypress smoke optional here; full demo coverage lands in F021/F022. If a minimal Cypress component/page smoke is cheap, add it; otherwise defer to F021.

## Outputs

- `src/components/MhCard.vue` (or peer-review-approved name)
- `src/components/CardGrid.vue` (or peer-review-approved name)
- `src/components/index.ts` — exports
- `tests/components/MhCard.test.ts` (or matching name)
- `tests/components/CardGrid.test.ts` (or matching name)
- Optional: `cypress/e2e/components/MhCard.cy.ts` / `CardGrid.cy.ts` if not deferred

The agent must not update files outside this list (documentation in F023; demo pages in F021/F022).

## Execution Notes

(reserved for execution agent)
