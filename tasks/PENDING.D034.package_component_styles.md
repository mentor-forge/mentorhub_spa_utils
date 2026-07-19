# D034 – Package component styles for CardGrid consumers

**Status**: Pending  
**Type**: Defect  
**Depends On**: none  
**Description**: Fix library packaging so domain SPAs that import `{ CardGrid }` (and other styled components) from `@mentor-forge/mentorhub_spa_utils` receive the CSS Grid / equal-height rules that currently exist only as an unlinked `dist/index.css` artifact.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `package.json`, `package-lock.json`, `vite.config.ts`, `src/...`, `dist/...` (generated), `README.md`, `tests/...`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md`
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `tasks/SHIPPED.F029.harvest_responsive_card_grid.md` — notes that build emits `dist/index.css` with 1→8 grid rules
- `tasks/SHIPPED.F032.patch_version_responsive_card_grid.md` — current package version `0.5.3`
- `tasks/BLOCKED.F033.publish_responsive_card_grid.md` — publish gate for `0.5.3` (may still be unpublished)
- `README.md` — current CardGrid contract (assumes layout CSS is available)
- `package.json` — `exports` today expose only JS/types entry points; no CSS export
- `vite.config.ts` — library build (`lib.entry` → `src/index.ts`)
- `src/index.ts`
- `src/components/index.ts`
- `src/components/CardGrid.vue` — scoped CSS Grid rules (source of the missing consumer styles)
- `src/components/MhCard.vue` — also contributes scoped styles into the same extracted CSS bundle
- `tests/components/CardGrid.test.ts`

### Defect summary

In `0.5.3`, Vite library build extracts component styles (including `.mh-card-grid` CSS Grid, equal-height expanded cards, and collapsed non-stretch rules) into `dist/index.css`. The package root JS export does **not** import or re-export that stylesheet, and `package.json` `exports` has no CSS entry. Consumers that do:

```ts
import { CardGrid } from '@mentor-forge/mentorhub_spa_utils'
```

receive markup (`.mh-card-grid` / `.mh-card-grid__item`) without layout CSS → single-column / non-equal-height rendering.

### Relation to F033

This defect chain is independent of F033. If `0.5.3` is not yet published, a human may later choose to fold the packaging fix into the first CodeArtifact release; the planned follow-on patch in D036 still targets one patch increment from the version present at execution time (expected `0.5.3` → `0.5.4`).

## Goals

- Prefer **automatic** style delivery: after `import { CardGrid } from '@mentor-forge/mentorhub_spa_utils'` (and/or `.../components`), a consuming Vite SPA build receives the component stylesheet without a separate manual CSS import.
- Acceptable fallback if automatic injection is unreliable for this library build: add an explicit package export for the stylesheet (e.g. `./style.css` → `dist/index.css`) that consumers must import once at app bootstrap, and ensure D035 documents that requirement clearly.
- Update packaging metadata as needed so the CSS file is published and resolvable:
  - `package.json` `exports` (and `files` if required)
  - `sideEffects` (or equivalent) so bundlers do not tree-shake away CSS side-effect imports
  - `vite.config.ts` / build plugins only if required to emit a JS→CSS link from the library entry
- Confirm `dist/index.css` (or the chosen exported CSS path) still contains the CardGrid 1→8 grid, equal-track, expanded-stretch, and collapsed non-stretch rules after the packaging change.
- Confirm MhCard / other scoped component styles that share the same extracted CSS continue to ship with the package (do not split CardGrid-only CSS unless necessary).
- Do **not** change CardGrid layout behavior, props, slot contract, or breakpoint rules in this task — packaging/delivery only.
- Do **not** bump the package version, tag, or publish in this task (D036 / D037).
- Do **not** edit journey SPAs.

## Testing Expectations

Run all commands from this repository root.

- Run `mh` first if CodeArtifact credentials are required.
- `npm install --include=dev` only if packaging/build dependencies change.
- `npm run test` — existing CardGrid / MhCard unit tests still pass.
- `npm run build` — Packaging verification; confirm:
  - `dist/index.css` (or chosen CSS artifact) exists and includes `.mh-card-grid` / grid-template / collapsed rules.
  - Package root (and `./components` if applicable) JS either imports that CSS or the documented style export resolves to it.
  - `package.json` `exports` exposes the chosen CSS entry when a manual style entry is part of the solution.
- Add or extend a packaging/unit assertion if practical (e.g. built `dist/index.js` contains a CSS side-effect import, or package `exports` maps `./style.css`). Prefer a durable check over a one-off manual note when low-cost.
- Manual smoke (optional but recommended): from the in-repo demo (`npm run dev`), confirm dashboard CardGrid still lays out correctly after the packaging change (demo already pulls styles via Vite app pipeline; regression check for local build breakage).
- `npm run lint` if the toolchain provides eslint in this environment; record pre-existing gaps separately.

## Outputs

- `package.json` — `exports`, `sideEffects`, and any other packaging fields required for CSS delivery
- `package-lock.json` — only if a build dependency is added for CSS injection
- `vite.config.ts` — only if a build/plugin change is required
- `src/index.ts` and/or `src/components/index.ts` — only if a CSS side-effect import is added at source
- Any new small helper CSS entry under `src/` only if needed to anchor the export
- `tests/...` — packaging or build-contract test(s) if added
- This task file’s Execution Notes / status on completion

The agent must not edit CardGrid layout CSS rules for behavior changes, README consumer docs (D035), package semver (D036), release scripts/tags, or any journey SPA.

## Execution Notes
