#!/usr/bin/env sh
# Build and publish to CodeArtifact (mentorhub-npm).
# Targets: Specifications/aws-platform.yaml — override via env if needed.
set -e

root=$(cd "$(dirname "$0")/.." && pwd)
cd "$root"

domain="${CODEARTIFACT_DOMAIN:-mentor-forge}"
owner="${AWS_SHARED_SERVICES_ACCOUNT_ID:-560167829275}"
repo="${CODEARTIFACT_NPM_REPO:-mentorhub-npm}"
region="${AWS_REGION:-us-east-1}"

export AWS_PROFILE="${MH_AWS_PROFILE_SHARED:-mentorhub-shared}"

npm ci
npm run build

TOKEN=$(aws codeartifact get-authorization-token \
  --domain "${domain}" \
  --domain-owner "${owner}" \
  --region "${region}" \
  --query authorizationToken --output text)

END=$(aws codeartifact get-repository-endpoint \
  --domain "${domain}" \
  --domain-owner "${owner}" \
  --repository "${repo}" \
  --format npm \
  --region "${region}" \
  --query repositoryEndpoint --output text)

HOST="${END#https://}"
echo "//${HOST}:_authToken=${TOKEN}" >> .npmrc

npm publish
