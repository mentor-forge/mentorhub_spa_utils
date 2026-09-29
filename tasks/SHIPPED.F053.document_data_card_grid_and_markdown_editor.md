# F053 – Document DataCardGrid and MarkdownEditor

**Status**: Shipped  
**Type**: Feature  
**Depends On**: F052  
**Description**: Document `DataCardGrid` and the rendered `MarkdownEditor` so consumers can adopt them from the README and the editors demo. Leave `CardGrid` documented until F054 removes it.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `README.md`, `CONTRIBUTING.md`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md`
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `tasks/PENDING.F050.harvest_data_card_grid.md` (or `SHIPPED.F050.*`)
- `tasks/PENDING.F051.harvest_markdown_editor.md` (or `SHIPPED.F051.*`)
- `README.md`
- `CONTRIBUTING.md`
- `src/components/DataCardGrid.vue`
- `src/components/editors/MarkdownEditor.vue`
- `src/components/index.ts`
- `demo/pages/EditorsPage.vue`

GitHub: [issue #41](https://github.com/mentor-forge/mentorhub_spa_utils/issues/41)

## Goals

- README describes `DataCardGrid` as the multi-card view/edit layout:
  - class `data-card-grid`, hardcoded `data-automation-id="data-card-grid"`, no props
  - 1 column below 641px, 2 columns from 641px, 4 columns from 1920px, 16px gap
  - default slot, not a Fragment flattener
  - demo: `/demo/editors`
- README `markdown` row no longer says the editor is only a textarea. State that the resting view is sanitized GFM HTML, editable fields click to a textarea (max 4096), read-only fields render markdown without an edit affordance, and the prop contract (`field`, `modelValue`, `onSave`, `editable`, `visible`, `automationId`, `label`, `hint`, `rules`, `rows`) is unchanged.
- Document automation ids: root `automationId`, input `${automationId}-input`, display `${automationId}-display` (no double suffix), value `markdown-field-display`.
- State that `marked` and `dompurify` are bundled; consumers do not add those imports.
- Include a short example that nests `DataCard` + `MarkdownEditor` inside `DataCardGrid`.
- CONTRIBUTING component tree names `DataCardGrid` next to `DataCard`.
- Do not delete or rewrite the `CardGrid` list-dashboard contract in this task. Do not pin **1.0.6** (F056 owns the version pin).

### Craftsmanship Expectations

- Document the shipped API. Do not describe breakpoint props or a VNode-flattening mode that `DataCardGrid` does not have.
- Keep list-dashboard guidance on `CardGrid` until F054.

## Testing Expectations

Run all commands from this repository root.

- Manual review: README matches `DataCardGrid.vue` and `MarkdownEditor.vue`, and `CardGrid` docs are still present.
- `npm run build`
- `npm run test` if a doc sample is copied into a test; otherwise no new test file is required.

## Outputs

- `README.md`
- `CONTRIBUTING.md`

The agent must not bump the version, remove `CardGrid`, edit demo/Cypress, or create ISSUE files (F055).

## Execution Notes

### Plan
1. Update `README.md` Preferred UI guidance to name `DataCardGrid` for multi-card view/edit while keeping the full `CardGrid` list-dashboard contract unchanged.
2. Add `DataCardGrid` to the component table and document its fixed API: class `data-card-grid`, hardcoded `data-automation-id="data-card-grid"`, no props, default slot (no Fragment flatten), 1/2/4 columns at 641px / 1920px, 16px gap, demo `/demo/editors`.
3. Replace the `markdown` / `MarkdownEditor` “textarea only” note with sanitized GFM resting view, click-to-edit textarea (max 4096), read-only without edit affordance, unchanged props, automation ids, and bundled `marked` + `dompurify`.
4. Add a short Vue example nesting `DataCard` + `MarkdownEditor` inside `DataCardGrid`; include `DataCardGrid` in the import sample and Sources.
5. Update `CONTRIBUTING.md` component tree to list `DataCardGrid` next to `DataCard`.
6. Manually review docs against `DataCardGrid.vue` / `MarkdownEditor.vue` and confirm `CardGrid` docs remain; run `npm run build`.

### Results
- **README.md**: Preferred UI split list (`CardGrid`) vs view/edit (`DataCardGrid`); table row + `##### DataCardGrid` section with 1/2/4 contract, hardcoded automation id, no-props/slot notes, `/demo/editors` demo, and nested `DataCard` + `MarkdownEditor` example; `markdown` row updated for sanitized GFM / click-to-edit / automation ids / bundled deps; import sample and Sources include `DataCardGrid`.
- **CONTRIBUTING.md**: `src/components/` tree comment lists `DataCardGrid` next to `DataCard`.
- **CardGrid docs**: List-dashboard column contract, Fragment flatten behavior, height stretch rules, migration note, and dashboard verification guidance left intact (no rewrite; version not pinned to 1.0.6).
- **Build**: `npm run build` succeeded (vite + `tsc --emitDeclarationOnly`).
- **Not done (per task)**: no version bump, no CardGrid removal, no demo/Cypress edits, no ISSUE files.

**Orchestrator confirmation:** README documents `DataCardGrid` (hardcoded `data-card-grid` id, 1/2/4 columns) and rendered `MarkdownEditor` automation ids. `CardGrid` list-dashboard section remains. Version is not pinned to 1.0.6. CONTRIBUTING names `DataCardGrid`.
