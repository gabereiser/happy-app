#!/bin/sh
rm -rf ./node_modules
rm -rf ./lib
mkdir -p lib
git submodule update --init --recursive
npm install --dev
echo @?

npm run-script build

echo "Ready to roll"

docker build -t happy-app:`(git rev-parse --short HEAD)` .

