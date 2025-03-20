// US States data with abbreviations
export const stateAbbreviations: { [key: string]: string } = {
  'Alabama': 'AL',
  'Alaska': 'AK',
  'Arizona': 'AZ',
  'Arkansas': 'AR',
  'California': 'CA',
  'Colorado': 'CO',
  'Connecticut': 'CT',
  'Delaware': 'DE',
  'Florida': 'FL',
  'Georgia': 'GA',
  'Hawaii': 'HI',
  'Idaho': 'ID',
  'Illinois': 'IL',
  'Indiana': 'IN',
  'Iowa': 'IA',
  'Kansas': 'KS',
  'Kentucky': 'KY',
  'Louisiana': 'LA',
  'Maine': 'ME',
  'Maryland': 'MD',
  'Massachusetts': 'MA',
  'Michigan': 'MI',
  'Minnesota': 'MN',
  'Mississippi': 'MS',
  'Missouri': 'MO',
  'Montana': 'MT',
  'Nebraska': 'NE',
  'Nevada': 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  'Ohio': 'OH',
  'Oklahoma': 'OK',
  'Oregon': 'OR',
  'Pennsylvania': 'PA',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  'Tennessee': 'TN',
  'Texas': 'TX',
  'Utah': 'UT',
  'Vermont': 'VT',
  'Virginia': 'VA',
  'Washington': 'WA',
  'West Virginia': 'WV',
  'Wisconsin': 'WI',
  'Wyoming': 'WY'
};

// US States array
export const states = Object.keys(stateAbbreviations).sort();

// Stock market images for fallback
export const stockMarketImages = [
  'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=500',
  'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=500',
  'https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=500',
  'https://images.unsplash.com/photo-1498579809087-ef1e558fd1da?auto=format&fit=crop&w=500',
  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500'
];

// Featured markets data
interface FeaturedMarket {
  city: string;
  name: string;
  description: string;
  image: string;
}

export const featuredMarkets: FeaturedMarket[] = [
  {
    city: 'New York City',
    name: 'Union Square Greenmarket',
    description: 'NYC\'s largest and most diverse outdoor market',
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=500'
  },
  {
    city: 'Washington D.C.',
    name: 'Eastern Market',
    description: 'Historic market in Capitol Hill since 1873',
    image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=500'
  },
  {
    city: 'Los Angeles',
    name: 'Grand Central Market',
    description: 'LA\'s premier food & cultural destination',
    image: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=500'
  },
  {
    city: 'Chicago',
    name: 'Green City Market',
    description: 'Chicago\'s sustainable farmers market',
    image: 'https://images.unsplash.com/photo-1498579809087-ef1e558fd1da?auto=format&fit=crop&w=500'
  },
  {
    city: 'Houston',
    name: 'Urban Harvest',
    description: 'Texas\' largest farmers market',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500'
  },
  {
    city: 'San Francisco',
    name: 'Ferry Building Market',
    description: 'Iconic waterfront marketplace',
    image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=500'
  },
  {
    city: 'Miami',
    name: 'Yellow Green Market',
    description: 'South Florida\'s largest farmers market',
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=500'
  },
  {
    city: 'Seattle',
    name: 'Pike Place Market',
    description: 'Historic waterfront public market',
    image: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=500'
  },
  {
    city: 'Boston',
    name: 'Boston Public Market',
    description: 'Year-round, indoor local food market',
    image: 'https://images.unsplash.com/photo-1498579809087-ef1e558fd1da?auto=format&fit=crop&w=500'
  },
  {
    city: 'Philadelphia',
    name: 'Reading Terminal',
    description: 'America\'s oldest farmers market',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500'
  },
  {
    city: 'Denver',
    name: 'Union Station Market',
    description: 'Colorado\'s premier farmers market',
    image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=500'
  },
  {
    city: 'Austin',
    name: 'SFC Farmers\' Market',
    description: 'Sustainable Food Center\'s flagship market',
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=500'
  }
]; 