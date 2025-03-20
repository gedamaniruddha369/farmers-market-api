/**
 * Utility functions for image optimization
 */

/**
 * Generates an optimized image URL for a given source
 * This function can be expanded to work with an image CDN or optimization service
 * 
 * @param src - Original image source URL
 * @param width - Desired width
 * @param quality - Image quality (1-100)
 * @returns Optimized image URL
 */
export const getOptimizedImageUrl = (
  src: string,
  width?: number,
  quality: number = 80
): string => {
  // If using an image CDN like Cloudinary, Imgix, etc., modify the URL here
  // For now, we'll just return the original URL since we don't have a CDN set up
  
  // Example implementation for Cloudinary (commented out)
  // if (src.includes('cloudinary.com')) {
  //   return src.replace('/upload/', `/upload/q_${quality},w_${width || 'auto'}/`);
  // }
  
  // Example implementation for Imgix (commented out)
  // if (src.includes('imgix.net')) {
  //   return `${src}${src.includes('?') ? '&' : '?'}w=${width || 'auto'}&q=${quality}`;
  // }
  
  return src;
};

/**
 * Determines appropriate image dimensions based on device and container
 * 
 * @param containerWidth - Width of the container in pixels
 * @returns Appropriate image width for the device
 */
export const getResponsiveImageWidth = (containerWidth: number): number => {
  // Get device pixel ratio for high-DPI screens
  const pixelRatio = window.devicePixelRatio || 1;
  
  // Calculate optimal image width based on container and device
  const optimalWidth = containerWidth * pixelRatio;
  
  // Round to nearest 100 for better caching
  return Math.ceil(optimalWidth / 100) * 100;
};

/**
 * Generates a placeholder color based on the image URL
 * Useful for showing a color before the image loads
 * 
 * @param url - Image URL
 * @returns Hex color code
 */
export const generatePlaceholderColor = (url: string): string => {
  // Simple hash function to generate a consistent color from a string
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash = url.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Convert to hex color
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    // Make colors lighter for better text visibility
    const lightValue = Math.floor(((value + 255) / 2) * 0.7 + 77);
    color += ('00' + lightValue.toString(16)).substr(-2);
  }
  
  return color;
};

/**
 * Checks if an image exists and is accessible
 * 
 * @param url - Image URL to check
 * @returns Promise that resolves to boolean indicating if image exists
 */
export const checkImageExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
}; 