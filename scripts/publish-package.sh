#!/usr/bin/env sh
# Build and publish to CodeArtifact (mentorhub-npm).
# Targets: Specifications/aws-platform.yaml — override via env if needed.
set -e

root=$(cd "$(dirname "$0")/.." && pwd)
cd "$root"

npm ci
npm run build

aws codeartifact login --tool npm \
  --domain "${CODEARTIFACT_DOMAIN:-mentor-forge}" \
  --domain-owner "${AWS_SHARED_SERVICES_ACCOUNT_ID:-560167829275}" \
  --repository "${CODEARTIFACT_NPM_REPO:-mentorhub-npm}" \
  --region "${AWS_REGION:-us-east-1}" \
  --profile "${MH_AWS_PROFILE_SHARED:-mentorhub-shared}"

npm publish
