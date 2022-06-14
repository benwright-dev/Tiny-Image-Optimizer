#!/usr/bin/env bash
set -euo pipefail
npm version patch --no-git-tag-version
# In a real project we would build and publish here.
echo "Release bumped."
