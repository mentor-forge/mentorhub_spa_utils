# F049 – Patch version 1.0.3 for display_name

**Status**: Pending  
**Type**: Feature  
**Depends On**: F048  
**Description**: Bump `@mentor-forge/mentorhub_spa_utils` from **1.0.2** to **1.0.3** after the `display_name` feature and its browser/documentation coverage are complete.

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
- `CONTRIBUTING.md` — Versioning and release workflow
- `README.md` — install/version references
- `package.json`
- `package-lock.json`
- `src/components/PageFrame.vue`
- `src/components/admin/TokenClaimsCard.vue`
- `tasks/PENDING.F047.profile_display_name_claims.md` (or `SHIPPED.F047.*`)
- `tasks/PENDING.F048.demo_docs_display_name_coverage.md` (or `SHIPPED.F048.*`)
- `tasks/SHIPPED.F046.patch_version_1_0_1.md` — recent patch-version verification pattern

GitHub: [issue #36](https://github.com/mentor-forge/mentorhub_spa_utils/issues/36)

The planned starting version is **1.0.2**. Re-read both package files at execution time. Stop and ask the developer if repository state would make `npm run patch` produce any version other than **1.0.3**.

## Goals

- Confirm F047 and F048 are shipped: packaged `display_name` behavior, README updates, and Cypress/browser verification all complete.
- Run the repository patch-version command so `package.json` and `package-lock.json` are synchronized at exactly **1.0.3**.
- Update README install/version examples to `@mentor-forge/mentorhub_spa_utils@1.0.3` if they still reference `1.0.2`.
- Verify the generated dist artifacts still export the packaged components used by downstream SPAs, including `PageFrame`, `AdminPage`, and `TokenClaimsCard`.
- Perform complete pre-release test/build verification before any publish/tag work.
- Do not publish, tag, or update sibling repositories in this task.

### Craftsmanship Expectations

- Limit the scope to release/version metadata, generated package artifacts, and README install/version references needed for the patch release.
- Do not mix in additional feature, demo, Cypress, or downstream task edits.

## Testing Expectations

Run all commands from this repository root.

- Run `mh` first if CodeArtifact credentials are required.
- `npm run patch` and confirm the result is exactly `1.0.3`.
- `npm install --include=dev` only if lockfile synchronization requires it.
- `npm run test`
- `npm run test:coverage` (record unrelated pre-existing threshold/tooling gaps separately)
- `npm run lint`
- `npm run build`
- Inspect `dist/index.d.ts`, `dist/components/index.d.ts`, and relevant `dist` outputs for `PageFrame`, `AdminPage`, and `TokenClaimsCard`.

## Outputs

- `package.json`
- `package-lock.json`
- `README.md` — install/version references only

The agent must not edit implementation, tests, demo/Cypress behavior, sibling repositories, or publishing/tagging scripts in this task.

## Execution Notes

