# Deploying PlanetWiseLiving: Frontend on Hostinger, Backend on Render

This guide will walk you through the process of deploying your PlanetWiseLiving website with the frontend on Hostinger and the backend on Render.

## Architecture Overview

Your application uses a split architecture:
- **Frontend**: React application hosted on Hostinger
- **Backend**: Node.js API hosted on Render
- **Database**: MongoDB for data storage

## Prerequisites

- Access to your Hostinger account
- Access to your Render account
- Access to your GitHub repository
- Node.js and npm installed on your local machine

## Step 1: Update and Deploy the Backend on Render

Since your backend is already running on Render, you'll need to update it with any new changes:

1. Push your backend code changes to GitHub:
   ```
   cd backend
   git add .
   git commit -m "Update backend for production"
   git push origin main
   ```

2. Log in to your Render dashboard
3. Navigate to your backend service
4. If you have automatic deployments set up, Render will automatically deploy the latest changes from your GitHub repository
5. If not, manually deploy the latest version:
   - Click on your backend service
   - Click "Manual Deploy" > "Deploy latest commit"

6. Verify that your backend API is working by testing a few endpoints

## Step 2: Configure Environment Variables on Render

Ensure your backend has all the necessary environment variables:

1. In your Render dashboard, go to your backend service
2. Click on "Environment"
3. Add or update the following variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `EMAIL_HOST`: smtp.hostinger.com
   - `EMAIL_PORT`: 465
   - `EMAIL_SECURE`: true
   - `EMAIL_USER`: contact@planetwiseliving.com
   - `EMAIL_PASS`: Your email password
   - `EMAIL_FROM`: contact@planetwiseliving.com
   - `CORS_ORIGIN`: https://planetwiseliving.com (to allow requests from your frontend)
   - Any other environment variables your backend needs

4. Click "Save Changes" and wait for the service to redeploy

## Step 3: Update Frontend API Configuration

Before building your frontend, you need to update the API endpoint to point to your Render backend:

1. Create or update an environment file in your frontend project:

   Create a `.env.production` file in your frontend directory:
   ```
   VITE_API_URL=https://your-backend-name.onrender.com/api
   ```

   Replace `your-backend-name` with your actual Render service name.

2. Make sure your frontend code uses this environment variable for API calls:

   ```javascript
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
   
   // Example API call
   fetch(`${API_URL}/markets`)
     .then(response => response.json())
     .then(data => console.log(data));
   ```

## Step 4: Build Your Frontend for Production

1. Navigate to your frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Build the production version of your website:
   ```
   npm run build
   ```
   
   This will create a `dist` directory with optimized files ready for deployment.

4. Copy the `.htaccess` file to the build directory:
   ```
   copy public\.htaccess dist\
   ```

## Step 5: Delete Existing Content on Hostinger

1. Log in to your Hostinger control panel
2. Navigate to File Manager or connect via FTP
3. Select all files and directories in your public_html folder (except any you want to keep)
4. Delete the selected files

## Step 6: Upload Your Frontend to Hostinger

### Option 1: Using Hostinger File Manager

1. In the Hostinger control panel, navigate to File Manager
2. Go to the public_html directory
3. Click "Upload" and select all files from your local `frontend/dist` directory
4. Wait for the upload to complete

### Option 2: Using FTP (Recommended for larger sites)

1. Open your FTP client (like FileZilla)
2. Connect to your Hostinger server using your FTP credentials
3. Navigate to the public_html directory on the remote server
4. Upload all files from your local `frontend/dist` directory to the remote public_html directory
5. Wait for the upload to complete

## Step 7: Configure CORS on Your Backend

To ensure your backend accepts requests from your Hostinger-hosted frontend:

1. Make sure your backend has CORS properly configured:

   ```javascript
   const cors = require('cors');
   
   app.use(cors({
     origin: process.env.CORS_ORIGIN || 'https://planetwiseliving.com',
     methods: ['GET', 'POST', 'PUT', 'DELETE'],
     allowedHeaders: ['Content-Type', 'Authorization']
   }));
   ```

2. Push these changes to GitHub and redeploy on Render if needed

## Step 8: Test Your Deployed Website

1. Visit your website at https://planetwiseliving.com
2. Test all major functionality:
   - Navigation between pages
   - Search functionality
   - Market listings
   - Contact form
   - Near Me feature
3. Check the browser console for any API connection errors
4. Test on different devices and browsers

## Step 9: Set Up Google Analytics and Search Console

Now that your site is deployed, you can set up tracking:

1. Create a Google Analytics 4 property for your website
2. Replace the placeholder GA tag in your index.html with your actual GA tracking code
3. Set up Google Search Console and verify ownership of your site
4. Submit your sitemap.xml to Google Search Console

## Troubleshooting

### CORS Errors

If you see CORS errors in the browser console:

1. Verify that your backend CORS configuration includes your frontend domain
2. Check that the `CORS_ORIGIN` environment variable on Render is set correctly
3. Ensure your frontend is making requests to the correct backend URL

### API Connection Issues

If your frontend can't connect to your backend API:

1. Check that your backend is running on Render (visit the API URL directly)
2. Verify that the API URL in your frontend code is correct
3. Check for any network errors in the browser console

### 404 Errors on Page Refresh

If you get 404 errors when refreshing pages:

1. Verify that the `.htaccess` file was uploaded to Hostinger
2. Check that the `.htaccess` file contains the correct URL rewriting rules for React Router

## Maintenance

### Frontend Updates

To update your frontend:

1. Make changes to your code
2. Rebuild the frontend: `npm run build`
3. Upload the new files to Hostinger

### Backend Updates

To update your backend:

1. Push changes to GitHub
2. Render will automatically deploy the changes (if auto-deploy is enabled)
3. Or manually trigger a deployment from the Render dashboard

### Database Maintenance

For MongoDB maintenance:

1. Regularly back up your database
2. Monitor database performance and storage usage
3. Consider setting up database alerts for critical issues

## Security Considerations

1. Keep your environment variables secure and never commit them to your repository
2. Regularly update dependencies for both frontend and backend
3. Implement rate limiting on your backend to prevent abuse
4. Use HTTPS for all communications between frontend, backend, and database 