# F056 – Patch version 1.0.6

**Status**: Shipped  
**Type**: Feature  
**Depends On**: F055  
**Description**: Bump `@mentor-forge/mentorhub_spa_utils` from **1.0.5** to **1.0.6** after `DataCardGrid` and the rendered `MarkdownEditor` are packaged and the shared list `CardGrid` is removed.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `package.json`, `package-lock.json`, `README.md`, `dist/...` (generated), `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md`
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `CONTRIBUTING.md` — Versioning and release (`npm run patch`, no git tag from the version script)
- the status-prefixed task records matching F050–F055
- `tasks/SHIPPED.F046.patch_version_1_0_1.md` — prior patch-version verification pattern
- `README.md` — install example currently `@mentor-forge/mentorhub_spa_utils@1.0.5`
- `package.json`
- `package-lock.json`
- `src/components/index.ts`

GitHub: [issue #33](https://github.com/mentor-forge/mentorhub_spa_utils/issues/33), [issue #41](https://github.com/mentor-forge/mentorhub_spa_utils/issues/41)

The planned starting version is **1.0.5**. Re-read both package files at execution time. Maintainer decision: ship as **patch `1.0.6`**. `MarkdownEditor` keeps its export and props. List `CardGrid` already lives in Discovery, and journey SPAs no longer take that export from this package. Use **`npm run patch`**. Stop and ask the developer if repository state would make `npm run patch` produce any version other than **1.0.6**.

## Goals

- Confirm F050–F055 are shipped: `DataCardGrid` exported, `MarkdownEditor` renders sanitized markdown, demo/Cypress/docs/ISSUE seeds done, `CardGrid` absent.
- Run `npm run patch` so `package.json` and `package-lock.json` are synchronized at exactly **1.0.6**.
- Update the README install example to `@mentor-forge/mentorhub_spa_utils@1.0.6`.
- Note **1.0.6** on the `DataCardGrid` and rendered `MarkdownEditor` docs, and note that shared `CardGrid` left the package in **1.0.6**. Do not rewrite those contracts.
- Verify declarations export `DataCardGrid`, `MarkdownEditor`, `MhCard`, and `DataCard`, and do not export `CardGrid`.
- Do not publish, tag, push a release tag, or change downstream SPA dependencies. The orchestrator opens the PR; a human tags and publishes from `main` per `CONTRIBUTING.md`.

### Craftsmanship Expectations

- Version metadata and the **1.0.6** README labels only. Do not restyle components or reopen the `CardGrid` API in this task.

## Testing Expectations

Run all commands from this repository root.

- Run `mh` first if CodeArtifact credentials are required.
- `npm run patch` and confirm the result is exactly `1.0.6`.
- `npm install --include=dev` only if lockfile synchronization requires it.
- `npm run test`
- `npm run test:coverage` (record known unrelated threshold failures separately)
- `npm run lint`
- `npm run build`
- Inspect `dist/index.d.ts` and `dist/components/index.d.ts` for the export checks in Goals.
- Confirm `package.json`, the root package entry in `package-lock.json`, and the README install example all say `1.0.6`.

## Outputs

- `package.json`
- `package-lock.json`
- `README.md` — install/version references and **1.0.6** labels only

The agent must not edit implementation, tests, demo/Cypress behavior, ISSUE seeds, release scripts, tags, downstream repositories, or CodeArtifact in this task.

## Execution Notes

### Plan

1. Confirmed F050–F055 are `SHIPPED.*`; `package.json` / lockfile root are **1.0.5**. `npm run patch` (`npm version patch --no-git-tag-version`) should yield exactly **1.0.6**.
2. Run `mh` if CodeArtifact auth is needed, then `npm run patch`. Abort if result ≠ `1.0.6`.
3. Update README: install/adopt pins `@1.0.5` → `@1.0.6`; add **1.0.6** labels on `DataCardGrid` and rendered `MarkdownEditor` docs; note shared `CardGrid` left the package in **1.0.6**. Do not rewrite those contracts.
4. Verify: `npm run test`, `test:coverage`, `lint`, `build`; inspect dist for `DataCardGrid`, `MarkdownEditor`, `MhCard`, `DataCard`; confirm no `CardGrid`.
5. No publish/tag/push/commit/rename/Status=Shipped. No implementation, tests, demo, Cypress, or ISSUE seed edits. Record Results here.

### Results

- **Outcome: success**. Version bump is exactly **1.0.6**.
- **Version**: `npm run patch` from 1.0.5 produced **v1.0.6**. `package.json` version, lockfile root (`""` package), and README install/adopt pins are **1.0.6**.
- **README labels**: install `@1.0.6`; PageFrame adopt pin `@1.0.6`; `DataCardGrid` heading notes **added in 1.0.6**; `MarkdownEditor` notes **1.0.6** rendered resting view; Preferred UI notes shared **`CardGrid` left this package in 1.0.6**. Contracts not rewritten.
- **Edited files**: `package.json`, `package-lock.json`, `README.md` (install/version labels only), plus this Execution Notes section.
- **Not done** (by design): no publish, tag, push, commit, rename, Status=Shipped, implementation/tests/demo/Cypress/ISSUE seeds.

### Commands

- `mh` — CodeArtifact auth refreshed
- `npm run patch` — `v1.0.6`
- `npm run test` — 41 files, **447** tests passed
- `npm run test:coverage` — 447 tests passed; **pre-existing** `src/utils/**` threshold failures only (`admin.ts` 32% stmts / 16.66% funcs, `urlAuthBootstrap.ts` 12% lines, `idpRedirect.ts` 83.92% lines under the 100% utils threshold). Exit code 1 from thresholds only.
- `npm run lint` — **blocked**: `eslint: command not found` (pre-existing; eslint is not a package.json dependency). Exit 127.
- `npm run build` — succeeded (`dist/index.js` 198.60 kB, `dist/index.css` 6.80 kB)

### Dist export verification

- `dist/components/index.d.ts` exports `MhCard`, `DataCardGrid`, `DataCard`, `MarkdownEditor`.
- `dist/index.js` named exports include `DataCard`, `DataCardGrid`, `MarkdownEditor`, `MhCard`.
- No `\bCardGrid\b` anywhere under `dist/`.

**Orchestrator confirmation:** `package.json`, lockfile root, and `packages[""].version` are **1.0.6**. README install example is `@mentor-forge/mentorhub_spa_utils@1.0.6`. Re-ran `npm run test` — **447/447** passed (41 files). `dist/components/index.d.ts` exports `DataCardGrid`, `MarkdownEditor`, `MhCard`, and `DataCard`, and does not export `CardGrid`.
