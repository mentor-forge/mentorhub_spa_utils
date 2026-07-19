# D035 – Document component stylesheet packaging for consumers

**Status**: Shipped  
**Type**: Defect  
**Depends On**: D034  
**Description**: Document how domain SPAs obtain `@mentor-forge/mentorhub_spa_utils` component styles (automatic with the JS import, or the required style entry), especially so `CardGrid` CSS Grid / equal-height layout works outside the demo app.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `README.md`, `package.json`, `src/...`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md`
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `tasks/PENDING.D034.package_component_styles.md` (or `SHIPPED.D034...` after D034 completes) — chosen packaging approach
- `README.md` — install examples, MhCard / CardGrid / DataCard section, harvesting workflow
- `package.json` — final `exports` / style entry after D034
- `src/components/CardGrid.vue`
- `CONTRIBUTING.md` — only if release/install docs need a cross-link

## Goals

- Document the consumer requirement for component CSS in the README near install usage and/or the MhCard / CardGrid section.
- If D034 achieved **automatic** style loading: state that importing from the package root (and `./components` if true there too) pulls in component styles; note any bundler constraints (e.g. Vite, `sideEffects`).
- If D034 shipped a **manual** style entry: give the exact import consumers must add once at app bootstrap, e.g. `import '@mentor-forge/mentorhub_spa_utils/style.css'`, and call out that omitting it yields single-column / non-equal-height `CardGrid` markup.
- Clarify that `CardGrid` layout rules live in the package stylesheet (not Vuetify), so the JS-only import was insufficient in `0.5.3`.
- Keep docs domain-independent (no Paths/journey content).
- Do not change packaging implementation, version, or publish in this task.

## Testing Expectations

Run all commands from this repository root.

- Manually compare README claims with the `package.json` `exports` / entry behavior produced by D034.
- Confirm install and CardGrid examples match the chosen automatic vs manual style approach.
- `npm run test`
- `npm run build`

## Outputs

- `README.md`

The agent must not edit component implementation, packaging beyond what D034 already shipped, package versions, publishing workflows, or any journey SPA in this task.

## Execution Notes

### Plan

1. Confirm D034 packaging from `SHIPPED.D034` + `package.json`: automatic CSS via root `dist/index.js` → `import './index.css'`; `sideEffects: ["**/*.css"]`; optional `exports["./style.css"]` → `./dist/index.css`. Note `./components` is not the CSS injection target.
2. Update `README.md` near Usage / MhCard·CardGrid and the package import example:
   - Root import `{ CardGrid }` pulls component CSS for Vite consumers (sideEffects).
   - Optional explicit `import '@mentor-forge/mentorhub_spa_utils/style.css'`.
   - Call out that in published `0.5.3` JS-only import left layout CSS unlinked in `dist/index.css` (single-column / non-equal-height).
   - Layout rules live in the package stylesheet (not Vuetify); keep domain-independent.
3. Manually compare README claims to `package.json` exports/sideEffects.
4. Run `npm run test` and `npm run build`.
5. Record results; mark Shipped; rename to `SHIPPED.D035.document_component_style_entry.md`.

### Results

- **README updates** (`README.md` only):
  - Usage: document automatic root CSS via `dist/index.js` → `import './index.css'` + `sideEffects: ["**/*.css"]`; optional `import '@mentor-forge/mentorhub_spa_utils/style.css'` (`exports["./style.css"]` → `./dist/index.css`); note that published `0.5.3` JS-only import left layout CSS unlinked.
  - MhCard / CardGrid: layout rules live in package stylesheet (not Vuetify); root import pulls CSS for Vite; omit → single-column / non-equal-height.
  - Import example: prefer package root for CSS; `./components` needs explicit `style.css` if used.
- **Manual compare**: README claims match `package.json` (`./style.css` → `./dist/index.css`, `sideEffects: ["**/*.css"]`) and built `dist/index.js` starting with `import './index.css';`.
- **Tests**: `npm run test` — **385 passed** (37 files).
- **Build**: `npm run build` — succeeded; CSS inject present on `dist/index.js`.
- **Version/publish/packaging**: unchanged (still `0.5.3`); no journey SPA edits.
- **Blockers**: none.
