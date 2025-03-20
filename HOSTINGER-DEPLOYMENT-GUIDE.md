# Deploying PlanetWiseLiving to Hostinger

This guide will walk you through the process of deploying your PlanetWiseLiving website to Hostinger, replacing your existing blog.

## Prerequisites

- Access to your Hostinger account
- FTP client (like FileZilla) or Hostinger File Manager
- Node.js and npm installed on your local machine

## Step 1: Back Up Your Existing Blog (Optional)

If you want to keep any content from your existing blog:

1. Log in to your Hostinger control panel
2. Navigate to File Manager or use FTP to connect to your website
3. Download any important content, images, or data you want to keep
4. Export your database if your blog uses one (via phpMyAdmin)

## Step 2: Build Your PlanetWiseLiving Website

1. Open a terminal/command prompt
2. Navigate to your frontend directory:
   ```
   cd frontend
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Install optimization dependencies:
   ```
   npm install --save-dev compression-webpack-plugin css-minimizer-webpack-plugin mini-css-extract-plugin terser-webpack-plugin clean-webpack-plugin
   ```

5. Build the production version of your website:
   ```
   npm run build
   ```
   
   This will create a `dist` directory with optimized files ready for deployment.

## Step 3: Delete Existing Content on Hostinger

1. Log in to your Hostinger control panel
2. Navigate to File Manager or connect via FTP
3. Select all files and directories in your public_html folder (except any you want to keep)
4. Delete the selected files

## Step 4: Upload Your New Website

### Option 1: Using Hostinger File Manager

1. In the Hostinger control panel, navigate to File Manager
2. Go to the public_html directory
3. Click "Upload" and select all files from your local `frontend/dist` directory
4. Wait for the upload to complete

### Option 2: Using FTP (Recommended for larger sites)

1. Open your FTP client (like FileZilla)
2. Connect to your Hostinger server using your FTP credentials:
   - Host: ftp.planetwiseliving.com (or as provided by Hostinger)
   - Username: Your Hostinger FTP username
   - Password: Your Hostinger FTP password
   - Port: 21 (default)
3. Navigate to the public_html directory on the remote server
4. Upload all files from your local `frontend/dist` directory to the remote public_html directory
5. Wait for the upload to complete

## Step 5: Configure Server Settings

### Set Up URL Rewriting for React Router

Since your app uses React Router, you need to ensure all routes redirect to index.html:

1. Create a file named `.htaccess` in your public_html directory with the following content:

```
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

### Configure Caching

Add the following to your `.htaccess` file to enable browser caching:

```
<IfModule mod_expires.c>
  ExpiresActive On

  # Images
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/x-icon "access plus 1 year"

  # CSS, JavaScript
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"

  # Others
  ExpiresByType application/pdf "access plus 1 month"
  ExpiresByType application/x-shockwave-flash "access plus 1 month"
</IfModule>
```

## Step 6: Set Up Backend API (If Needed)

If your application uses a backend API:

1. Navigate to your backend directory:
   ```
   cd ../backend
   ```

2. Follow the deployment instructions for your backend (Node.js, Express, etc.)
3. Configure environment variables on Hostinger for your backend
4. Update your frontend API endpoints to point to the correct production URLs

## Step 7: Test Your Deployed Website

1. Visit your website at https://planetwiseliving.com
2. Test all major functionality:
   - Navigation between pages
   - Search functionality
   - Market listings
   - Contact form
   - Near Me feature
3. Test on different devices and browsers

## Step 8: Set Up Google Analytics and Search Console

Now that your site is deployed, you can set up tracking:

1. Create a Google Analytics 4 property for your website
2. Replace the placeholder GA tag in your index.html with your actual GA tracking code
3. Set up Google Search Console and verify ownership of your site
4. Submit your sitemap.xml to Google Search Console

## Troubleshooting

### 404 Errors on Page Refresh
If you get 404 errors when refreshing pages, check that your .htaccess file is correctly set up for React Router.

### API Connection Issues
If your frontend can't connect to your backend API, check:
- CORS settings on your backend
- API endpoint URLs in your frontend code
- Environment variables

### Missing Assets
If images or other assets are missing, check:
- File paths in your code
- That all files were uploaded correctly
- Case sensitivity in file names (important on Linux servers)

## Maintenance

After deployment, regularly:
- Monitor your website's performance
- Update dependencies
- Back up your website files and database
- Check Google Analytics and Search Console for insights

## Need Help?

If you encounter issues with Hostinger specifically:
1. Contact Hostinger support through your control panel
2. Provide specific error messages or screenshots
3. Be prepared to share your domain name and account details (securely) 