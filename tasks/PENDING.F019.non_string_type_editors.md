# F019 – Type-aligned non-string view/edit editors

**Status**: Pending  
**Type**: Feature  
**Depends On**: F018  
**Description**: Implement configurator-type-aligned non-string editors and the breadcrumb display using standard Vuetify controls, sharing the F017 editor contract.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Sibling repos must all be sibling folders under a common parent.

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `README.md`, `src/components/...`, `src/utils/validation.ts`, `tests/...`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md`
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `tasks/PENDING.F015.peer_review_card_editor_approach.md`
- `tasks/PENDING.F017.editor_foundation_and_autosave.md` — design catalog + shared contract
- `README.md`
- `src/components/AutoSaveSelect.vue` — pattern reference for discrete value saves
- `src/components/index.ts`
- F017/F018 editor base and validation utilities

## Goals

### Planned component design (non-string family)

| Type | Component | Control | Validation / behavior |
|------|-----------|---------|------------------------|
| `boolean` | `BooleanEditor` | `v-switch` (preferred) or `v-checkbox` | true/false; AutoSave on change (not blur) is acceptable — document choice |
| `count` | `CountEditor` | `v-text-field` `type="number"` or `v-number-input` if available in project Vuetify | integer ≥ 0 |
| `index` | `IndexEditor` | same as count | integer ≥ 0; zero-based semantics in label/hint |
| `rating` | `RatingEditor` | `v-rating` | integer 1–4 only; clear empty/half-star disabled |
| `date-time` | `DateTimeEditor` | Prefer standard Vuetify date/time pickers; fallback outlined text field with ISO-8601 rules | store/display ISO-8601 strings consistent with API JSON |
| `breadcrumb` | `BreadcrumbDisplay` | Read-only layout (fields or definition list) inside card body | Shows `from_ip`, `by_user`, `at_time`, `correlation_id`; not an edit form by default. May compose `IpAddressEditor` / `WordEditor` / `DateTimeEditor` in `editable=false` mode |

Shared contract parity with F018: visibility, editability (where applicable), automation ids, full-width in card bodies, exports from `src/components/index.ts`.

Note: Enumerator/`AutoSaveSelect` remains available; a generic enum editor is **out of scope** unless F015 explicitly pulled it in.

## Testing Expectations

Run all commands from **this spa_utils repository root**.

- Unit tests for each new editor/display component (validation bounds for count/index/rating; breadcrumb renders all four fields).
- `npm run test`
- `npm run build`

## Outputs

- `src/components/editors/BooleanEditor.vue`
- `src/components/editors/CountEditor.vue`
- `src/components/editors/IndexEditor.vue`
- `src/components/editors/RatingEditor.vue`
- `src/components/editors/DateTimeEditor.vue`
- `src/components/editors/BreadcrumbDisplay.vue`
- `src/components/index.ts` — exports
- `src/utils/validation.ts` — rules as needed
- Matching `tests/components/editors/*.test.ts`

The agent must not update demo pages (F021) or docs (F023) in this task.

## Execution Notes

(reserved for execution agent)
