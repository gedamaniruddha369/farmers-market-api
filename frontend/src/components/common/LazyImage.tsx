import React, { useState, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderSrc?: string;
  width?: number;
  height?: number;
  onError?: () => void;
}

/**
 * LazyImage component that implements lazy loading and proper image optimization
 * 
 * @param src - The source URL of the image
 * @param alt - Descriptive alt text for accessibility and SEO
 * @param className - Optional CSS classes
 * @param placeholderSrc - Optional placeholder image to show while loading
 * @param width - Optional width for the image
 * @param height - Optional height for the image
 * @param onError - Optional callback for image loading errors
 */
const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholderSrc = 'https://via.placeholder.com/300x200/e2e8f0/94a3b8?text=Loading...',
  width,
  height,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(placeholderSrc);
  
  useEffect(() => {
    // Create a new image object to preload the image
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setImgSrc(src);
      setIsLoaded(true);
    };
    
    img.onerror = () => {
      if (onError) {
        onError();
      }
    };
  }, [src, onError]);
  
  // Generate srcset for responsive images if width is provided
  const generateSrcSet = () => {
    if (!width) return undefined;
    
    // Extract base URL and file extension
    const lastDotIndex = src.lastIndexOf('.');
    if (lastDotIndex === -1) return undefined;
    
    const baseUrl = src.substring(0, lastDotIndex);
    const extension = src.substring(lastDotIndex);
    
    // Generate srcset with multiple sizes
    return `
      ${baseUrl}-300w${extension} 300w,
      ${baseUrl}-600w${extension} 600w,
      ${baseUrl}-900w${extension} 900w,
      ${src} 1200w
    `;
  };
  
  return (
    <img
      src={imgSrc}
      alt={alt}
      className={`${className} ${!isLoaded ? 'opacity-50' : 'opacity-100'} transition-opacity duration-300`}
      loading="lazy"
      width={width}
      height={height}
      srcSet={generateSrcSet()}
      sizes={width ? "(max-width: 768px) 100vw, 50vw" : undefined}
      onError={onError}
    />
  );
};

export default LazyImage; 