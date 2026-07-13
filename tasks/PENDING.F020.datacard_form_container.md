# F020 – DataCard form container with reactive field binding

**Status**: Pending  
**Type**: Feature  
**Depends On**: F019  
**Description**: Implement `DataCard` as a card-based form/section container that supplies a reactive model to typed editors so pages can declare forms as cards plus field editors with attributes for data property, visibility, editability, and automation tags.

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
- `tasks/PENDING.F015.peer_review_card_editor_approach.md` — provide/inject vs props decision
- `tasks/PENDING.F016.card_and_card_grid_layout.md`
- `tasks/PENDING.F017.editor_foundation_and_autosave.md`
- `README.md`
- `src/components/MhCard.vue` (or equivalent from F016)
- Editor components from F018/F019

## Goals

### `DataCard`

- Compose `MhCard` (title color, identifier/name, actions slot, collapse toggle) as the visual shell for View/Edit input sections.
- Accept a reactive model / document object and an optional `onSave(field, value)` (or equivalent) so child editors can AutoSave without each parent page wiring every field manually.
- Expose binding to children via the F015-approved mechanism (prefer `provide`/`inject` keyed on field name; prop drilling only if review rejected inject).
- Support declarative usage roughly equivalent to:

```vue
<DataCard
  title="Identity"
  name-data="full_name"
  color="primary"
  :model="profile"
  :on-save="saveField"
  automation-id="demo-profile-identity-card"
>
  <WordEditor field="name" :editable="true" automation-id="demo-profile-name" />
  <MarkdownEditor field="description" :editable="true" automation-id="demo-profile-description" />
</DataCard>
```

- Title-bar **name/identifier** can bind from the model via a prop (e.g. `nameField` / `nameData`) so list/edit cards show a live identifier.
- Collapse toggle hides/shows the body; when expanded, editors fill card width.
- Works inside `CardGrid` for multi-card edit pages.

### Integration expectations

- Typed editors resolve values from `DataCard` when a parent model is provided; they still support standalone `modelValue` / `onSave` for simple demos (F017 contract).
- No journey-SPA-specific domain types hard-coded in spa_utils.

## Testing Expectations

Run all commands from **this spa_utils repository root**.

- Unit tests: provide/inject (or prop) binding; collapse; name field in title; child save callback invoked with field key.
- `npm run test`
- `npm run build`

## Outputs

- `src/components/DataCard.vue` (or peer-review-approved name)
- Shared inject key / composable if introduced (e.g. `src/composables/useDataCardField.ts`)
- `src/components/index.ts` — exports
- `src/composables/index.ts` — export composable if added
- `tests/components/DataCard.test.ts` and related tests

The agent must not update demo pages (F021/F022) or docs (F023) in this task.

## Execution Notes

(reserved for execution agent)
