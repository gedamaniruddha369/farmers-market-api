import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FeaturedMarket, featuredMarkets } from '../data/featuredMarkets';
import { getMarketDetails, getPlacePhoto } from '../services/googlePlaces';

interface MarketWithGoogleData extends FeaturedMarket {
  googleData?: {
    rating?: number;
    currentOpeningHours?: string[];
    photos?: string[];
    reviews?: Array<{
      text: string;
      rating: number;
      author: string;
    }>;
  };
}

// Fallback images in case both Google and Unsplash fail
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1579113800032-c38bd7635818?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
];

const MarketCard: React.FC<{ market: MarketWithGoogleData }> = ({ market }) => {
  const [imageError, setImageError] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(market.imageUrl);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    // If we have Google photos, try to use the first one
    if (market.googleData?.photos?.[0] && !imageError) {
      setCurrentImageUrl(market.googleData.photos[0]);
      setIsImageLoading(true);
    }
  }, [market.googleData?.photos, imageError]);

  const handleImageError = () => {
    console.log(`Image error for ${market.name}: ${currentImageUrl}`);
    setImageError(true);
    
    // If Google photo failed, try the Unsplash fallback
    if (currentImageUrl !== market.imageUrl) {
      setCurrentImageUrl(market.imageUrl);
    } 
    // If Unsplash fallback failed, use a generic fallback
    else {
      const randomIndex = Math.floor(Math.random() * FALLBACK_IMAGES.length);
      setCurrentImageUrl(FALLBACK_IMAGES[randomIndex]);
    }
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <div className="relative h-48">
        {isImageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-pulse w-full h-full bg-gray-200"></div>
          </div>
        )}
        <img
          src={currentImageUrl}
          alt={market.name}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h3 className="text-white text-xl font-bold">{market.name}</h3>
          <p className="text-white/90">{market.city}, {market.state}</p>
          {market.googleData?.rating && (
            <div className="flex items-center mt-1">
              <span className="text-yellow-400">★</span>
              <span className="text-white ml-1">{market.googleData.rating}</span>
            </div>
          )}
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-600 mb-4 line-clamp-2">{market.description}</p>
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Highlights:</h4>
          <ul className="list-disc list-inside text-sm text-gray-600">
            {market.highlights.slice(0, 3).map((highlight, index) => (
              <li key={index} className="line-clamp-1">{highlight}</li>
            ))}
          </ul>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-gray-500">
            {market.googleData?.currentOpeningHours ? (
              <div className="space-y-1">
                <p className="font-semibold">Current Hours:</p>
                {market.googleData.currentOpeningHours.slice(0, 2).map((hours, index) => (
                  <p key={index} className="line-clamp-1">{hours}</p>
                ))}
                {market.googleData.currentOpeningHours.length > 2 && (
                  <button className="text-green-600 hover:text-green-800">
                    Show more hours
                  </button>
                )}
              </div>
            ) : (
              <p className="line-clamp-1">{market.operatingHours}</p>
            )}
          </div>
          {market.website && (
            <a
              href={market.website}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-green-600 hover:text-green-800 text-sm font-medium"
            >
              Visit Website →
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const FeaturedMarkets: React.FC = () => {
  const [marketsWithData, setMarketsWithData] = useState<MarketWithGoogleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGoogleData = async () => {
      try {
        // First, set the markets with just the basic data so we can show something
        setMarketsWithData(featuredMarkets);
        
        const updatedMarkets = await Promise.all(
          featuredMarkets.map(async (market) => {
            try {
              const placeId = market.id;
              const googleData = await getMarketDetails(placeId);
              
              // Get photo URLs if available
              const photoUrls = googleData.photos?.map(photo => 
                getPlacePhoto(photo.photo_reference)
              ) || [];

              return {
                ...market,
                googleData: {
                  rating: googleData.rating,
                  currentOpeningHours: googleData.opening_hours?.weekday_text,
                  photos: photoUrls,
                  reviews: googleData.reviews?.map(review => ({
                    text: review.text,
                    rating: review.rating,
                    author: review.author_name
                  }))
                }
              };
            } catch (error) {
              console.error(`Error fetching data for ${market.name}:`, error);
              // Return the market with basic data if Google Places fails
              return market;
            }
          })
        );
        setMarketsWithData(updatedMarkets);
        setError(null);
      } catch (error) {
        console.error('Error fetching market data:', error);
        // Keep showing the basic market data even if Google Places fails
        setMarketsWithData(featuredMarkets);
        setError('Some market details may be unavailable. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGoogleData();
  }, []);

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Markets</h2>
        <p className="text-gray-600 mb-8">Discover some of America's most iconic farmers markets</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {marketsWithData.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
        
        {loading && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
              <p className="text-gray-600">Loading market information...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-center">
            {error}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedMarkets; 