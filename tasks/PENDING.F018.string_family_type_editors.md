# F018 – Type-aligned string-family view/edit editors

**Status**: Pending  
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
| `duration` | `DurationEditor` | `v-text-field` | ISO-8601 duration pattern; hint showing example `P3DT4H30M` |
| `ip_address` | `IpAddressEditor` | `v-text-field` | IPv4/IPv6-aware rules; view mode plain text / readonly field |
| `identifier` | `IdentifierEditor` | `v-text-field` | `^[0-9a-fA-F]{24}$`; **default `editable=false`** (ObjectIds rarely edited) |

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
- `src/components/editors/DurationEditor.vue`
- `src/components/editors/IpAddressEditor.vue`
- `src/components/editors/IdentifierEditor.vue`
- `src/components/index.ts` — exports
- `src/utils/validation.ts` — complete rules for these types
- Matching `tests/components/editors/*.test.ts` and `tests/utils/validation.test.ts`

The agent must not update files outside this list (except fixing F017 exports if required for compilation).

## Execution Notes

(reserved for execution agent)
