# F030 – Bump patch to 0.5.7 and open release PR

Status: Shipped
Type: Feature
Depends On: F029
Description: After manual approval of container IdP redirect behavior (mentorhub S45), bump spa_utils to **0.5.7**, commit, push, and open a PR for Mike to merge and tag.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root**.

## Context

- `tasks/SHIPPED.F029.runtime_idp_login_uri_resolution.md`
- `tasks/SHIPPED.F028.patch_version_enum_editors.md`
- `README.md`
- `package.json`
- `package-lock.json`

**External prerequisites (human gate):**

- mentorhub task **S45** approved — container redirect verified over MagicDNS with local spa_utils + mentee_spa L122/L123.

## Goals

- Bump `package.json` / `package-lock.json` version to **0.5.7**.
- Ensure CHANGELOG or README release notes mention runtime `IDP_LOGIN_URI` support and removal of loopback hostname rewrite.
- Commit on branch **`0.5.8-IDP-Login`** with a meaningful message.
- Push branch and open PR via `gh pr create`.
- **Do not merge** — Mike merges manually, tags the release, and confirms CI published to CodeArtifact (see F031).

## Testing Expectations

- `npm run test`
- `npm run build`
- `npm run lint`
- Verify package exports still include `getIdpLoginBaseUrl`, `redirectToIdpLogin`, etc.

## Outputs

- `package.json`
- `package-lock.json`
- `README.md` — version / release note if maintained here

## Execution Notes

**Commands**
- Starting version **0.5.6** → `npm run patch` → **0.5.7**
- `npm run test` → **394/394 passed**
- `npm run build` → OK
- `npm run lint` → **blocked**: `eslint` not on PATH (same tooling gap as F029)
- Exports verified in `dist/utils/idpRedirect.d.ts`: `getIdpLoginBaseUrl`, `redirectToIdpLogin`, `buildIdpLoginRedirectUrl`, `MENTORHUB_RUNTIME_CONFIG_KEY`, `MentorHubRuntimeConfig`

**Changes**
- `package.json` / `package-lock.json`: version **0.5.7**
- `README.md`: install example `@0.5.7`; release note under IdP resolution order (runtime config, removal of 0.5.6 loopback rewrite)

**Branch:** `0.5.8-IDP-Login`

**Commit:** `6197778` — Release 0.5.7: runtime IDP_LOGIN_URI for container IdP redirects.

**PR:** https://github.com/mentor-forge/mentorhub_spa_utils/pull/28

**Follow-up:** F031 — Mike merges PR, tags `v0.5.7`, confirms CodeArtifact publish.
