# D035 – Document component stylesheet packaging for consumers

**Status**: Pending  
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
