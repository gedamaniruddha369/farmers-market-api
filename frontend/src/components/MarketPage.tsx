import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { Market } from '../types';
import { getMarketDetails } from '../services/googlePlaces';
import { getMarketById } from '../services/api';
import SEOMetadata from './SEOMetadata';
import { generateMarketStructuredData } from '../utils/structuredData';
import { buildApiUrl } from '../services/apiConfig';

// Fallback images in case the market image is not available
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1579113800032-c38bd7635818?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1526399232581-2ab5608b6336?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1595880500386-4b33ba8d2161?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
];

interface GoogleData {
  name?: string;
  formatted_address?: string;
  formatted_phone_number?: string;
  website?: string;
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: {
    weekday_text: string[];
  };
  photos?: string[];
  reviews?: Array<{
    text: string;
    rating: number;
    author: string;
    relative_time: string;
  }>;
}

const MarketPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [market, setMarket] = useState<Market | null>(null);
  const [googleData, setGoogleData] = useState<GoogleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [googleLoading, setGoogleLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'reviews' | 'photos'>('info');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<{
    infoMatches: boolean;
    reviewMatches: string[];
    highlightedContent: Record<string, React.ReactNode>;
  }>({
    infoMatches: false,
    reviewMatches: [],
    highlightedContent: {}
  });

  // Check if market data was passed via location state
  useEffect(() => {
    if (location.state && location.state.market) {
      setMarket(location.state.market);
      setLoading(false);
      
      // Set initial image
      if (location.state.market.image_link) {
        setCurrentImageUrl(location.state.market.image_link);
      } else {
        const randomIndex = Math.floor(Math.random() * FALLBACK_IMAGES.length);
        setCurrentImageUrl(FALLBACK_IMAGES[randomIndex]);
      }
    } else {
      // If no state data, try to fetch from API
      fetchMarketData();
    }
  }, [location.state, id]);

  // Fetch market data
  const fetchMarketData = async () => {
    setLoading(true);
    setError(null);
    try {
      const marketDetails = await getMarketById(id);
      if (marketDetails) {
        setMarket(marketDetails as Market);
        
        // Use image_url from the API response if available
        if (marketDetails.image_url) {
          setCurrentImageUrl(marketDetails.image_url);
        } else if (marketDetails.google_maps_link) {
          // Fallback to a street view image using the place from Google Maps link
          const placeId = extractPlaceIdFromLink(marketDetails.google_maps_link);
          if (placeId) {
            setCurrentImageUrl(`https://maps.googleapis.com/maps/api/streetview?size=600x300&location=place_id:${placeId}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`);
          } else {
            // Fallback to generic image
            setCurrentImageUrl('/images/farmers-market-placeholder.jpg');
          }
        } else {
          // Fallback to generic image
          setCurrentImageUrl('/images/farmers-market-placeholder.jpg');
        }
      } else {
        setError('Market not found.');
      }
    } catch (err) {
      console.error('Error fetching market:', err);
      // Try to get the market from state data if API call fails
      try {
        const stateMarkets = sessionStorage.getItem('stateMarkets');
        if (stateMarkets) {
          const parsedMarkets = JSON.parse(stateMarkets);
          const foundMarket = parsedMarkets.find((m: any) => m.id === id);
          if (foundMarket) {
            setMarket(foundMarket as Market);
            
            // Use image_url if available
            if (foundMarket.image_url) {
              setCurrentImageUrl(foundMarket.image_url);
            } else if (foundMarket.google_maps_link) {
              // Fallback to a street view image
              const placeId = extractPlaceIdFromLink(foundMarket.google_maps_link);
              if (placeId) {
                setCurrentImageUrl(`https://maps.googleapis.com/maps/api/streetview?size=600x300&location=place_id:${placeId}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`);
              } else {
                setCurrentImageUrl('/images/farmers-market-placeholder.jpg');
              }
            } else {
              setCurrentImageUrl('/images/farmers-market-placeholder.jpg');
            }
          } else {
            setError('Failed to load market details. Please try again later.');
          }
        } else {
          setError('Failed to load market details. Please try again later.');
        }
      } catch (fallbackErr) {
        setError('Failed to load market details. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to extract place ID from Google Maps link
  const extractPlaceIdFromLink = (link: string): string | undefined => {
    const placeMatch = link.match(/place\/([^/]+)/);
    if (placeMatch && placeMatch[1]) {
      return placeMatch[1];
    }
    return undefined;
  };

  // Fetch Google Places data - only use for additional details, not for images
  useEffect(() => {
    const fetchGoogleData = async () => {
      if (!market) {
        setGoogleLoading(false);
        return;
      }

      // If we don't have a Google Place ID and can't extract one from the link, we can't fetch Google data
      let placeId = market.google_place_id;
      if (!placeId && market.google_maps_link) {
        placeId = extractPlaceIdFromLink(market.google_maps_link);
      }
      
      if (!placeId) {
        setGoogleLoading(false);
        return;
      }

      setGoogleLoading(true);
      try {
        const data = await getMarketDetails(placeId);
        
        // Process the data - but DON'T use for images unless necessary
        setGoogleData({
          name: data.name,
          formatted_address: data.formatted_address,
          formatted_phone_number: data.formatted_phone_number,
          website: data.website,
          rating: data.rating,
          user_ratings_total: data.user_ratings_total,
          opening_hours: data.opening_hours,
          // Only set photos if we really need them (current image failed and we have no other option)
          photos: imageError ? data.photos?.map(photo => 
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
          ) : undefined,
          reviews: data.reviews?.map(review => ({
            text: review.text,
            rating: review.rating,
            author: review.author_name,
            relative_time: review.relative_time_description
          }))
        });

        // Only update image if current image failed and Google has photos
        if (imageError && data.photos && data.photos.length > 0) {
          setCurrentImageUrl(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${data.photos[0].photo_reference}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`);
        }
      } catch (err) {
        console.error('Error fetching Google data:', err);
        // Don't set error state here, as we still have basic market data
      } finally {
        setGoogleLoading(false);
      }
    };

    fetchGoogleData();
  }, [market, imageError]);

  // Search functionality
  useEffect(() => {
    if (!searchTerm || !searchTerm.trim() || !market) {
      setSearchResults({
        infoMatches: false,
        reviewMatches: [],
        highlightedContent: {}
      });
      return;
    }

    const term = searchTerm.toLowerCase();
    let infoMatches = false;
    let reviewMatches: string[] = [];
    let highlightedContent: Record<string, React.ReactNode> = {};

    // Search in market info
    const marketInfo = [
      market.Name || '',
      market.Address || '',
      market.phone_number || '',
      market.website || '',
      market.google_maps_link || '',
      // Add any other fields you want to search
    ].filter(Boolean);

    // Check if any market info matches
    infoMatches = marketInfo.some(info => 
      typeof info === 'string' && info.toLowerCase().includes(term)
    );

    // Search in Google data
    if (googleData) {
      // Check Google data fields
      const googleInfo = [
        googleData.name,
        googleData.formatted_address,
        googleData.formatted_phone_number,
        googleData.website,
        googleData.opening_hours?.weekday_text?.join(' ')
      ].filter(Boolean);

      infoMatches = infoMatches || googleInfo.some(info => 
        typeof info === 'string' && info.toLowerCase().includes(term)
      );

      // Search in reviews
      if (googleData.reviews) {
        reviewMatches = googleData.reviews
          .filter(review => review.text.toLowerCase().includes(term))
          .map(review => review.text);

        // Create highlighted content for reviews
        googleData.reviews.forEach((review, index) => {
          if (review.text.toLowerCase().includes(term)) {
            const parts = review.text.split(new RegExp(`(${term})`, 'gi'));
            highlightedContent[`review-${index}`] = (
              <>
                {parts.map((part, i) => 
                  part.toLowerCase() === term.toLowerCase() 
                    ? <mark key={i} className="bg-yellow-200">{part}</mark> 
                    : part
                )}
              </>
            );
          }
        });
      }
    }

    setSearchResults({
      infoMatches,
      reviewMatches,
      highlightedContent
    });
  }, [searchTerm, market, googleData]);

  const handleImageError = () => {
    console.log(`Image error: ${currentImageUrl}`);
    setImageError(true);
    
    // Try market image if Google image failed
    if (market?.image_link && currentImageUrl !== market.image_link) {
      setCurrentImageUrl(market.image_link);
    } 
    // Otherwise use a fallback
    else {
      const randomIndex = Math.floor(Math.random() * FALLBACK_IMAGES.length);
      setCurrentImageUrl(FALLBACK_IMAGES[randomIndex]);
    }
  };

  const handleBackClick = () => {
    // Check if we have a fromPath in the location state
    if (location.state && location.state.fromPath) {
      navigate(location.state.fromPath);
    } 
    // Otherwise check if we can go back in history
    else if (window.history.length > 1) {
      navigate(-1);
    } 
    // If all else fails, go to home
    else {
      navigate('/');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  // Example market data structure for SEO purposes
  const marketData = market ? {
    id: market._id,
    name: market.Name,
    address: market.Address,
    city: market.Address.split(',')[0] || '', // Extract city from address
    state: market.state || '', // Make state optional
    zipCode: market.zipCode || '',
    description: `Visit ${market.Name} in ${market.Address}. Find fresh produce, artisanal goods, and support local farmers.`,
    openingHours: market.googleData?.currentOpeningHours || [],
    telephone: market.phone_number || '',
    website: market.website || '',
    products: market.products || [],
    latitude: market.latitude || 0,
    longitude: market.longitude || 0
  } : {
    id: id || '',
    name: 'Farmers Market',
    address: '123 Market Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    description: 'A vibrant farmers market offering fresh, locally-grown produce and artisanal goods.',
    openingHours: ['Saturday: 8:00 AM - 2:00 PM', 'Sunday: Closed'],
    telephone: '(555) 123-4567',
    website: 'https://example.com',
    products: ['Organic Vegetables', 'Fresh Fruits', 'Artisanal Bread', 'Local Honey'],
    latitude: 40.7128,
    longitude: -74.0060
  };

  // Generate structured data for this market
  const structuredData = generateMarketStructuredData(marketData);

  // Generate SEO metadata
  const seoMetadata = market ? {
    title: `${market.Name} - Farmers Market in ${market.state || 'United States'}`,
    description: `Visit ${market.Name}, a local farmers market located at ${market.Address}. ${market.phone_number ? `Contact us at ${market.phone_number}.` : ''} Find fresh local produce and support local farmers.`,
    keywords: `farmers market, ${market.Name}, local produce, ${market.state || ''} farmers market, fresh produce, local farmers`,
    openGraph: {
      title: `${market.Name} - Farmers Market`,
      description: `Visit ${market.Name}, a local farmers market located at ${market.Address}.`,
      image: currentImageUrl || FALLBACK_IMAGES[0],
      type: 'business',
      site_name: 'Farmers Market Directory'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${market.Name} - Farmers Market`,
      description: `Visit ${market.Name}, a local farmers market located at ${market.Address}.`,
      image: currentImageUrl || FALLBACK_IMAGES[0]
    }
  } : null;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error || !market) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-500 text-center">{error || 'Market not found'}</div>
        <div className="text-center mt-4">
          <Link to="/" className="text-green-600 hover:text-green-800">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {seoMetadata && <SEOMetadata {...seoMetadata} />}
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <button 
            onClick={handleBackClick}
            className="text-green-600 hover:text-green-800 inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Hero Image */}
          <div className="relative h-64 md:h-96">
            {currentImageUrl ? (
              <img
                src={currentImageUrl}
                alt={market.Name}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
            
            {/* Rating Badge */}
            {(market.rating || googleData?.rating) && (
              <div className="absolute top-4 right-4 bg-white/90 rounded-full px-3 py-1 flex items-center shadow-md">
                <span className="text-yellow-500 mr-1">★</span>
                <span className="font-medium">{googleData?.rating || market.rating}</span>
                {googleData?.user_ratings_total && (
                  <span className="text-gray-500 text-sm ml-1">({googleData.user_ratings_total})</span>
                )}
              </div>
            )}
          </div>

          {/* Market Details */}
          <div className="p-6">
            <h1 className="text-3xl font-bold text-green-800 mb-2">
              {googleData?.name || market.Name}
            </h1>
            <p className="text-gray-600 mb-6">
              {googleData?.formatted_address || market.Address}
            </p>

            {/* Search Box */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search in market details, hours, reviews..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
                {searchTerm && (
                  <button 
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              {searchTerm && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    {searchResults.infoMatches || searchResults.reviewMatches.length > 0 
                      ? `Found matches in ${searchResults.infoMatches ? 'market information' : ''}${searchResults.infoMatches && searchResults.reviewMatches.length > 0 ? ' and ' : ''}${searchResults.reviewMatches.length > 0 ? `${searchResults.reviewMatches.length} reviews` : ''}`
                      : 'No matches found'
                  }
                  </p>
                  {searchResults.reviewMatches.length > 0 && (
                    <button 
                      onClick={() => setActiveTab('reviews')}
                      className="text-sm text-green-600 hover:text-green-800 mt-1"
                    >
                      View matching reviews
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'info'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Information
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`flex-1 py-2 text-center ${
                    activeTab === 'reviews'
                      ? 'bg-green-700 text-white font-bold'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  Reviews
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MarketPage;