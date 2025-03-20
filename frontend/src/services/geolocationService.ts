/**
 * Geolocation service to help with "near me" searches
 * This service provides functions to get the user's current location
 * and calculate distances between coordinates
 */

// Interface for coordinates
export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Interface for location data
export interface LocationData {
  coordinates: Coordinates;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

/**
 * Get the user's current location using the browser's Geolocation API
 * @returns Promise that resolves to the user's coordinates
 */
export const getCurrentLocation = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  });
};

/**
 * Calculate the distance between two coordinates using the Haversine formula
 * @param coords1 First set of coordinates
 * @param coords2 Second set of coordinates
 * @returns Distance in miles
 */
export const calculateDistance = (coords1: Coordinates, coords2: Coordinates): number => {
  const R = 3958.8; // Earth's radius in miles
  const dLat = toRadians(coords2.latitude - coords1.latitude);
  const dLon = toRadians(coords2.longitude - coords1.longitude);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRadians(coords1.latitude)) * Math.cos(toRadians(coords2.latitude)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

/**
 * Convert degrees to radians
 * @param degrees Angle in degrees
 * @returns Angle in radians
 */
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Get location data from coordinates using reverse geocoding
 * @param coordinates User's coordinates
 * @returns Promise that resolves to location data
 */
export const getLocationFromCoordinates = async (coordinates: Coordinates): Promise<LocationData> => {
  try {
    // Replace with your actual API key
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates.latitude},${coordinates.longitude}&key=${apiKey}`
    );
    
    const data = await response.json();
    
    if (data.status !== 'OK') {
      throw new Error(`Geocoding API error: ${data.status}`);
    }
    
    // Extract location components from the first result
    const result = data.results[0];
    const locationData: LocationData = {
      coordinates,
      city: '',
      state: '',
      zipCode: '',
      country: ''
    };
    
    // Parse address components
    for (const component of result.address_components) {
      const types = component.types;
      
      if (types.includes('locality')) {
        locationData.city = component.long_name;
      } else if (types.includes('administrative_area_level_1')) {
        locationData.state = component.short_name;
      } else if (types.includes('postal_code')) {
        locationData.zipCode = component.long_name;
      } else if (types.includes('country')) {
        locationData.country = component.long_name;
      }
    }
    
    return locationData;
  } catch (error) {
    console.error('Error getting location from coordinates:', error);
    return { coordinates };
  }
};

/**
 * Find markets near the user's location
 * @param userCoordinates User's coordinates
 * @param markets Array of markets with coordinates
 * @param maxDistance Maximum distance in miles (default: 50)
 * @returns Array of markets sorted by distance
 */
export const findMarketsNearMe = (
  userCoordinates: Coordinates,
  markets: Array<{ id: string; name: string; coordinates: Coordinates; [key: string]: any }>,
  maxDistance: number = 50
): Array<{ id: string; name: string; coordinates: Coordinates; distance: number; [key: string]: any }> => {
  // Calculate distance for each market
  const marketsWithDistance = markets
    .map(market => ({
      ...market,
      distance: calculateDistance(userCoordinates, market.coordinates)
    }))
    .filter(market => market.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance);
  
  return marketsWithDistance;
}; 