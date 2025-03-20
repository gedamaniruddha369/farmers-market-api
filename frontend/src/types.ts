export interface Market {
  _id: string;
  USDA_listing_id: string;
  Name: string;
  Address: string;
  longitude: number;
  latitude: number;
  rating: number;
  phone_number: string;
  website: string;
  image_link: string;
  google_maps_link: string;
  google_place_id?: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
} 