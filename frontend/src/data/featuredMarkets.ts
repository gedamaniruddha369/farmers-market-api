export interface FeaturedMarket {
  id: string;  // Google Place ID
  name: string;
  city: string;
  state: string;
  description: string;
  imageUrl: string;
  highlights: string[];
  operatingHours: string;
  website?: string;
}

export const featuredMarkets: FeaturedMarket[] = [
  {
    id: 'ChIJK7ZVxPS1UVAR5S7P5tZEXBE',  // Pike Place Market Place ID
    name: 'Pike Place Market',
    city: 'Seattle',
    state: 'Washington',
    description: 'Historic farmers market overlooking the Elliott Bay waterfront, featuring local vendors, artisans, and the famous fish-throwing tradition.',
    imageUrl: 'https://images.unsplash.com/photo-1598215439218-f79b46925d3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    highlights: [
      'Fresh local produce and seafood',
      'Artisanal crafts and goods',
      'Iconic fish-throwing tradition',
      'Stunning waterfront views',
      'Original Starbucks location'
    ],
    operatingHours: 'Mon-Sun: 9am-6pm',
    website: 'http://pikeplacemarket.org'
  },
  {
    id: 'ChIJIQBpAG2ahYART2XmP_GUEvQ',  // Ferry Building Marketplace Place ID
    name: 'Ferry Building Marketplace',
    city: 'San Francisco',
    state: 'California',
    description: 'Iconic marketplace housed in a historic ferry terminal, offering artisanal foods, local produce, and stunning bay views.',
    imageUrl: 'https://images.unsplash.com/photo-1569664332248-324944e0fa90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    highlights: [
      'Gourmet food vendors',
      'Local farm produce',
      'Waterfront dining',
      'Historic architecture',
      'Specialty food shops'
    ],
    operatingHours: 'Tue, Thu, Sat: 10am-2pm',
    website: 'https://www.ferrybuildingmarketplace.com'
  },
  {
    id: 'ChIJjRuIiTi4j4ARqgbW7qKRSLg',  // Grand Central Market Place ID
    name: 'Grand Central Market',
    city: 'Los Angeles',
    state: 'California',
    description: 'Historic food hall featuring diverse cuisines, local vendors, and fresh produce in downtown LA since 1917.',
    imageUrl: 'https://images.unsplash.com/photo-1595880500386-4b33ba8d2161?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    highlights: [
      'Diverse food vendors',
      'Fresh produce stands',
      'Historic atmosphere',
      'Cultural fusion cuisine',
      'Local artisanal goods'
    ],
    operatingHours: 'Mon-Sun: 8am-9pm',
    website: 'https://www.grandcentralmarket.com'
  }
]; 