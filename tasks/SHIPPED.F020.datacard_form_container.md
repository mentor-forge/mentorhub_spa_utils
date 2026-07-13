# F020 – DataCard form container with reactive field binding

**Status**: Shipped  
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

### Plan

1. `src/components/DataCard.vue` (`<script setup>`, composes `MhCard`):
   - Props (F015-locked names): `model: DataCardModel` (required), `onSave: (field, value) => Promise<void>` (required), `nameField?`, `title?`, `color?` (default `primary`), `collapsed?` (optional `v-model:collapsed`, `undefined` default via `withDefaults` — same boolean-cast-avoidance trick as `MhCard`), `automationId?`.
   - Calls `provideDataCardContext({ model: () => props.model, onSave: (field, value) => props.onSave(field, value) })` on setup — a getter (not the raw object) so `resolveDataCardModel`/`toValue` always reads the *current* `props.model`, and a wrapper function (not `props.onSave` directly) so descendants always call the *current* `onSave` prop even if the parent swaps it after mount.
   - Template renders a single `MhCard` root: `title`/`color`/`automationId` passed straight through; `name` computed from `model[nameField]` (stringified, `undefined` when `nameField` unset or the value is nullish) for the live title-bar identifier; `collapsible` fixed `true` (a `DataCard` is always a collapsible form section — unlike generic `MhCard` usage, which opts in); `collapsed` forwarded as-is so an unset `collapsed` prop stays `undefined` end-to-end and `MhCard`'s own uncontrolled local state takes over (no duplicate collapse-state tracking in `DataCard`); `update:collapsed` re-emitted up for the optional `v-model:collapsed` contract. Default slot + `#actions` slot both forwarded to `MhCard` unchanged.
2. `src/components/index.ts`: added `export { default as DataCard } from './DataCard.vue'`. No new composable was needed — `provideDataCardContext`/`useDataCardContext`/`dataCardContextKey`/`resolveDataCardModel` already ship from F017's `src/composables/useDataCardContext.ts` and were already exported from `src/composables/index.ts`, so that file needed no changes.
3. Tests: `tests/components/DataCard.test.ts` — composes-`MhCard` (title/color/automationId/actions-slot passthrough), `nameField` live binding (initial + reactive update + omitted-when-unset), provide/inject (raw `useDataCardContext`/`resolveDataCardModel` probe component, live-model-update probe, and a real `WordEditor` resolving `field` from the injected model), save callback (`onSave(field, value)` invoked through a descendant editor's context save, plus a regression test that a later-swapped `onSave` prop — not a stale closure — is what gets called), collapse (uncontrolled default-expanded + toggle, and controlled `v-model:collapsed`), a `CardGrid`-nesting smoke test, and a standalone-editor sanity test (typed editors still work via `modelValue`/`onSave` with no `DataCard` ancestor).

### Results

- Implemented `src/components/DataCard.vue` per the plan above.
- **Gap found & fixed during testing (test-environment quirk, not a product bug):** the first collapse test attempted to call Vue Test Utils' `isVisible()` on the card body both *before* and *after* clicking the collapse toggle within the same `mount()`. jsdom's `getComputedStyle()` does not reliably re-resolve `display` on a `mount()`ed-but-not-attached (detached) node once it has already been queried once — the second `isVisible()` call kept returning `true` even though the underlying `style="display: none"` attribute (and the component's own `isCollapsed` state) were correct. Confirmed via targeted scratch repros comparing `getComputedStyle` output directly against `isVisible()`, and confirmed the fix: mounting with `attachTo: document.body` (and `wrapper.unmount()` after each such test) makes `isVisible()` behave correctly across repeated calls. Applied to both collapse tests; no other tests needed it since they only ever call `isVisible()`-equivalent checks (`.text()`, attribute reads) once per assertion.
- **Gap found & fixed during testing:** `input.trigger('blur')` never reaches `StringEditor`'s `handleBlur` because the shared `tests/setup.ts` `v-text-field` stub only emits `update:modelValue` on native `input`, never a native `blur`-triggered `emit('blur')` — matching the existing convention in `tests/components/editors/StringEditor.test.ts`, save-callback and standalone-editor tests call the mounted `StringEditor` instance's exposed `handleInput`/`handleBlur` directly via `wrapper.findComponent(StringEditor).vm` instead of simulating a DOM blur event.
- `npm run test`: **332/332 passed** (33 test files; 14 new `DataCard` tests; no regressions in any existing suite, including `MhCard`/`CardGrid`/`StringEditor`/typed-editor tests).
- `npm run build`: **succeeded** (`vite build` + `tsc --emitDeclarationOnly`); confirmed `dist/components/index.d.ts` exports `DataCard`.
- Files touched: `src/components/DataCard.vue` (new), `src/components/index.ts` (added export), `tests/components/DataCard.test.ts` (new). `src/composables/index.ts` required no change (F017 already exports everything `DataCard` needs). No demo pages, docs, or other task outputs touched.
- No commit/push performed (orchestrator owns change control).
- No blockers.
