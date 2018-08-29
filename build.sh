#!/bin/sh
rm -rf ./node_modules
rm -rf ./lib
mkdir -p lib
git submodule --init --recursive
npm install --dev
if [[ @? != 0 ]]; then
  exit 1
fi
npm run-script build

echo "Ready to roll"

docker build -t happy-app:master .

