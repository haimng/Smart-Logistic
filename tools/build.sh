#!/bin/bash

BUILD=./build

### Update npm
git pull
npm install; npm update

### Build

# static
mkdir -p $BUILD/static
rsync -ravh static/ $BUILD/static

# server
babel --presets es2015 --presets react src/ --out-dir $BUILD/server/
