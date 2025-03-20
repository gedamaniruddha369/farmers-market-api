# PlanetWiseLiving Deployment Checklist

Use this checklist to ensure a smooth deployment of your PlanetWiseLiving website to Hostinger.

## Pre-Deployment Tasks

- [ ] Back up any important content from your existing blog on Hostinger
- [ ] Ensure all code changes are committed and finalized
- [ ] Test the website locally to verify all features work correctly
- [ ] Check that all links are working properly
- [ ] Verify that contact forms submit correctly
- [ ] Test the website on different browsers and devices
- [ ] Optimize all images using the LazyImage component
- [ ] Update meta tags and SEO information

## Build Process

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
- [ ] Upload your build files to the public_html directory
- [ ] Verify that the `.htaccess` file was uploaded correctly
- [ ] Check that file permissions are set correctly (typically 644 for files, 755 for directories)

## Backend Setup (If Applicable)

- [ ] Set up Node.js hosting on Hostinger (if available)
- [ ] Upload backend files to the appropriate directory
- [ ] Install backend dependencies
- [ ] Configure environment variables
- [ ] Start the backend server
- [ ] Test API endpoints

## Post-Deployment Verification

- [ ] Visit your website at https://planetwiseliving.com
- [ ] Verify that the homepage loads correctly
- [ ] Test navigation to all pages
- [ ] Test the "Near Me" functionality
- [ ] Test the contact form
- [ ] Check that all images load properly
- [ ] Verify that all external links work
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile devices

## SEO and Analytics Setup

- [ ] Set up Google Analytics (see GOOGLE-ANALYTICS-SETUP.md)
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

## Final Steps

- [ ] Announce your new website on social media
- [ ] Monitor analytics for any issues
- [ ] Set up regular backups
- [ ] Create a maintenance schedule
- [ ] Document any custom configurations or settings

## Troubleshooting Common Issues

### 404 Errors on Page Refresh
- [ ] Verify that the `.htaccess` file is correctly configured
- [ ] Check that URL rewriting is enabled on the server

### Missing Assets
- [ ] Check file paths in your code
- [ ] Verify that all files were uploaded correctly
- [ ] Check case sensitivity in file names

### Contact Form Not Working
- [ ] Verify backend API endpoints
- [ ] Check email configuration
- [ ] Test with different email addresses

### Performance Issues
- [ ] Check server response times
- [ ] Optimize large images
- [ ] Enable browser caching
- [ ] Minimize HTTP requests 