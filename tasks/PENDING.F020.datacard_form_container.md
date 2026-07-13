# F020 – DataCard form container with reactive field binding

**Status**: Pending  
**Type**: Feature  
**Depends On**: F019  
**Description**: Implement `DataCard` as a card-based form/section container that supplies a reactive model to typed editors via `provide`/`inject` so pages can declare forms as cards plus field editors.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Sibling repos must all be sibling folders under a common parent.

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `README.md`, `src/components/...`, `tests/...`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md`
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `tasks/SHIPPED.F015.peer_review_card_editor_approach.md` — provide/inject decision
- `tasks/PENDING.F016.card_and_card_grid_layout.md`
- `tasks/PENDING.F017.editor_foundation_and_autosave.md` — provide Symbol + inject typing
- `README.md`
- `src/components/MhCard.vue`
- Editor components from F018/F019

## Goals

### `DataCard`

- Compose `MhCard` (title color, identifier/name, actions slot, collapse toggle) as the visual shell for View/Edit input sections. File: `src/components/DataCard.vue`.
- Props (F015 locked names):
  - `model` — reactive document object
  - `onSave(field, value)` — child editors AutoSave without each parent page wiring every field manually
  - `nameField` — optional model property key for the title-bar identifier (live binding from `model`)
  - `title`, `color`, `automationId` — presentation / automation
  - Collapse: inherit F016 behavior (uncontrolled local default; optional `v-model:collapsed`; no persistence)
- **Binding (F015 locked):** expose context to children via Vue `provide`/`inject` using the **exported Symbol** from F017. Do not prop-drill the model into each editor.
- **Inject typing (F015 gap closure):** typed context interface (model ref/reactive, `onSave`, optional helpers); editors inject optionally and fall back to standalone `modelValue`/`onSave`.
- Support declarative usage:

```vue
<DataCard
  title="Identity"
  name-field="full_name"
  color="primary"
  :model="profile"
  :on-save="saveField"
  automation-id="demo-profile-identity-card"
>
  <WordEditor field="name" :editable="true" automation-id="demo-profile-name" />
  <MarkdownEditor field="description" :editable="true" automation-id="demo-profile-description" />
</DataCard>
```

- Collapse toggle hides/shows the body; when expanded, editors fill card width.
- Works inside `CardGrid` for multi-card edit pages.

### Integration expectations

- Typed editors resolve values from `DataCard` when inject context is present; they still support standalone `modelValue` / `onSave` for demos (F017 contract).
- Export provide key and any `useDataCard*` helper from package surfaces used by components (`src/components/index.ts` and/or `src/composables/index.ts`).
- No journey-SPA-specific domain types hard-coded in spa_utils.

## Testing Expectations

Run all commands from **this spa_utils repository root**.

- Unit tests: provide/inject binding via Symbol; collapse (`v-model:collapsed` + uncontrolled); `nameField` in title; child save callback invoked with `field` key; editors work without DataCard via `modelValue`.
- `npm run test`
- `npm run build`

## Outputs

- `src/components/DataCard.vue`
- Shared inject key / composable if not already shipped in F017 (e.g. `src/composables/useDataCardField.ts`)
- `src/components/index.ts` — exports
- `src/composables/index.ts` — export composable if added
- `tests/components/DataCard.test.ts` and related tests

The agent must not update demo pages (F021/F022) or docs (F023) in this task.

## Execution Notes

(reserved for execution agent)
