import { MarketWithGoogleData } from '../types/market';
import { API_URL, buildApiUrl } from './apiConfig';

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// Enhanced fetch with better error handling
const fetchWithErrorHandling = async (url: string, options = {}) => {
  console.log(`Fetching: ${url}`);
  
  try {
    const fetchOptions = {
      ...options,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...((options as any).headers || {})
      },
      // Use cors mode for all requests
      mode: 'cors' as RequestMode,
      // Don't include credentials by default to avoid CORS preflight issues
      credentials: 'omit' as RequestCredentials
    };
    
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData && errorData.error) {
          errorMessage += ` - ${errorData.error}`;
        }
      } catch (e) {
        // If we can't parse JSON, just use the status
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
};

export const getMarketById = async (id: string): Promise<MarketWithGoogleData> => {
  if (!id) {
    throw new Error('Market ID is required');
  }
  
  try {
    const response = await fetchWithErrorHandling(buildApiUrl(`/api/markets/${id}`));
    
    // Check if the response has the expected structure
    if (!response.success || !response.market) {
      throw new Error(response.error || 'Failed to fetch market details');
    }
    
    return response.market;
  } catch (error) {
    console.error('Error fetching market:', error);
    throw error;
  }
};

export const searchMarkets = async (params: {
  q?: string;
  state?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  page?: number;
  per_page?: number;
}): Promise<PaginatedResponse<MarketWithGoogleData>> => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const data = await fetchWithErrorHandling(buildApiUrl(`/api/markets/search?${queryParams}`));
    return data;
  } catch (error) {
    console.error('Error fetching markets:', error);
    throw error;
  }
};

export const getStateMarketCounts = async (): Promise<Array<{ _id: string; count: number }>> => {
  try {
    const data = await fetchWithErrorHandling(buildApiUrl('/api/markets/state-counts'));
    return data.data; // Extract the data array from the response
  } catch (error) {
    console.error('Error fetching state counts:', error);
    throw error;
  }
}; 