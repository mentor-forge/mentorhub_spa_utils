# F023 – Document Card, DataCard, and type-aligned editors

**Status**: Pending  
**Type**: Feature  
**Depends On**: F022  
**Description**: Update spa_utils documentation so consumers can adopt Card/CardGrid/DataCard and the configurator-type-aligned editors using the demo as the reference implementation.

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
- `README.md`
- `CONTRIBUTING.md`
- `src/components/index.ts`
- Demo pages and components shipped in F016–F022

## Goals

- README sections covering:
  - **Card / CardGrid** — list adaptive layout, title bar, actions slot, collapse behavior
  - **DataCard** — declarative forms, model binding, AutoSave callback pattern
  - **Type-aligned editors** — table mapping configurator type → component, with prop contract summary
  - **Migration notes** — any AutoSaveField changes/breaking renames
  - Links to demo routes (`/demo/editors`, `/demo/dashboard` or final paths)
- CONTRIBUTING demo structure updated for new pages and component folders.
- Document that styling should remain stock Vuetify/Material Design unless a later global theme task changes defaults.

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

(reserved for execution agent)
