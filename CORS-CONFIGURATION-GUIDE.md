# Configuring CORS for Your Backend on Render

This guide will help you configure Cross-Origin Resource Sharing (CORS) on your backend to allow requests from your frontend hosted on Hostinger.

## What is CORS?

CORS (Cross-Origin Resource Sharing) is a security feature implemented by browsers that restricts web pages from making requests to a different domain than the one that served the original page. When your frontend is hosted on Hostinger (planetwiseliving.com) and your backend is on Render (your-backend.onrender.com), you need to configure CORS to allow these cross-origin requests.

## Step 1: Install the CORS Package

If you haven't already, install the CORS package in your Node.js backend:

```bash
npm install cors
```

## Step 2: Configure CORS in Your Backend

Add the following code to your main server file (e.g., `app.js`, `server.js`, or `index.js`):

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://planetwiseliving.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rest of your server code...
```

## Step 3: Set Environment Variables on Render

1. Log in to your Render dashboard
2. Navigate to your backend service
3. Click on "Environment"
4. Add the following environment variable:
   - Key: `CORS_ORIGIN`
   - Value: `https://planetwiseliving.com`
5. Click "Save Changes"

## Step 4: Test CORS Configuration

After deploying your backend with the CORS configuration:

1. Open your browser's developer tools (F12)
2. Go to the Network tab
3. Visit your frontend at https://planetwiseliving.com
4. Look for API requests to your Render backend
5. Verify that the requests succeed without CORS errors

## Troubleshooting CORS Issues

### 1. CORS Errors in Console

If you see errors like "Access to fetch at 'https://your-backend.onrender.com/api' from origin 'https://planetwiseliving.com' has been blocked by CORS policy", check:

- That your CORS configuration is correctly implemented
- That the `CORS_ORIGIN` environment variable is set correctly on Render
- That your frontend is making requests to the correct backend URL

### 2. Handling Multiple Origins

If you need to allow requests from multiple origins (e.g., development and production):

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://planetwiseliving.com'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 3. Handling Credentials

If your API requires credentials (cookies, HTTP authentication), add the `credentials` option:

```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://planetwiseliving.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
```

### 4. Preflight Requests

For complex requests (like those with custom headers or non-simple methods), browsers send a preflight OPTIONS request. Ensure your server handles these correctly:

```javascript
app.options('*', cors()); // Enable preflight requests for all routes
```

## Security Considerations

1. **Be Specific with Origins**: Avoid using `*` as the origin, which allows requests from any domain
2. **Limit Methods and Headers**: Only allow the HTTP methods and headers your API actually needs
3. **Use Environment Variables**: Store the allowed origins in environment variables for flexibility
4. **Regularly Review**: Periodically review your CORS configuration as your application evolves 