#!/bin/bash

# PlanetWiseLiving Deployment Script
# This script builds the frontend and prepares files for Hostinger deployment

echo "🌱 PlanetWiseLiving Deployment Script 🌱"
echo "----------------------------------------"

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install

# Step 2: Install optimization dependencies
echo "🚀 Installing optimization dependencies..."
npm install --save-dev compression-webpack-plugin css-minimizer-webpack-plugin mini-css-extract-plugin terser-webpack-plugin clean-webpack-plugin

# Step 3: Build the project
echo "🔨 Building the project..."
npm run build

# Step 4: Copy .htaccess to the build directory
echo "📄 Copying .htaccess to the build directory..."
cp public/.htaccess dist/

# Step 5: Create a deployment zip file
echo "🗜️ Creating deployment zip file..."
cd dist
zip -r ../planetwiseliving-deployment.zip *
cd ..

echo "✅ Deployment preparation complete!"
echo "----------------------------------------"
echo "Your deployment package is ready at: planetwiseliving-deployment.zip"
echo "Upload this file to your Hostinger public_html directory and extract it there."
echo ""
echo "Don't forget to:"
echo "1. Set up your backend API (if needed)"
echo "2. Configure Google Analytics after deployment"
echo "3. Submit your sitemap to Google Search Console"
echo "----------------------------------------" 