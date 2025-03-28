/**
 * API Configuration
 * This file centralizes the API URL configuration for the application.
 * It uses environment variables to determine the appropriate backend URL.
 */

// Base API URL - in production, this will be set to the actual backend URL
// In development, it will fall back to localhost if not set
export const API_URL = import.meta.env.PROD 
  ? 'https://farmers-market-api.onrender.com/api'
  : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api');

/**
 * Helper function to build full API URLs
 * @param endpoint - The API endpoint to append to the base URL
 * @returns The complete API URL
 */
export const buildApiUrl = (endpoint: string): string => {
  // Ensure the base URL doesn't end with a trailing slash
  const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
  // Ensure the endpoint starts with a forward slash
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${normalizedEndpoint}`;
};