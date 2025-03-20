@echo off
echo 🌱 PlanetWiseLiving Deployment Script (Frontend to Hostinger, Backend on Render) 🌱
echo --------------------------------------------------------------------------------

REM Step 1: Create production environment file
echo 📝 Creating production environment file...
echo VITE_API_URL=https://your-backend-name.onrender.com/api > .env.production
echo.
echo ⚠️ IMPORTANT: Edit the .env.production file to set your actual Render backend URL
echo Press any key to continue after editing the file...
pause > nul

REM Step 2: Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Step 3: Install optimization dependencies
echo 🚀 Installing optimization dependencies...
call npm install --save-dev compression-webpack-plugin css-minimizer-webpack-plugin mini-css-extract-plugin terser-webpack-plugin clean-webpack-plugin

REM Step 4: Build the project
echo 🔨 Building the project...
call npm run build

REM Step 5: Copy .htaccess to the build directory
echo 📄 Copying .htaccess to the build directory...
copy public\.htaccess dist\

REM Step 6: Create a deployment zip file (using PowerShell)
echo 🗜️ Creating deployment zip file...
powershell -command "Compress-Archive -Path dist\* -DestinationPath planetwiseliving-frontend-deployment.zip -Force"

echo ✅ Frontend deployment preparation complete!
echo --------------------------------------------------------------------------------
echo Your frontend deployment package is ready at: planetwiseliving-frontend-deployment.zip
echo Upload this file to your Hostinger public_html directory and extract it there.
echo.
echo Don't forget to:
echo 1. Verify your backend is properly deployed on Render
echo 2. Check that the environment variables on Render are correctly set
echo 3. Configure Google Analytics after deployment
echo 4. Submit your sitemap to Google Search Console
echo --------------------------------------------------------------------------------

pause 