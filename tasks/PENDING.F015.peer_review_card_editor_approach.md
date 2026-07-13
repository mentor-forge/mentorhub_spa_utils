# F015 – Peer review: Card, DataCard, and type-aligned editor approach

**Status**: Pending  
**Type**: Feature  
**Depends On**: none  
**Description**: Kickoff peer review of the planned reusable Card/layout system and configurator-type-aligned view/edit components. Identify gaps and anti-patterns, then adjust the remaining PENDING tasks in this workflow before implementation starts.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Sibling repos must all be sibling folders under a common parent.

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `README.md`, `CONTRIBUTING.md`, `src/...`, `demo/...`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md` — Component Patterns, Automation IDs, Testing Standards
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `README.md`
- `src/components/AutoSaveField.vue`
- `src/components/AutoSaveSelect.vue`
- `src/components/index.ts`
- `src/utils/validation.ts`
- `demo/pages/DemoPage.vue`
- `demo/router.ts`
- All `PENDING.F016.*` through `PENDING.F025.*` task files in `tasks/`

**Approach under review (author intent):**

1. **Cards & layout** — Reusable card with solid-color title bar (title + identifier), white body, right-justified action-icon slot, thin border, slight radius, shadow. List pages use a responsive card grid (mobile 1-col → desktop/wide multi-col). View/Edit pages use cards as input containers with show/hide toggle; controls expand to fill the card. Cards grow to available horizontal space.
2. **Type-aligned editors** — One reusable view/edit control family aligned to MongoDB configurator type names (`word`, `sentence`, `markdown`, `email`, `url`, `us_phone`, `duration`, `ip_address`, `identifier`, `boolean`, `count`, `index`, `rating`, `date-time`, `breadcrumb`). Prefer an abstract string-input base with typed derivatives; keep forms declarative (`DataCard` + editor children with `data`, visibility, editability, automation attrs).
3. **Existing editors** — Adjust `AutoSaveField` / `AutoSaveSelect` rather than leaving parallel patterns.
4. **Demo** — Demo server shows all inputs across several cards plus a cards-based dashboard page.
5. **Stack** — Standard Vuetify / Material Design controls, icons, and styles only; global theme tweaks later if needed.
6. **Close** — Version bump, then `ISSUE.md` files for downstream `*_spa` repos.

Configurator type semantics (vocabulary only — do not read sibling `mentorhub_mongodb_api` files during execution):

| Type | Constraint summary |
|------|--------------------|
| `word` | 1–40 chars, no whitespace |
| `sentence` | 0–255 chars, no tabs/newlines |
| `markdown` | string up to 4096 chars |
| `email` | email pattern |
| `url` | `http(s)://…` URI |
| `us_phone` | `+1##########` or `###-###-####` |
| `duration` | ISO-8601 duration |
| `ip_address` | IPv4/IPv6 |
| `identifier` | 24-hex ObjectId |
| `boolean` | true/false |
| `count` / `index` | non-negative integer |
| `rating` | integer 1–4 |
| `date-time` | ISO-8601 date-time |
| `breadcrumb` | object `{from_ip, by_user, at_time, correlation_id}` (typically display-only) |

## Goals

- Peer-review the approach above against Vue 3 + Vuetify 3 practice, spa_standards AutoSave/automation patterns, and package export boundaries (`src/components`, `src/utils`, demo only).
- Explicitly call out gaps and anti-patterns, including at least consideration of:
  - Prop naming vs Vue conventions (`data` reserved/confusing; prefer `dataKey` / `field` while keeping declarative usage clear)
  - Provide/inject vs prop-drilling for `DataCard` model binding
  - Collapse state persistence (none / local / parent-controlled)
  - View vs edit mode strategy (separate components vs `readonly` / `editable` prop)
  - Overlap with existing `AutoSaveField` / `AutoSaveSelect` / `validationRules`
  - Breadcrumb and identifier UX (usually read-only)
  - Whether `AutoSaveSelect` / enum editors belong in this wave or a follow-on
  - Breakpoint tokens for the card grid (Vuetify `cols` / `md` / `lg` / `xl`)
  - Package public API / breaking-change impact on journey SPAs
- Update `PENDING.F016`–`PENDING.F025` task files as needed (Goals, Outputs, Testing Expectations, sequenced Dependencies) so the serial chain reflects peer-review decisions.
- Leave a short **Peer review findings** subsection in this task’s **Execution Notes** summarizing decisions (keep/change/defer).

## Testing Expectations

Run all commands from **this spa_utils repository root**.

- No product code changes required for this task.
- Verify every `PENDING.F016`–`PENDING.F025` file still satisfies `tasks/_PLANNING.md` layout (Status, Type, Depends On, Path anchoring, Context, Goals, Testing Expectations, Outputs, Execution Notes).
- Confirm the dependency chain remains a single serial sequence starting at F015.
- `npm run test` and `npm run build` only if incidental file edits could affect the package (normally N/A).

## Outputs

- `tasks/PENDING.F015.peer_review_card_editor_approach.md` — Execution Notes with peer review findings
- `tasks/PENDING.F016.*` through `tasks/PENDING.F025.*` — adjusted as required by the review (may rename short names only if Depends On references stay consistent; prefer editing content in place)

The agent must not update files outside this list (no `src/`, `demo/`, or docs changes in this task).

## Execution Notes

(reserved for execution agent)
