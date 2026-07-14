# F018 – Type-aligned string-family view/edit editors

**Status**: Shipped  
**Type**: Feature  
**Depends On**: F017  
**Description**: Implement configurator-type-aligned string-family editors as thin derivatives of the F017 string base, including validation, view/edit via `editable`, automation ids, and full-width layout inside cards.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Sibling repos must all be sibling folders under a common parent.

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `README.md`, `src/components/...`, `src/utils/validation.ts`, `tests/...`, `cypress/...`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md`
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `tasks/SHIPPED.F015.peer_review_card_editor_approach.md`
- `tasks/PENDING.F017.editor_foundation_and_autosave.md` — design catalog + shared contract
- `README.md`
- `src/utils/validation.ts`
- `src/components/index.ts`
- New string-base component(s) from F017

## Goals

Implement and export each editor below under `src/components/editors/`. Stick to Vuetify/Material Design defaults (`density="comfortable"`, `variant="outlined"`). Each editor must honor the F015/F017 shared contract: `field`, optional `visible`, `editable`, `automationId`, AutoSave-on-blur when editable, standalone `modelValue`/`onSave` when outside `DataCard`.

### Planned component design (string family)

| Type | Component | Control | Validation / behavior |
|------|-----------|---------|------------------------|
| `word` | `WordEditor` | `v-text-field` | `^[^\s]{1,40}$`; single-line token |
| `sentence` | `SentenceEditor` | `v-text-field` | `^[^\t\n]{0,255}$`; short descriptions |
| `markdown` | `MarkdownEditor` | `v-textarea` (rows configurable) | maxLength 4096; preserve newlines/tabs |
| `email` | `EmailEditor` | `v-text-field` (`type="email"` where appropriate) | `^[^\s@]+@[^\s@]+\.[^\s@]+$` |
| `url` | `UrlEditor` | `v-text-field` | `^https?://[^\s]+$`; in `editable=false` mode, render as plain text or simple link (`a` / `v-btn` variant text) without a separate View component |
| `us_phone` | `UsPhoneEditor` | `v-text-field` | `^(\+1[0-9]{10}\|[0-9]{3}-[0-9]{3}-[0-9]{4})$` |
| `ip_address` | `IpAddressEditor` | `v-text-field` | IPv4/IPv6-aware rules; view mode plain text / readonly field |
| `identifier` | `IdentifierEditor` | `v-text-field` | `^[0-9a-fA-F]{24}$`; **default `editable=false`** (ObjectIds rarely edited) |

**Moved to F019:** `duration` — like `date-time`, stored as an ISO string but edited via a structured control so users never type `P3DT4H30M`.

Declarative usage target (F015 locked prop names):

```vue
<WordEditor field="name" :editable="true" automation-id="demo-word-name" />
<MarkdownEditor field="description" :editable="true" automation-id="demo-markdown-description" />
<IdentifierEditor field="id" automation-id="demo-identifier" />
```

## Testing Expectations

Run all commands from **this spa_utils repository root**.

- Unit tests per editor (or shared parameterized suites) covering validation, `editable` true/false (readonly vs writable), and automation ids. Meet component coverage targets.
- Extend `tests/utils/validation.test.ts` for new rules.
- `npm run test`
- `npm run build`
- Cypress may wait for F021 demo hosting unless lightweight component specs are preferred.

## Outputs

- `src/components/editors/WordEditor.vue`
- `src/components/editors/SentenceEditor.vue`
- `src/components/editors/MarkdownEditor.vue`
- `src/components/editors/EmailEditor.vue`
- `src/components/editors/UrlEditor.vue`
- `src/components/editors/UsPhoneEditor.vue`
- `src/components/editors/IpAddressEditor.vue`
- `src/components/editors/IdentifierEditor.vue`
- `src/components/index.ts` — exports
- `src/utils/validation.ts` — complete rules for these types
- Matching `tests/components/editors/*.test.ts` and `tests/utils/validation.test.ts`

The agent must not update files outside this list (except fixing F017 exports if required for compilation).

## Execution Notes

### Plan

`src/utils/validation.ts` already had all eight rules (`wordPattern`, `sentencePattern`, `markdownPattern`, `emailPattern`, `urlPattern`, `usPhonePattern`, `ipAddressPattern`, `identifierPattern`) fully implemented and tested as F017 stubs, so no changes to that file were needed. Implemented each editor as a thin wrapper around F017's `StringEditor`, following the `AutoSaveField` delegation pattern:

1. `src/components/editors/WordEditor.vue`, `SentenceEditor.vue`, `EmailEditor.vue`, `UsPhoneEditor.vue`, `IpAddressEditor.vue` — identical shape: forward `field`/`modelValue`/`onSave`/`editable`/`visible`/`automationId`/`label`/`hint` straight through to `StringEditor`, default `editable`/`visible` to `true`, and default `rules` to `[validationRules.<type>Pattern]` unless the caller supplies its own `rules` override. View mode (`editable=false`) is handled entirely by `StringEditor`'s existing plain-text display (with `-display` automation-id suffixing) — no custom view markup needed for these five.
2. `src/components/editors/MarkdownEditor.vue` — same shape, but always passes `textarea` (`true`) to `StringEditor` and adds a `rows` prop (default `4`) for configurable textarea height. Rules default to `markdownPattern` (4096-char cap; newlines/tabs pass through `StringEditor`'s textarea unchanged).
3. `src/components/editors/UrlEditor.vue` — the one exception per the task's explicit callout: in `editable=false` mode it does **not** delegate to `StringEditor` (which would just show plain text). Instead it resolves the current value itself (via `useDataCardContext`/`resolveDataCardModel`, mirroring `StringEditor`'s own resolution logic) and renders an `<a target="_blank" rel="noopener noreferrer">` link when the value is non-empty and passes `urlPattern`, falling back to the same em-dash/plain-text display otherwise. Replicates `StringEditor`'s `-display` automation-id suffixing (idempotent) so automation contracts stay consistent across editors. In `editable=true` mode it delegates to `StringEditor` exactly like the other wrappers, defaulting `rules` to `[validationRules.urlPattern]`.
4. `src/components/editors/IdentifierEditor.vue` — same thin-wrapper shape as Word/Sentence/etc., but defaults `editable` to `false` (ObjectIds are display-first / rarely hand-edited) instead of `true`. Passing `editable: true` explicitly still renders a normal writable `StringEditor` input validated by `identifierPattern`.
5. `src/components/editors/index.ts` — added exports for all eight new editors alongside the existing `StringEditor` export.
6. `src/components/index.ts` — re-exports the eight new editors from `./editors` (added to the existing `StringEditor` export statement); `src/index.ts` picks them up automatically via its `export * from './components'`.
7. Did not touch `src/utils/validation.ts` (already complete) or any F017 exports (no compilation fixes were required).

Tests: added `tests/components/editors/{WordEditor,SentenceEditor,MarkdownEditor,EmailEditor,UrlEditor,UsPhoneEditor,IpAddressEditor,IdentifierEditor}.test.ts` (one file per editor, matching the existing `StringEditor.test.ts` convention). Each covers: prop forwarding to `StringEditor` (`field`/`modelValue`/`onSave`/`editable`/`visible`/`automationId`/`label`), the default type-specific `rules` array, a `rules` override, and `editable` true/false rendering (writable input vs. plain/readonly display). `IdentifierEditor` additionally asserts its `editable=false` default. `UrlEditor` additionally covers: link vs. plain-text fallback for invalid/empty values, `-display` automation-id suffixing (including idempotency), `visible=false` producing no output, and reading its value from an injected `DataCard` context via `field`. No changes were needed to `tests/utils/validation.test.ts` — the F017 wave already fully covered all eight rules.

### Test results

- `npm run test` — **207/207 tests passed** (24 test files), including 40 new tests across the 8 new editor test files. Pre-existing `[Vue warn] Failed to resolve component: v-card/...` noise in `MhCard.test.ts` is unrelated (Vuetify components aren't globally registered in unit tests), not a failure.
- `npm run build` — succeeded (`vite build` + `tsc --emitDeclarationOnly`); package builds cleanly with the new editor exports (`dist/index.js` 47.25 kB / gzip 9.81 kB).

### Blockers

None. `duration`/`DurationEditor`, `DateTimeEditor`, `DataCard`, and demo pages were intentionally left untouched per task scope (F019/F020/F021).
