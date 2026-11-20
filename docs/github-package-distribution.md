# GitHub npm package distribution

## Current package

SPA Utils 1.0.6 publishes as `@mentor-forge/mentorhub_spa_utils` and requires Node 24 or later. Its published files include `dist`, `cypress`, the README and license. The root export includes the Vue library and generated CSS. The package also declares composables, components and utilities subpaths with JavaScript and TypeScript entries, a standalone stylesheet, and four Cypress helper exports packaged as TypeScript.

`npm run build` uses Vite for JavaScript and CSS and TypeScript for declarations. The `prepare` lifecycle runs the build during installs and packing from the repository. The release workflow must verify the finished tarball and publish that same file, so another lifecycle build cannot change the published contents.

The 1.0.6 dry-run pack contained the root JavaScript and declarations, stylesheet, all Cypress export targets, and declarations for the composables, components and utilities. The three corresponding JavaScript subpath targets were absent because Vite builds a single entry. Emit those files before release and have CI check every declared target in the packed artifact.

The old workflow and publish helper authenticate to CodeArtifact. The old `.npmrc.example` routes the Mentor Forge scope there. The lock resolves 425 third-party tarballs from public npm and three from CodeArtifact: `@types/trusted-types`, `dompurify`, and `marked`. An isolated install using public npm for those three exact versions succeeded with their existing integrity checks.

## Registry and access

Keep the package name and link it to `mentor-forge/mentorhub_spa_utils` through its repository metadata and publishing workflow. Route only `@mentor-forge` to GitHub Packages and leave public npm as the default for third-party dependencies.

Use a classic GitHub token with `read:packages` for local installs, supplied through a host-scoped npm config environment reference. The publisher workflow uses its repository-provided token with `packages: write`. After the first publication, a maintainer verifies or sets Public visibility in the package settings and grants each intended consumer repository read access under **Manage Actions access**. npm authentication is required even for the public package; consumer Actions use their own repository tokens with package read access.

- [GitHub npm registry authentication and publishing](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
- [GitHub package visibility and Actions access](https://docs.github.com/en/packages/learn-github-packages/configuring-a-packages-access-control-and-visibility)

## Authentication contract

The browser code has no executable AWS API calls, SDK imports, or AWS credential requirements in its login utilities. Login URI precedence is explicit override, runtime `IDP_LOGIN_URI`, build-time `VITE_IDP_LOGIN_URI`, then the Developer Edition welcome login. The redirect keeps the configured provider URL and sets `return_to` to the SPA destination. URL bootstrap consumes the existing token, expiry and role fields or clears seeded auth on request. `useAuth` reads and clears the same local browser storage. The README and tests use provider examples to exercise this configurable contract. Keep the interfaces and behavior intact.

## Release sequence and rollback

Merge the reviewed changes before tagging and publishing the matching version. Verify the package contents, visibility and access through a clean exact-version install. Consumers can then pin the verified GitHub-hosted version and commit the corresponding lockfile. To roll back, restore a verified GitHub-hosted version and its matching lockfile. The earliest supported rollback is the first GitHub-hosted release.
