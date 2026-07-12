# F014 – Bump package version for auth redirect and useAuth release

**Status**: Pending  
**Type**: Feature  
**Depends On**: F013  
**Description**: Bump `@mentor-forge/mentorhub_spa_utils` version for the shared auth composable and reliable IdP redirect changes.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `README.md`
- `package.json`
- `package-lock.json`

## Goals

- Version bumped appropriately for new exported `useAuth` composable and changed `redirectToIdpLogin` behavior (minor bump: `0.3.0` → `0.4.0` unless execution agent determines patch is sufficient).
- `package-lock.json` updated to match.
- No other functional code changes in this task.

## Testing Expectations

Run all commands from **this spa_utils repository root**.

- `npm install --include=dev`
- `npm run test`
- `npm run build` — packaging verification

## Outputs

- `package.json` — version field
- `package-lock.json` — lockfile version sync

The agent must not update files outside this list.

## Execution Notes

_Reserved for the task execution agent._
