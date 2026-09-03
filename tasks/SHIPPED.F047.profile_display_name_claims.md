# F047 – Show display_name in profile chrome and Token claims

**Status**: Shipped  
**Type**: Feature  
**Depends On**: F046  
**Description**: Surface JWT `display_name` in the packaged profile chrome and Config Token tab without inventing local fallback claim mappings.

## Path anchoring

All paths in this task are relative to **this spa_utils repository root** (the directory that contains `package.json`).

Sibling repos must all be sibling folders under a common parent.

Standards: `../mentorhub/DeveloperEdition/standards/spa_standards.md`

In-repo: `README.md`, `src/components/...`, `src/composables/...`, `tests/...`, `tasks/...`

## Context

Always read these files before implementation:

- `../mentorhub/DeveloperEdition/standards/spa_standards.md`
- `../mentorhub/DeveloperEdition/standards/sre_standards.md`
- `tasks/_PLANNING.md`
- `tasks/_ORCHESTRATE.md`
- `README.md` — current Universal PageFrame and Admin/Token documentation
- `src/components/PageFrame.vue` — authenticated app bar currently renders avatar/profile link only
- `src/composables/universalNav.ts` — JWT claim readers currently expose `resolveCustomerDisplayName()` and `readProfilePicture()`
- `src/components/admin/TokenClaimsCard.vue` — Token tab currently shows `remote_ip`, `profile_id`, `customer_id`, `mentor_id`, and roles
- `tests/components/PageFrame.test.ts`
- `tests/components/TokenClaimsCard.test.ts`
- `tests/composables/universalNav.test.ts`

GitHub: [issue #36](https://github.com/mentor-forge/mentorhub_spa_utils/issues/36)

External prerequisite for live/manual verification only: upstream auth/token producers should emit JWT `display_name`. Do **not** synthesize `display_name` from `name`, `given_name`, `email`, `user_id`, or `sub` inside spa_utils. Unit tests in this task should provide explicit token fixtures.

## Goals

- `PageFrame` shows the JWT `display_name` adjacent to the authenticated profile avatar/link when the claim is present and non-blank.
- Preserve the current avatar behavior: `picture` claim still wins for the image, fallback remains `mdi-account`, and the profile link still targets `buildJourneyUrl('customer', 'profile')`.
- When `display_name` is absent, blank, malformed, or localStorage/JWT parsing fails, keep the current compact avatar-only behavior rather than rendering a fabricated placeholder name.
- Add a stable automation id for the visible profile name text so downstream SPAs and Cypress can assert it without coupling to Vuetify internals.
- `TokenClaimsCard` adds a read-only `display_name` field alongside the existing `profile_id`, `customer_id`, `mentor_id`, IP Address, and Roles sections.
- Missing `display_name` in `TokenClaimsCard` displays `N/A`, matching the other read-only claim fields.
- Add/update focused unit tests covering:
  - `display_name` present on `PageFrame`
  - blank/missing `display_name` on `PageFrame`
  - `picture` behavior unchanged
  - `display_name` present on `TokenClaimsCard`
  - `display_name` missing on `TokenClaimsCard` -> `N/A`
  - negative cases proving no fallback from unrelated claim keys

### Craftsmanship Expectations

- Keep JWT decoding/claim normalization in shared helpers rather than duplicating parsing logic inside `PageFrame` and `TokenClaimsCard`.
- Reuse existing token-reading patterns in `universalNav.ts` and `admin.ts`; do not add a second ad hoc JWT parser.
- Treat `display_name` as authoritative only when the claim is explicitly present and non-empty.

## Testing Expectations

Run all commands from **this spa_utils repository root**.

- Update `tests/components/PageFrame.test.ts` to assert the new profile-name text/automation id, the existing avatar/profile-link behavior, and the missing-claim compact fallback.
- Update `tests/components/TokenClaimsCard.test.ts` to assert the new `display_name` field and missing-claim `N/A` behavior.
- Update `tests/composables/universalNav.test.ts` if a shared helper is added or extended for reading `display_name`.
- `npm run test`
- `npm run build`

## Outputs

- `src/components/PageFrame.vue`
- `src/composables/universalNav.ts`
- `src/components/admin/TokenClaimsCard.vue`
- `tests/components/PageFrame.test.ts`
- `tests/components/TokenClaimsCard.test.ts`
- `tests/composables/universalNav.test.ts`

The agent must not update files outside this list.

## Execution Notes

**Plan**
- Add `readDisplayName()` in `universalNav.ts` using the existing JWT decode/`claimString` path; read only `display_name` (no `name`/`given_name`/`email`/`user_id`/`sub` fallbacks).
- `PageFrame` shows that value next to the avatar inside `nav-profile-link` when present/non-blank; omit the name node otherwise. Automation id: `nav-profile-name-display`. Avatar/`picture`/`mdi-account`/profile href unchanged.
- `TokenClaimsCard` adds a read-only `display_name` field via `getTokenValue`/`claimDisplay`, `N/A` when missing, automation id `admin-token-display-name-display`.
- Tests cover present/blank/missing, unchanged `picture`, Token `N/A`, and negative unrelated-claim keys.

**Completion**
- Implemented as planned. `readDisplayName()` is the single claim reader; PageFrame and TokenClaimsCard do not parse JWTs themselves.
- `npm run test`: 40 files, 443 passed.
- `npm run build`: succeeded (`@mentor-forge/mentorhub_spa_utils@1.0.2`).
- Not committed; filename left `PENDING.F047.*`.

**Follow-on for F048**
- Chrome automation id: `nav-profile-name-display` (inside `nav-profile-link`; omitted when claim is blank/missing).
- Token tab automation id: `admin-token-display-name-display` (missing → `N/A`).
- README still documents avatar/`picture` only and Token ids without `display_name` — F048 owns docs + Cypress.
- `readDisplayName` is exported from `universalNav.ts` but not re-exported from `src/composables/index.ts` (out of this Outputs list). Demo should use packaged `PageFrame`/`TokenClaimsCard`, not a local helper.
- Live DE tokens may still lack `display_name`; Cypress should stub/intercept token fixtures.

