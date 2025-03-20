# Setting Up Google Analytics and Search Console for PlanetWiseLiving

This guide will walk you through the process of setting up Google Analytics and Search Console for your PlanetWiseLiving website after deploying to Hostinger.

## Google Analytics Setup

### Step 1: Create a Google Analytics 4 Property

1. Go to [Google Analytics](https://analytics.google.com/) and sign in with your Google account
2. Click on "Admin" in the bottom left corner
3. In the Account column, click "Create Account"
4. Enter an account name (e.g., "PlanetWiseLiving")
5. Configure data sharing settings as desired and click "Next"
6. Select "Web" as the platform
7. Enter your website details:
   - Website name: PlanetWiseLiving
   - Website URL: https://planetwiseliving.com
   - Industry category: Select appropriate category
   - Reporting time zone: Select your time zone
8. Click "Create" to finish setting up your property

### Step 2: Get Your Tracking Code

1. After creating your property, you'll be presented with a tracking code (Measurement ID)
2. The Measurement ID will look like "G-XXXXXXXXXX"
3. Copy this ID

### Step 3: Add the Tracking Code to Your Website

1. Open your `index.html` file in the `public` directory
2. Find the Google Analytics placeholder code:

```html
<!-- Deferred non-critical scripts -->
<script defer src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  // Will be replaced with actual GA code after deployment
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

3. Replace both instances of `G-XXXXXXXXXX` with your actual Measurement ID
4. Save the file and redeploy this change to your Hostinger server

## Google Search Console Setup

### Step 1: Add Your Property to Search Console

1. Go to [Google Search Console](https://search.console.google.com/)
2. Click "Add Property"
3. Select "URL prefix" and enter your website URL: `https://planetwiseliving.com/`
4. Click "Continue"

### Step 2: Verify Ownership

You have several options to verify ownership:

#### Option 1: HTML File Verification (Recommended)

1. Download the HTML verification file provided by Google
2. Upload this file to the root directory of your website on Hostinger
3. Click "Verify" in Search Console

#### Option 2: HTML Tag Verification

1. Copy the meta tag provided by Google
2. Add this meta tag to the `<head>` section of your `index.html` file
3. Redeploy your website
4. Click "Verify" in Search Console

#### Option 3: DNS Verification

1. Copy the TXT record provided by Google
2. Add this TXT record to your domain's DNS settings in Hostinger
3. Wait for DNS propagation (can take up to 24-48 hours)
4. Click "Verify" in Search Console

### Step 3: Submit Your Sitemap

1. After verification, go to "Sitemaps" in the left sidebar
2. Enter `sitemap.xml` in the field
3. Click "Submit"
4. Google will now crawl your sitemap and index your pages

## Setting Up Enhanced Tracking

### Event Tracking

To track user interactions like button clicks, form submissions, etc.:

```javascript
// Track a button click
document.getElementById('myButton').addEventListener('click', function() {
  gtag('event', 'button_click', {
    'event_category': 'engagement',
    'event_label': 'homepage_cta'
  });
});

// Track form submissions
document.getElementById('contactForm').addEventListener('submit', function() {
  gtag('event', 'form_submission', {
    'event_category': 'conversion',
    'event_label': 'contact_form'
  });
});
```

### Tracking Outbound Links

To track when users click on links to external websites:

```javascript
document.querySelectorAll('a[href^="http"]').forEach(link => {
  link.addEventListener('click', function() {
    gtag('event', 'outbound_link', {
      'event_category': 'engagement',
      'event_label': this.href
    });
  });
});
```

### Tracking Page Scroll Depth

To track how far users scroll down your pages:

```javascript
let scrollMarkers = [25, 50, 75, 90];
let markers = {};

scrollMarkers.forEach(marker => {
  markers[marker] = false;
});

window.addEventListener('scroll', function() {
  let scrollPercent = 100 * window.scrollY / (document.body.offsetHeight - window.innerHeight);
  
  scrollMarkers.forEach(marker => {
    if (scrollPercent >= marker && !markers[marker]) {
      markers[marker] = true;
      gtag('event', 'scroll_depth', {
        'event_category': 'engagement',
        'event_label': marker + '%'
      });
    }
  });
});
```

## Monitoring Your Analytics

After setting up Google Analytics and Search Console:

1. **Check Real-Time Reports**: Verify that tracking is working by looking at real-time data
2. **Set Up Dashboards**: Create custom dashboards for key metrics
3. **Configure Alerts**: Set up alerts for significant changes in traffic or behavior
4. **Regular Analysis**: Schedule time to review your analytics data weekly or monthly

## Troubleshooting

### Analytics Not Working

If you don't see data in your Google Analytics account:

1. Verify that the tracking code is correctly implemented
2. Check for JavaScript errors in your browser console
3. Use the [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna) Chrome extension
4. Ensure that ad blockers aren't preventing the tracking code from loading

### Search Console Issues

If you're having trouble with Search Console:

1. Verify that your website is accessible (not returning 404 or 500 errors)
2. Check that robots.txt isn't blocking Google from crawling your site
3. Ensure your sitemap is properly formatted and accessible
4. Wait at least 24-48 hours for Google to process your verification and sitemap 