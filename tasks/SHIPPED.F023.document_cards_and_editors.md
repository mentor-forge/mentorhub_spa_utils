# F023 – Document Card, DataCard, and type-aligned editors

**Status**: Shipped  
**Type**: Feature  
**Depends On**: F022  
**Description**: Update spa_utils documentation so consumers can adopt MhCard/CardGrid/DataCard and the configurator-type-aligned editors using the demo as the reference implementation.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Sibling repos must all be sibling folders under a common parent.

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `README.md`, `CONTRIBUTING.md`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md`
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `tasks/SHIPPED.F015.peer_review_card_editor_approach.md` — locked API decisions
- `README.md`
- `CONTRIBUTING.md`
- `src/components/index.ts`
- Demo pages and components shipped in F016–F022

## Goals

- README sections covering:
  - **MhCard / CardGrid** — list adaptive layout, title bar, actions slot, collapse (uncontrolled + `v-model:collapsed`, no persistence), default breakpoints `cols="12" sm="6" md="4" lg="3"`
  - **DataCard** — declarative forms, `model` + `nameField` + `provide`/`inject`, AutoSave callback pattern
  - **Type-aligned editors** — table mapping configurator type → component, with prop contract (`field`, `editable`, `visible`, `automationId`, standalone `modelValue`/`onSave`)
  - **Migration notes** — `AutoSaveField` remains exported as a thin compatibility wrapper (non-breaking); typed editors are preferred; `AutoSaveSelect` unchanged this wave; no generic enum editor yet
  - **Save triggers** — blur for string/count/index/date-time; change for boolean and rating
  - Links to demo routes (`/demo/editors`, `/demo/dashboard`)
- CONTRIBUTING demo structure updated for new pages and `src/components/editors/` folder.
- Document that styling should remain stock Vuetify/Material Design (`density="comfortable"`, `variant="outlined"` defaults) unless a later global theme task changes defaults.

## Testing Expectations

Run all commands from **this spa_utils repository root**.

- Manual review: docs match exported APIs.
- `npm run build`
- `npm run test` — no regressions from incidental edits

## Outputs

- `README.md`
- `CONTRIBUTING.md`

The agent must not bump the version (F024) or create ISSUE files (F025).

## Execution Notes

### Plan
Document MhCard/CardGrid/DataCard, type-aligned editors, AutoSave migration notes, and demo routes; refresh CONTRIBUTING structure.

### Results
- README: new Cards/DataCard and type-editor sections; AutoSaveField marked as compatibility wrapper; validation/demo routes updated.
- CONTRIBUTING: editors folder, EditorsPage, DashboardPage, expanded demo routes.
- `npm run build` / `npm run test` verified by orchestrator.
