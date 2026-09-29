# F051 – Harvest rendered MarkdownEditor

**Status**: Shipped  
**Type**: Feature  
**Depends On**: F050  
**Description**: Replace the textarea-only `MarkdownEditor` with rendered, sanitized markdown and click-to-edit, keeping the existing export name and editor props so downstream SPAs pick up the behavior by bumping the dependency (F056).

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `README.md`, `src/components/editors/...`, `tests/components/editors/...`, `package.json`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md`
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `README.md` — current `markdown` → `MarkdownEditor` row (textarea, max 4096)
- `src/components/editors/MarkdownEditor.vue` — current `StringEditor` textarea wrapper
- `src/components/editors/StringEditor.vue` — DataCard vs standalone save pattern to reuse
- `src/components/editors/types.ts` — `BaseEditorProps`
- `src/composables/useDataCardContext.ts`
- `src/utils/validation.ts` — `validationRules.markdownPattern` (max 4096)
- `tests/components/editors/MarkdownEditor.test.ts`
- `vite.config.ts` — `rollupOptions.external`
- `package.json`
- GitHub: [issue #41](https://github.com/mentor-forge/mentorhub_spa_utils/issues/41)

Do **not** read, edit, or depend on implementation files in journey SPA repositories. The validated editor contract is recorded below.

### Locked API decision

Keep the export name `MarkdownEditor` from `src/components/editors/index.ts` and `src/components/index.ts`. Do not add a second markdown component.

Keep these props, with the same defaults, so existing call sites keep compiling:

- `field?`, `modelValue?`, `onSave?`, `editable` (default `true`), `visible` (default `true`), `automationId?`, `label?`, `hint?`, `rules?`, `rows` (default `4`)
- Extend `BaseEditorProps<string | number | undefined>` in spirit. `onSave` may return `Promise<void> | void`.
- Default `rules` to `[validationRules.markdownPattern]` when `rules` is omitted.
- Continue to accept a numeric `modelValue` and treat it as text.

Stop wrapping `StringEditor`. Display and edit are two modes of this component.

**Display vs edit**

- `visible === false` renders nothing.
- `editable === true` starts in display mode (`isEditing === false`). The textarea exists in the DOM only as a hidden edit surface (`v-show`), not as the resting view.
- Click or Enter on the display container calls `startEditing()` when `editable` is true, then focuses the textarea on `nextTick` (component `focus()` or the inner `textarea`).
- `editable === false` never enters edit mode, shows no pencil / "Edit" hint, and renders no textarea.
- Blur of the textarea sets `isEditing` false and saves when the value changed.
- Escape sets `isEditing` false. Do not add a separate discard path; hiding the field may still blur and save.
- Empty + editable: italic placeholder `Click to add {label|content}...` (label lowercased).
- Empty + not editable: em dash `—`.
- Non-empty: render GitHub-flavored markdown with single-newline breaks (`gfm: true`, `breaks: true`). Use `marked.use` when `setOptions` is unavailable on the installed `marked` major.
- Sanitize with `DOMPurify.sanitize` before `v-html`. On parse failure, sanitize the raw string. Strip tags such as `<script>`.

**Save**

- Prefer injected DataCard context when `field` is set: read `resolveDataCardModel(context)[field]`, and on change call `context.onSave(field, value)`.
- Otherwise use standalone `modelValue` and `onSave(value)`.
- Ignore save when the current value equals the source value.
- While saving, show a small progress indicator and disable the textarea. On success, show `mdi-check` and clear it after 2000ms. On failure, surface `err.message` or `Failed to save`.
- Emit `update:modelValue` with `String(value)` on input, and `blur` when a blur event is present.

**Automation ids**

- Root: `automationId` as `data-automation-id` when provided.
- Textarea: `${automationId}-input` when `automationId` is set.
- Display container: if `automationId` ends with `-display`, use it unchanged; otherwise `${automationId}-display`.
- Rendered value, placeholder, and empty em dash: `data-automation-id="markdown-field-display"`.

**Chrome**

- Textarea: `v-textarea`, `auto-grow`, `variant="outlined"`, `density="comfortable"`, `:rows="rows"`.
- Display container: full width, 4px radius, `0.5rem 0.75rem` padding. When editable, dashed primary border, pointer cursor, hover/focus-visible primary emphasis, and an "Edit" caption with `mdi-pencil`.
- Rendered markdown: heading sizes stepping down from `h1` 1.4rem through `h4` 1rem, lists, inline `code`, `pre`, and `blockquote` stay readable inside the card. Scope those rules under the display value with `:deep`.

**Dependencies**

- Add `marked` (`^18`) and `dompurify` (`^3`) with `npm install` (run `mh` first if CodeArtifact auth is required). Let the lockfile record the resolved versions.
- Do **not** add them to `rollupOptions.external`. The library build must inline them so a downstream SPA does not add its own `marked` or `dompurify` import.
- Add `@types/dompurify` as a devDependency only if `tsc` cannot resolve `dompurify` types.
- Import `useDataCardContext`, `resolveDataCardModel`, and `validationRules` via relative paths. Do not import this package from itself.

Expose `currentValue`, `isEditing`, `saving`, `saved`, `error`, `startEditing`, `handleInput`, and `handleBlur` for tests.

## Goals

- Existing `MarkdownEditor` imports and props keep working.
- Resting state is sanitized rendered markdown, including inside a `DataCard` (`field`) and standalone (`modelValue` + `onSave`).
- Click-to-edit and read-only display follow the locked contract.
- Unsafe HTML in the markdown source is not rendered as live markup.
- `marked` and `dompurify` are available to the library build and are not new peer dependencies.

### Craftsmanship Expectations

- One markdown editor owns this behavior. Do not leave the `StringEditor` textarea wrapper beside the new component.
- Reuse `useDataCardContext`, `resolveDataCardModel`, and `validationRules.markdownPattern` instead of a private save or validation copy.
- Keep journey content (encounter transcripts, person names) out of the component. Tests may use generic markdown fixtures.

## Testing Expectations

Run all commands from this repository root.

Rewrite `tests/components/editors/MarkdownEditor.test.ts`. Drop assertions that `MarkdownEditor` forwards to `StringEditor` or that an editable editor always shows a textarea.

Cover at least:

- Standalone `onSave` on blur when the value changed, and no save when unchanged
- Editable mode renders a heading (`## Section Title`) and does not start in edit mode; click enters edit mode; blur returns to display and saves
- `editable: false` ignores click, renders no textarea and no edit hint, and renders `**Note:**` as `<strong>`
- DOMPurify removes a `<script>` payload while keeping surrounding text
- Empty editable placeholder and empty read-only em dash
- `automationId` on the root, `${automationId}-input` on the textarea, `${automationId}-display` on the container, and `markdown-field-display` on the value
- An `automationId` that already ends in `-display` is not double-suffixed
- `visible: false` renders no root
- DataCard context wins over standalone `modelValue` when `field` is set, and blur calls `context.onSave(field, value)`
- Default rules remain `markdownPattern` (max 4096)
- Custom `rows` reaches the textarea

`npm run test -- tests/components/editors/MarkdownEditor.test.ts`  
`npm run test`  
`npm run test:coverage` (record known unrelated threshold failures separately)  
`npm run lint`  
`npm run build`  

Confirm `dist` still exports `MarkdownEditor` and that built JS does not contain a bare `import` of `marked` or `dompurify` from the package entry (they are inlined). Consumers must not need new import statements.

## Outputs

- `src/components/editors/MarkdownEditor.vue`
- `tests/components/editors/MarkdownEditor.test.ts`
- `package.json`
- `package-lock.json`

The agent must not edit demo/Cypress, README, `DataCardGrid`, `CardGrid`, package version, `vite.config.ts` externals, or any journey SPA in this task. Adding `@types/dompurify` to `package.json` / the lockfile is allowed only when `tsc` requires it.

## Execution Notes

### Plan
1. Install `marked` (^18) and `dompurify` (^3) as dependencies via `mh` + `npm install` (leave out of vite externals so they inline).
2. Replace `MarkdownEditor.vue` StringEditor wrapper with a self-contained click-to-edit component: display mode (sanitized GFM HTML), hidden `v-textarea` edit surface, DataCard/standalone save matching StringEditor.
3. Rewrite `MarkdownEditor.test.ts` for the locked contract (no StringEditor forwarding assertions).
4. Run unit tests, full suite, coverage, lint, build; confirm dist exports MarkdownEditor and does not bare-import marked/dompurify.
5. Record Results here; leave Status Pending (orchestrator commits/ships).

### Results
- Installed deps after refreshing CodeArtifact token in local (gitignored) `.npmrc`: `marked@^18.0.14` → lock **18.0.14**, `dompurify@^3.4.16` → lock **3.4.16**. Not added to `vite.config.ts` externals; `@types/dompurify` not needed (`tsc` OK).
- Replaced `MarkdownEditor.vue` with rendered/sanitized click-to-edit editor; rewrote unit tests (12 cases).
- `npm run test -- tests/components/editors/MarkdownEditor.test.ts` — **pass** (12/12).
- `npm run test` — **pass** (42 files, 457/457).
- `npm run test:coverage` — tests pass; **known unrelated** `src/utils/**` threshold failures (lines/functions/statements/branches below 100%; admin.ts / authBootstrap.ts etc.). MarkdownEditor ~90% lines.
- `npm run lint` — **eslint missing** (`sh: eslint: command not found`); pre-existing, continued.
- `npm run build` — **pass**. `dist` exports `MarkdownEditor`; `dist/index.js` has **no** bare `import` of `marked`/`dompurify` (both inlined).
- Status left **Pending** for orchestrator confirmation.

**Orchestrator confirmation:** Re-ran `npm run test -- tests/components/editors/MarkdownEditor.test.ts` — 12/12 passed. Package remains **1.0.5** with `marked@^18.0.14` and `dompurify@^3.4.16`. `dist/index.js` inlines both and still exports `MarkdownEditor`.
