# PlanetWiseLiving Performance Optimization Guide

This guide outlines the performance optimizations implemented in the PlanetWiseLiving website to ensure fast loading times and a smooth user experience.

## Image Optimization

### LazyImage Component

We've implemented a `LazyImage` component (`src/components/common/LazyImage.tsx`) that provides the following optimizations:

1. **Lazy Loading**: Images are loaded only when they enter the viewport, reducing initial page load time.
2. **Responsive Images**: The component generates appropriate `srcset` attributes to serve different image sizes based on the device.
3. **Placeholder Images**: Shows a placeholder while the actual image is loading.
4. **Proper Alt Text**: Ensures all images have descriptive alt text for accessibility and SEO.
5. **Smooth Transitions**: Implements fade-in transitions when images load.

### Usage Example

```tsx
import LazyImage from './common/LazyImage';

<LazyImage 
  src="path/to/image.jpg"
  alt="Descriptive text about the image content"
  className="your-custom-classes"
  width={600}
  height={400}
/>
```

### Image Optimization Utilities

The `src/utils/imageOptimizer.ts` file contains utilities for image optimization:

1. **getOptimizedImageUrl**: Prepares images for CDN optimization (when implemented).
2. **getResponsiveImageWidth**: Calculates optimal image dimensions based on device.
3. **generatePlaceholderColor**: Creates consistent placeholder colors.
4. **checkImageExists**: Verifies image availability.

## JavaScript and CSS Optimization

We've configured webpack (`webpack.config.js`) to optimize JavaScript and CSS:

1. **Code Splitting**: Separates vendor code from application code.
2. **Minification**: Reduces file sizes by removing whitespace, comments, and unnecessary code.
3. **Tree Shaking**: Eliminates unused code.
4. **Content Hashing**: Enables long-term caching by using content-based hashes in filenames.
5. **Compression**: Applies gzip compression to static assets.

## Caching Strategy

1. **Browser Caching**: Static assets use content hashing to enable long-term caching.
2. **Runtime Caching**: Service worker caches frequently accessed resources.

## Additional Optimizations

1. **Critical CSS**: Inline critical CSS for above-the-fold content.
2. **Deferred Loading**: Non-critical JavaScript is loaded after the initial page render.
3. **Preconnect and Prefetch**: Establish early connections to required origins.

```html
<!-- Add to index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://images.unsplash.com">
```

## Implementation Checklist

- [x] Create LazyImage component
- [x] Implement image optimization utilities
- [x] Configure webpack for JS/CSS optimization
- [x] Update components to use LazyImage
- [ ] Add preconnect/prefetch directives
- [ ] Implement service worker for caching
- [ ] Set up proper cache headers on the server

## Measuring Performance

Use the following tools to measure performance improvements:

1. **Lighthouse**: Run in Chrome DevTools to get overall performance scores.
2. **WebPageTest**: For more detailed performance metrics.
3. **Core Web Vitals**: Monitor in Google Search Console.

## Next Steps

1. **Image CDN**: Consider implementing an image CDN like Cloudinary or Imgix.
2. **Server-Side Rendering**: Implement SSR for faster initial page loads.
3. **Progressive Web App**: Convert to a PWA for offline capabilities.

## Dependencies to Add

To implement these optimizations, add the following dependencies:

```bash
npm install --save-dev compression-webpack-plugin css-minimizer-webpack-plugin mini-css-extract-plugin terser-webpack-plugin clean-webpack-plugin
```

Update your build scripts in package.json:

```json
"scripts": {
  "build": "NODE_ENV=production webpack --config webpack.config.js",
  "analyze": "NODE_ENV=production webpack --config webpack.config.js --analyze"
}
``` 