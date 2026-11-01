# F058 – Move npm registry configuration and release scripts to GitHub Packages

**Status**: Pending

**Type**: Feature

**Depends On**: F057

**Description**: Remove AWS/CodeArtifact and deliver versioned SPA utils through GitHub — move npm registry configuration and release scripts to github packages.

**Issue**: [I-US01](https://github.com/mentor-forge/mentorhub_spa_utils/issues/43)

## Path anchoring

All output paths are relative to this repository root. Sibling references are read-only context permitted by the repo planning guide.

## Context

- `README.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `../mentorhub/DeveloperEdition/standards/ArchitecturePrinciples.md`
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `../mentorhub/DeveloperEdition/standards/spa_standards.md`
- `package.json`
- `package-lock.json`
- `.npmrc.example`
- `.gitignore`
- `scripts/publish-package.sh`
- `scripts/tag-release.sh`

Source issue is authoritative for this migration. The agreed migration supersedes old CodeArtifact-auth prerequisites only in the paths explicitly migrated by these tasks; do not rewrite unrelated framework rules.

## Goals

- Use tracked .npmrc.example or a tracked token-free .npmrc to scope @mentor-forge to npm.pkg.github.com with an environment placeholder; public npm serves third-party dependencies. Never include local ignored token values in outputs.
- Update publishConfig and publish-package.sh for GitHub npm, GITHUB_TOKEN/NODE_AUTH_TOKEN as documented, and tag-release.sh version/permanent-tag guards. Preserve Stage0 commands and no-op delete-package. Reject duplicate versions; do not publish during implementation.
- Regenerate package-lock.json against public npm for third-party dependencies; remove CodeArtifact resolved URLs. Keep exact Cypress pins, existing overrides and package API/export surface.

### Craftsmanship Expectations

Keep package, auth and deployment ownership in the existing shared modules. Preserve APIs and runtime contracts unless the recorded migration decision explicitly requires a change; remove obsolete AWS auth knowledge rather than duplicate it. Keep every dependency reference reproducible.

## Testing Expectations

These checks are for future execution; none were run while creating this plan.

- npm install --include=dev then npm ci, npm run test and npm run build; inspect npm pack contents, JS/types/CSS/Cypress exports. Test credential/duplicate-version errors with mocks, without real publication or token logs.

## Outputs

- `package.json`
- `package-lock.json`
- `.npmrc.example`
- `.gitignore`
- `scripts/publish-package.sh`
- `scripts/tag-release.sh`
- `tests/release/package-distribution.test.ts`

Only these implementation files may change. The orchestrator may also update/rename this task record under the established lifecycle.

## Execution boundary

This is a reviewable plan, not an execution record. Execute only this task's listed outputs when orchestration is separately authorized. Do not touch excluded MongoDB/Runbook utility repos, publish packages/tags, mutate issue/project state, or delete/provision AWS resources as a side effect. Future workflow publication happens only through the reviewed maintainer release path.

Where a task requires an unpublished release, unavailable live schema or operator evidence, stop execution at that prerequisite and report it; do not guess values or substitute the unrelated PyPI api-utils package. Pending status describes the plan's review state, not proof that external execution gates are satisfied.

## External prerequisites

The cloud-agnostic local deployment boundary is coordinated in https://github.com/mentor-forge/mentorhub/issues/80; production provider selection does not gate this release. Consumer cutover follows the maintainer-authorized publication of this repo's release; editing consumer repos is outside this plan.

## Cloud-agnostic deployment boundary

The deliverable is a cloud-agnostic **local** deployment plus the agreed GitHub dependency/build migration. Existing identity/hosting implementations are largely placeholders: audit actual executable dependencies before proposing changes. Selecting, implementing or migrating to a production IdP/hosting provider is not a prerequisite for library releases, journey package/build/CI changes or local acceptance.

Keep application-facing backing-service contracts and environment settings provider neutral. Concentrate necessary integration changes in Admin API and DeveloperEdition/docker-compose.yaml where inspection proves coupling; preserve the existing shared JWT/redirect contracts and local persona/mocked-service behavior. Do not create per-journey provider adapters, new identity schemas or a general multi-cloud framework speculatively.

Cloud-specific provisioning, backing-service configuration, identity-provider wiring, roles/secrets and deployment overlays belong to the relevant infrastructure repo: mentorhub_cloudformation owns AWS, including future CodeArtifact provisioning. Future separate repos may implement Google, Microsoft/Azure, IBM or Red Hat platforms against the same contracts; do not create or implement them in this effort. Core compose must not require AWS accounts, credentials or endpoints. A locally optional emulator is not a live AWS dependency; retain it only if useful without making it a required cloud-specific integration.

AWS inventory, secure backup/restore evidence and separately approved decommissioning remain I-S01 responsibilities. Production provider selection or a live production cutover is future infrastructure/integration work, not an acceptance gate for the cloud-agnostic local stack.

## Execution Notes

Reserved for the execution agent. No implementation, tests, service changes or publication have been performed.
