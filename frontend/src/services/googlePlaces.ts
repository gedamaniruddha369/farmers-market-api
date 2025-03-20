interface GooglePlacePhoto {
  photo_reference: string;
  height: number;
  width: number;
  html_attributions: string[];
}

interface GooglePlaceReview {
  author_name: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

interface GooglePlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  formatted_phone_number?: string;
  website?: string;
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: {
    weekday_text: string[];
    periods: Array<{
      open: { day: number; time: string };
      close: { day: number; time: string };
    }>;
  };
  photos?: GooglePlacePhoto[];
  reviews?: GooglePlaceReview[];
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
let placesService: google.maps.places.PlacesService | null = null;

// Initialize the Places service
const initPlacesService = (): google.maps.places.PlacesService => {
  if (!placesService) {
    const mapDiv = document.createElement('div');
    const map = new google.maps.Map(mapDiv, {
      center: { lat: 0, lng: 0 },
      zoom: 1
    });
    placesService = new google.maps.places.PlacesService(map);
  }
  return placesService;
};

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getMarketDetails = async (placeId: string, retries = 3): Promise<GooglePlaceDetails> => {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const result = await new Promise<GooglePlaceDetails>((resolve, reject) => {
        const service = initPlacesService();
        service.getDetails(
          {
            placeId,
            fields: [
              'name',
              'formatted_address',
              'formatted_phone_number',
              'website',
              'rating',
              'user_ratings_total',
              'opening_hours',
              'photos',
              'reviews'
            ]
          },
          (
            result: google.maps.places.PlaceResult | null,
            status: google.maps.places.PlacesServiceStatus
          ) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && result) {
              resolve(result as unknown as GooglePlaceDetails);
            } else {
              reject(new Error(`Failed to fetch market details: ${status}`));
            }
          }
        );
      });
      return result;
    } catch (error) {
      if (attempt === retries - 1) {
        throw error;
      }
      // Wait before retrying
      await delay(1000 * (attempt + 1));
    }
  }
  throw new Error('Failed to fetch market details after multiple attempts');
};

export const getPlacePhoto = (photoReference: string): string => {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoReference}&key=${GOOGLE_MAPS_API_KEY}`;
}; 