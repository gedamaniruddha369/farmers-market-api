export interface Market {
  _id: string;
  Name?: string;
  Address?: string;
  USDA_listing_id?: string;
  location?: {
    type: string;
    coordinates: [number, number];
  };
  market_name?: string;
  market_address?: string;
  state?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  phone_number?: string;
  website?: string;
  image_link?: string;
  image_url?: string;
  google_maps_link?: string;
  google_place_id?: string;
  rating?: number;
  products?: string[];
  googleData?: {
    currentOpeningHours?: string[];
    rating?: number;
    photos?: string[];
    reviews?: any[];
  };
}

export type MarketWithGoogleData = Market; 