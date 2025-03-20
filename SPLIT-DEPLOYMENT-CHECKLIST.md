# PlanetWiseLiving Split Deployment Checklist

Use this checklist to ensure a smooth deployment of your PlanetWiseLiving website with the frontend on Hostinger and the backend on Render.

## Backend (Render) Tasks

- [ ] Update backend code with latest changes
- [ ] Push changes to GitHub repository
- [ ] Configure CORS to allow requests from planetwiseliving.com
- [ ] Set up environment variables on Render:
  - [ ] MONGODB_URI
  - [ ] EMAIL_HOST
  - [ ] EMAIL_PORT
  - [ ] EMAIL_SECURE
  - [ ] EMAIL_USER
  - [ ] EMAIL_PASS
  - [ ] EMAIL_FROM
  - [ ] CORS_ORIGIN
- [ ] Deploy backend on Render
- [ ] Test backend API endpoints directly
- [ ] Note the backend URL for frontend configuration

## Frontend Configuration

- [ ] Create `.env.production` file with backend URL:
  ```
  VITE_API_URL=https://your-backend-name.onrender.com/api
  ```
- [ ] Update API service files to use the environment variable
- [ ] Verify all API calls use the environment variable
- [ ] Test API connections locally with the production API URL

## Frontend Build Process

- [ ] Navigate to the frontend directory
- [ ] Run `npm install` to install dependencies
- [ ] Install optimization dependencies
- [ ] Run `npm run build` to create a production build
- [ ] Verify that the build completed successfully
- [ ] Copy the `.htaccess` file to the build directory
- [ ] Create a zip file of the build directory for easy upload

## Hostinger Setup

- [ ] Log in to your Hostinger control panel
- [ ] Back up any important files from your current website
- [ ] Delete existing files from the public_html directory
- [ ] Upload your frontend build files to the public_html directory
- [ ] Verify that the `.htaccess` file was uploaded correctly
- [ ] Check that file permissions are set correctly (typically 644 for files, 755 for directories)

## Integration Testing

- [ ] Visit your website at https://planetwiseliving.com
- [ ] Verify that the homepage loads correctly
- [ ] Test navigation to all pages
- [ ] Test API connections to the backend
- [ ] Check browser console for any CORS or API errors
- [ ] Test the "Near Me" functionality
- [ ] Test the contact form
- [ ] Check that all images load properly
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile devices

## SEO and Analytics Setup

- [ ] Set up Google Analytics
- [ ] Set up Google Search Console
- [ ] Submit your sitemap to Google Search Console
- [ ] Verify that meta tags are correctly implemented
- [ ] Check that structured data is properly formatted

## Performance Optimization

- [ ] Run Lighthouse tests to check performance
- [ ] Verify that caching is working correctly
- [ ] Check that GZIP compression is enabled
- [ ] Verify that lazy loading is working for images
- [ ] Test page load times on various connections

## Troubleshooting Common Issues

### CORS Errors
- [ ] Verify that the backend CORS configuration is correct
- [ ] Check that the CORS_ORIGIN environment variable is set on Render
- [ ] Ensure the frontend is making requests to the correct backend URL

### API Connection Issues
- [ ] Verify that the backend is running on Render
- [ ] Check that the API URL in the frontend is correct
- [ ] Test API endpoints directly using a tool like Postman

### 404 Errors on Page Refresh
- [ ] Verify that the `.htaccess` file is correctly configured
- [ ] Check that URL rewriting is enabled on the server

### Database Connection Issues
- [ ] Verify that the MongoDB connection string is correct
- [ ] Check that the database is accessible from Render
- [ ] Ensure that IP allowlisting is configured if needed

## Post-Deployment Tasks

- [ ] Monitor error logs on both Hostinger and Render
- [ ] Set up uptime monitoring for both frontend and backend
- [ ] Create a backup schedule for your database
- [ ] Document the deployment process for future updates
- [ ] Set up alerts for critical errors or downtime 