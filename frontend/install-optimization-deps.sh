#!/bin/bash

# Install webpack optimization dependencies
npm install --save-dev \
  compression-webpack-plugin \
  css-minimizer-webpack-plugin \
  mini-css-extract-plugin \
  terser-webpack-plugin \
  clean-webpack-plugin

# Update package.json scripts
# Note: You'll need to manually add these scripts to your package.json
# "scripts": {
#   "build": "NODE_ENV=production webpack --config webpack.config.js",
#   "analyze": "NODE_ENV=production webpack --config webpack.config.js --analyze"
# }

echo "Optimization dependencies installed successfully!"
echo "Please add the build scripts to your package.json file as described in the OPTIMIZATION-GUIDE.md" 