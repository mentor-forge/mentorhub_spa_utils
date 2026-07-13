# F024 – Bump spa_utils package version for cards and type editors

**Status**: Shipped  
**Type**: Feature  
**Depends On**: F023  
**Description**: Bump `@mentor-forge/mentorhub_spa_utils` to **`0.5.0`** (additive minor release) reflecting the new Card/DataCard/editor public API, and ensure package exports and changelog/README version references stay consistent.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Sibling repos must all be sibling folders under a common parent.

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `package.json`, `package-lock.json`, `README.md`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md` — Dependency Management
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `README.md`
- `package.json`
- `tasks/SHIPPED.F014.bump_version.md` — prior bump pattern
- `tasks/SHIPPED.F015.peer_review_card_editor_approach.md` — semver decision: additive minor `0.5.0`; no `AutoSaveField` rename

**Semver (F015 locked):** Additive public components → **minor** bump (`0.4.1` → **`0.5.0`**). `AutoSaveField` export name retained (compatibility wrapper). Not a breaking major.

## Goals

- Update `package.json` / `package-lock.json` version to `0.5.0`.
- Confirm `exports` already expose new components via `./components` (fix if any additional entry points were added).
- Align any version badges or install examples in README if they pin the prior version.
- Do not publish or tag from this task — orchestrator / developer release process handles publish after PR merge.

## Testing Expectations

Run all commands from **this spa_utils repository root**.

- `mh` then `npm install --include=dev` if lockfile changes require it
- `npm run test`
- `npm run build`

## Outputs

- `package.json`
- `package-lock.json`
- `README.md` — only if version pins/examples must match

The agent must not create downstream ISSUE files (F025).

## Execution Notes

### Results
- Bumped `@mentor-forge/mentorhub_spa_utils` to **0.5.0** (`package.json` / lockfile).
- No README version pins required changing.
- `npm run test` and `npm run build` passed.
- Publish/tag left for post-merge release process.
