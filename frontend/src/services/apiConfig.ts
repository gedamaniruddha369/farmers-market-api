/**
 * API Configuration
 * This file centralizes the API URL configuration for the application.
 * It uses the environment variables to determine the base URL for API calls.
 */

// Get the API URL from the environment variables
// In development, this will default to localhost if not set
// In production, it should be set to your Render backend URL
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Helper function to build a full API URL
 * @param endpoint - The API endpoint (without leading slash)
 * @returns The full API URL
 */
export const buildApiUrl = (endpoint: string): string => {
  // Remove leading slash from endpoint if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  
  // Ensure the API_URL doesn't end with a trailing slash
  const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
  
  return `${baseUrl}/${cleanEndpoint}`;
};
