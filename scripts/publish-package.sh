#!/usr/bin/env sh
# Prepare and publish to GitHub Packages using an operator's npm credentials.
set -eu

root=$(cd "$(dirname "$0")/.." && pwd)
cd "$root"

NODE_AUTH_TOKEN="${NODE_AUTH_TOKEN:-${GITHUB_TOKEN:-}}"
if [ -z "$NODE_AUTH_TOKEN" ]; then
  echo 'Set NODE_AUTH_TOKEN or GITHUB_TOKEN with GitHub Packages publish access.' >&2
  exit 1
fi
export NODE_AUTH_TOKEN

package=$(node -p "const { name, version } = require('./package.json'); name + '@' + version")
scratch=$(mktemp -d)
trap 'rm -rf "$scratch"' EXIT
trap 'exit 1' HUP INT TERM

cp .npmrc.example "$scratch/npmrc"
export NPM_CONFIG_USERCONFIG="$scratch/npmrc"

# Run registry commands outside the checkout so an old local .npmrc cannot
# redirect publishing or supply stale credentials.
if (cd "$scratch" && npm view "$package" version --json) >"$scratch/view.json" 2>"$scratch/view.err"; then
  if [ -s "$scratch/view.json" ]; then
    echo "$package already exists in GitHub Packages." >&2
    exit 1
  fi
elif ! grep -Eq '"code"[[:space:]]*:[[:space:]]*"E404"' "$scratch/view.json"; then
  echo "Could not check whether $package exists. Verify GitHub Packages access and retry." >&2
  exit 1
fi

# npm ci invokes prepare and builds dist. Publish the resulting tarball without
# rerunning lifecycle scripts.
npm ci --include=dev
npm pack --ignore-scripts --pack-destination "$scratch"
set -- "$scratch"/*.tgz
if [ "$#" -ne 1 ] || [ ! -f "$1" ]; then
  echo 'Expected exactly one package tarball.' >&2
  exit 1
fi
(cd "$scratch" && npm publish "$1" --ignore-scripts)
