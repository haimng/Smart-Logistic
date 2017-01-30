#!/bin/bash

# Kill all node processes
ps -eo pid,args | awk '$2~/node/ { print $1 }' | xargs kill -9

# server
babel --presets es2015 --presets react --watch src/ --out-dir build/server/ &
cd build; nodemon --ignore client/ server/server.js &
