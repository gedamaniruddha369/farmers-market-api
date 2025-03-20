@echo off
echo 🌱 PlanetWiseLiving Deployment Script 🌱
echo ----------------------------------------

REM Step 1: Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Step 2: Install optimization dependencies
echo 🚀 Installing optimization dependencies...
call npm install --save-dev compression-webpack-plugin css-minimizer-webpack-plugin mini-css-extract-plugin terser-webpack-plugin clean-webpack-plugin

REM Step 3: Build the project
echo 🔨 Building the project...
call npm run build

REM Step 4: Copy .htaccess to the build directory
echo 📄 Copying .htaccess to the build directory...
copy public\.htaccess dist\

REM Step 5: Create a deployment zip file (using PowerShell)
echo 🗜️ Creating deployment zip file...
powershell -command "Compress-Archive -Path dist\* -DestinationPath planetwiseliving-deployment.zip -Force"

echo ✅ Deployment preparation complete!
echo ----------------------------------------
echo Your deployment package is ready at: planetwiseliving-deployment.zip
echo Upload this file to your Hostinger public_html directory and extract it there.
echo.
echo Don't forget to:
echo 1. Set up your backend API (if needed)
echo 2. Configure Google Analytics after deployment
echo 3. Submit your sitemap to Google Search Console
echo ----------------------------------------

pause 