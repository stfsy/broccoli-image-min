#!/bin/bash

set -ex

git checkout master
npm install
npm outdated || true
npm update
npm test
git add *package*
git commit -m "feat: update dependencies"
npm run release-minor
git checkout dev || true
git rebase master