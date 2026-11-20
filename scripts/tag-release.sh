#!/usr/bin/env sh
# Create a permanent tag for the version at the current origin/main tip.
set -eu

root=$(cd "$(dirname "$0")/.." && pwd)
cd "$root"

case "$#:${1:-}" in
  0:|1:--no-push) ;;
  *) echo 'Usage: npm run tag-release -- [--no-push]' >&2; exit 1 ;;
esac

version=$(node -p "require('./package.json').version")
lock_version=$(node -p "const lock = require('./package-lock.json'); lock.version === lock.packages[''].version ? lock.version : ''")
if [ -z "$version" ] || [ "$version" != "$lock_version" ]; then
  echo 'The package and lockfile versions must agree before tagging.' >&2
  exit 1
fi
tag="v${version}"
git check-ref-format "refs/tags/$tag"

if [ "$(git branch --show-current)" != main ]; then
  echo 'Switch to main before tagging a release.' >&2
  exit 1
fi
if [ -n "$(git status --porcelain)" ]; then
  echo 'Working tree has uncommitted changes. Commit or stash before tagging.' >&2
  exit 1
fi

origin_head=$(git ls-remote origin refs/heads/main)
origin_commit=$(printf '%s\n' "$origin_head" | cut -f 1)
if [ "$(git rev-parse HEAD)" != "$origin_commit" ]; then
  echo 'Sync main with origin before tagging a release.' >&2
  exit 1
fi
if git show-ref --verify --quiet "refs/tags/$tag"; then
  echo "Tag $tag already exists locally." >&2
  exit 1
fi
remote_tag=$(git ls-remote --tags origin "refs/tags/$tag")
if [ -n "$remote_tag" ]; then
  echo "Tag $tag already exists on origin." >&2
  exit 1
fi

git tag "$tag"
echo "Created tag $tag"

if [ "${1:-}" = "--no-push" ]; then
  echo "Push manually: git push origin refs/tags/$tag"
  exit 0
fi

git push origin "refs/tags/$tag"
echo "Pushed $tag. GitHub Actions will publish the release to GitHub Packages."
