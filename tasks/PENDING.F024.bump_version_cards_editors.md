# F024 – Bump spa_utils package version for cards and type editors

**Status**: Pending  
**Type**: Feature  
**Depends On**: F023  
**Description**: Bump `@mentor-forge/mentorhub_spa_utils` to the next appropriate semver reflecting the new Card/DataCard/editor public API (likely minor `0.5.0` unless F015 classified changes as patch-only), and ensure package exports and changelog/README version references stay consistent.

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
- Peer-review notes in F015 regarding breaking vs additive API

**Semver guidance (default):** Additive public components → **minor** bump (`0.4.1` → `0.5.0`). If AutoSaveField required a breaking rename without compatibility shim, treat as **minor** still while pre-1.0, and call out migration in README (already F023) and ISSUE.md (F025).

## Goals

- Update `package.json` / `package-lock.json` version.
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

(reserved for execution agent)
