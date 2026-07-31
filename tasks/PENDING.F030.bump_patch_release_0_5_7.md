# F030 – Bump patch to 0.5.7 and open release PR

Status: Pending
Type: Feature
Depends On: F029
Description: After manual approval of container IdP redirect behavior (mentorhub S45), bump spa_utils to **0.5.7**, commit, push, and open a PR for Mike to merge and tag.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root**.

## Context

- `tasks/PENDING.F029.runtime_idp_login_uri_resolution.md`
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

Record PR URL and branch name when complete.

