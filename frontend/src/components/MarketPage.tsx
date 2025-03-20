import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { Market } from '../types';
import { getMarketDetails } from '../services/googlePlaces';
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

  // Fetch basic market data
  const fetchMarketData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Try to fetch from the API
      const response = await fetch(buildApiUrl(`markets/${id}`));
      if (!response.ok) {
        throw new Error('Failed to fetch market details');
      }
      const data = await response.json();
      setMarket(data);
      
      // Set initial image
      if (data.image_link) {
        setCurrentImageUrl(data.image_link);
      } else {
        const randomIndex = Math.floor(Math.random() * FALLBACK_IMAGES.length);
        setCurrentImageUrl(FALLBACK_IMAGES[randomIndex]);
      }
    } catch (err) {
      console.error('Error fetching market:', err);
      
      // Try to fetch all markets and find the one we need
      try {
        const stateResponse = await fetch(buildApiUrl('markets'));
        if (stateResponse.ok) {
          const allMarkets = await stateResponse.json();
          const foundMarket = allMarkets.markets.find((m: Market) => m._id === id);
          
          if (foundMarket) {
            setMarket(foundMarket);
            if (foundMarket.image_link) {
              setCurrentImageUrl(foundMarket.image_link);
            } else {
              const randomIndex = Math.floor(Math.random() * FALLBACK_IMAGES.length);
              setCurrentImageUrl(FALLBACK_IMAGES[randomIndex]);
            }
          } else {
            setError('Market not found. Please try again later.');
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

  // Fetch Google Places data
  useEffect(() => {
    const fetchGoogleData = async () => {
      if (!market) {
        setGoogleLoading(false);
        return;
      }

      // If we don't have a Google Place ID, we can't fetch Google data
      if (!market.google_place_id) {
        setGoogleLoading(false);
        return;
      }

      setGoogleLoading(true);
      try {
        const data = await getMarketDetails(market.google_place_id);
        
        // Process the data
        setGoogleData({
          name: data.name,
          formatted_address: data.formatted_address,
          formatted_phone_number: data.formatted_phone_number,
          website: data.website,
          rating: data.rating,
          user_ratings_total: data.user_ratings_total,
          opening_hours: data.opening_hours,
          photos: data.photos?.map(photo => 
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
          ),
          reviews: data.reviews?.map(review => ({
            text: review.text,
            rating: review.rating,
            author: review.author_name,
            relative_time: review.relative_time_description
          }))
        });

        // Update image if Google has better photos
        if (data.photos && data.photos.length > 0 && !imageError) {
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
    if (!searchTerm.trim() || !market) {
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
      market.Name,
      market.Address,
      market.phone_number,
      market.website,
      market.google_maps_link,
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
  const marketData = market || {
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
      <SEOMetadata
        title={`${marketData.name} - Farmers Market in ${marketData.city}, ${marketData.state} | PlanetWiseLiving`}
        description={`Visit ${marketData.name} in ${marketData.city}, ${marketData.state}. Find fresh produce, artisanal goods, and support local farmers. Open ${marketData.openingHours?.[0] || 'weekly'}.`}
        keywords={`farmers market, ${marketData.city.toLowerCase()}, ${marketData.state.toLowerCase()}, local produce, organic food, ${marketData.products?.join(', ').toLowerCase() || ''}`}
        canonicalUrl={`/market/${id}`}
        structuredData={structuredData}
      />
      
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
                  className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'reviews'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Reviews
                </button>
                <button
                  onClick={() => setActiveTab('photos')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'photos'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Photos
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {/* Info Tab */}
              {activeTab === 'info' && (
                <div>
                  {/* Hours */}
                  {googleData?.opening_hours && (
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-green-700 mb-3">Hours</h2>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        {googleData.opening_hours.weekday_text.map((day, index) => (
                          <div key={index} className="py-1 flex">
                            <div className="w-32 font-medium">{day.split(': ')[0]}:</div>
                            <div>{day.split(': ')[1]}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contact */}
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-green-700 mb-3">Contact</h2>
                    <div className="space-y-3">
                      {(googleData?.formatted_phone_number || market.phone_number) && (
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-green-600 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                          <div>
                            <div className="font-medium">Phone</div>
                            <a href={`tel:${googleData?.formatted_phone_number || market.phone_number}`} className="text-blue-600 hover:text-blue-800">
                              {googleData?.formatted_phone_number || market.phone_number}
                            </a>
                          </div>
                        </div>
                      )}

                      {(googleData?.website || market.website) && (
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-green-600 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <div className="font-medium">Website</div>
                            <a href={googleData?.website || market.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 break-all">
                              {googleData?.website || market.website}
                            </a>
                          </div>
                        </div>
                      )}

                      {market.google_maps_link && (
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-green-600 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <div className="font-medium">Directions</div>
                            <a href={market.google_maps_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                              Get directions
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Map */}
                  {market.latitude && market.longitude && (
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-green-700 mb-3">Location</h2>
                      <div className="h-64 bg-gray-100 rounded-lg overflow-hidden">
                        <iframe
                          title="Market Location"
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=${market.latitude},${market.longitude}&zoom=15`}
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div>
                  {googleLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                    </div>
                  ) : googleData?.reviews && googleData.reviews.length > 0 ? (
                    <div className="space-y-6">
                      {googleData.reviews.map((review, index) => (
                        <div key={index} className={`border-b border-gray-100 pb-6 last:border-b-0 ${searchTerm && searchResults.reviewMatches.includes(review.text) ? 'bg-green-50 p-4 rounded-lg -mx-4' : ''}`}>
                          <div className="flex items-center mb-2">
                            <div className="font-medium">{review.author}</div>
                            <div className="ml-auto text-sm text-gray-500">{review.relative_time}</div>
                          </div>
                          <div className="flex items-center mb-2">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-400"}>★</span>
                            ))}
                          </div>
                          <p className="text-gray-600">
                            {searchTerm && searchResults.highlightedContent[`review-${index}`] 
                              ? searchResults.highlightedContent[`review-${index}`] 
                              : review.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No reviews available for this market.
                    </div>
                  )}
                </div>
              )}

              {/* Photos Tab */}
              {activeTab === 'photos' && (
                <div>
                  {googleLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
                      <p className="mt-2 text-gray-500">Loading photos...</p>
                    </div>
                  ) : googleData?.photos && googleData.photos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {googleData.photos.map((photo, index) => (
                        <div key={index} className="rounded-lg overflow-hidden h-48">
                          <img
                            src={photo}
                            alt={`${market.Name} - Photo ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Hide the image if it fails to load
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No photos available for this market.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MarketPage; 