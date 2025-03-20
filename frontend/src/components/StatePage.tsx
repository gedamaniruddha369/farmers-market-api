import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Market } from '../types';
import { stateAbbreviations } from '../data';
import { buildApiUrl } from '../services/apiConfig';

// Fallback images in case the market image is not available
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1579113800032-c38bd7635818?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1526399232581-2ab5608b6336?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1595880500386-4b33ba8d2161?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
];

// Store scroll positions by state name
const scrollPositions: Record<string, number> = {};

interface PaginationResponse {
  markets: Market[];
  total: number;
  page: number;
  totalPages: number;
}

const MarketCard: React.FC<{ market: Market }> = ({ market }) => {
  const [imageError, setImageError] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // If market has an image link, use it
    if (market.image_link && !imageError) {
      setCurrentImageUrl(market.image_link);
    } 
    // Otherwise use a random fallback image
    else {
      const randomIndex = Math.floor(Math.random() * FALLBACK_IMAGES.length);
      setCurrentImageUrl(FALLBACK_IMAGES[randomIndex]);
    }
  }, [market.image_link, imageError]);

  const handleImageError = () => {
    console.log(`Image error for ${market.Name}: ${currentImageUrl}`);
    setImageError(true);
    
    // If the market image failed, use a fallback
    const randomIndex = Math.floor(Math.random() * FALLBACK_IMAGES.length);
    setCurrentImageUrl(FALLBACK_IMAGES[randomIndex]);
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleMarketClick = () => {
    // Save current scroll position before navigating
    if (location.pathname.includes('/state/')) {
      const stateAbbr = location.pathname.split('/').pop();
      if (stateAbbr) {
        scrollPositions[stateAbbr] = window.scrollY;
      }
    }
  };

  return (
    <Link 
      to={`/market/${market._id}`} 
      state={{ market, fromPath: location.pathname }} 
      className="block"
      onClick={handleMarketClick}
    >
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden h-full">
        <div className="relative h-48">
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="animate-pulse w-full h-full bg-gray-200"></div>
            </div>
          )}
          {currentImageUrl && (
            <img
              src={currentImageUrl}
              alt={market.Name}
              className={`w-full h-full object-cover transition-opacity duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          )}
          {market.rating && (
            <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1 flex items-center">
              <span className="text-yellow-500 mr-1">★</span>
              <span className="font-medium">{market.rating}</span>
            </div>
          )}
        </div>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-green-700 mb-2">{market.Name}</h2>
          <p className="text-gray-600 mb-4 line-clamp-2">{market.Address}</p>
          
          <div className="flex flex-wrap gap-4">
            {market.phone_number && (
              <a
                href={`tel:${market.phone_number}`}
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                Call
              </a>
            )}
            
            {market.website && (
              <a
                href={market.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
                Website
              </a>
            )}

            {market.google_maps_link && (
              <a
                href={market.google_maps_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Directions
              </a>
            )}
          </div>
          
          <div className="mt-4 text-right">
            <span className="text-green-600 hover:text-green-800 text-sm font-medium inline-flex items-center">
              View Details
              <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const StatePage: React.FC = () => {
  const { state } = useParams<{ state: string }>();
  const location = useLocation();
  const [markets, setMarkets] = useState<Market[]>([]);
  const [filteredMarkets, setFilteredMarkets] = useState<Market[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalMarkets, setTotalMarkets] = useState(0);
  const initialRenderRef = useRef(true);

  // Get full state name from abbreviation
  const getFullStateName = () => {
    return Object.entries(stateAbbreviations).find(([name, abbr]) => abbr === state)?.[0] || state;
  };

  useEffect(() => {
    const fetchMarkets = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(buildApiUrl(`markets?state=${state}&page=${currentPage}&per_page=50`));
        if (!response.ok) {
          throw new Error('Failed to fetch markets');
        }
        const data: PaginationResponse = await response.json();
        console.log('Markets data:', data);
        setMarkets(data.markets);
        setFilteredMarkets(data.markets);
        setTotalPages(data.totalPages);
        setTotalMarkets(data.total);
      } catch (err) {
        console.error('Error fetching markets:', err);
        setError('Failed to load markets. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (state) {
      fetchMarkets();
    }
  }, [state, currentPage]);

  // Filter markets based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMarkets(markets);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = markets.filter(market => {
        // Basic search on known properties
        const nameMatch = market.Name?.toLowerCase().includes(term) || false;
        const addressMatch = market.Address?.toLowerCase().includes(term) || false;
        
        // Search on any string properties that might exist
        const otherMatch = Object.entries(market as Record<string, any>).some(([key, value]) => 
          typeof value === 'string' && 
          !['Name', 'Address'].includes(key) && 
          value.toLowerCase().includes(term)
        );
        
        return nameMatch || addressMatch || otherMatch;
      });
      setFilteredMarkets(filtered);
    }
  }, [searchTerm, markets]);

  // Restore scroll position after data is loaded
  useEffect(() => {
    if (!loading && state && scrollPositions[state] && initialRenderRef.current) {
      // Use a small timeout to ensure the DOM has updated
      const timeoutId = setTimeout(() => {
        window.scrollTo(0, scrollPositions[state]);
        initialRenderRef.current = false;
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [loading, state]);

  // Reset initialRender when state changes
  useEffect(() => {
    initialRenderRef.current = true;
  }, [state]);

  const handlePageChange = (newPage: number) => {
    // Save current scroll position before changing page
    if (state) {
      scrollPositions[state] = window.scrollY;
    }
    
    setCurrentPage(newPage);
    window.scrollTo(0, 0); // For page changes, we do want to scroll to top
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  if (loading && initialRenderRef.current) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-800 mb-6">
        Farmers Markets in {getFullStateName()}
      </h1>
      <p className="text-gray-600 mb-6">
        Found {totalMarkets} market{totalMarkets !== 1 ? 's' : ''} in {getFullStateName()}
      </p>

      {/* Search Box */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search markets by name, address, or products..."
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
          <p className="mt-2 text-sm text-gray-600">
            Found {filteredMarkets.length} market{filteredMarkets.length !== 1 ? 's' : ''} matching "{searchTerm}"
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMarkets.map((market) => (
          <MarketCard key={market._id} market={market} />
        ))}
      </div>

      {filteredMarkets.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <p className="text-gray-600">No markets found matching your search.</p>
          <button 
            onClick={clearSearch}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Pagination - only show when not searching */}
      {totalPages > 1 && !searchTerm && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded ${
              currentPage === 1
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded ${
              currentPage === totalPages
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default StatePage; 