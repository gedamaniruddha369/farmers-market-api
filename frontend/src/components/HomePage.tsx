import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { states, stateAbbreviations } from '../data';
import { Market } from '../types';
import FeaturedMarkets from './FeaturedMarkets';
import { API_URL, buildApiUrl } from '../services/apiConfig';
import { getStateMarketCounts } from '../services/api';

interface StateCount {
  _id: string;
  count: number;
}

const HomePage: React.FC = () => {
  const [searchResults, setSearchResults] = useState<Market[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [stateCounts, setStateCounts] = useState<StateCount[]>([]);
  const [totalMarkets, setTotalMarkets] = useState(0);

  useEffect(() => {
    const fetchStateCounts = async () => {
      try {
        const data = await getStateMarketCounts();
        const totalMarkets = data.reduce((acc: number, state: { count: number }) => acc + state.count, 0);
        setStateCounts(data);
        setTotalMarkets(totalMarkets);
      } catch (error) {
        console.error('Error fetching state counts:', error);
      }
    };

    fetchStateCounts();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery) return;

    setLoading(true);
    setError(null);
    try {
      let queryParams = new URLSearchParams();
      if (/^\d{5}$/.test(searchQuery)) {
        queryParams.append('q', searchQuery);
      } else if (searchQuery.length === 2) {
        queryParams.append('state', searchQuery.toUpperCase());
      } else {
        throw new Error('Please enter a valid ZIP code or state abbreviation (e.g., VA)');
      }

      const url = buildApiUrl(`/api/markets/search?${queryParams}`);
      console.log('Fetching:', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch markets');
      }
      
      const data = await response.json();
      if (data && data.markets) {
        setSearchResults(data.markets);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const queryParams = new URLSearchParams({
              lat: position.coords.latitude.toString(),
              lng: position.coords.longitude.toString(),
              radius: '10'
            });
            
            const url = buildApiUrl(`/api/markets/search?${queryParams}`);
            console.log('Fetching:', url);
            const response = await fetch(url);
            
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Failed to fetch markets');
            }
            
            const data = await response.json();
            if (data && data.markets) {
              setSearchResults(data.markets);
            } else {
              throw new Error('Invalid response format');
            }
          } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Search error:', err);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          setError('Unable to get your location. Please try searching by state or ZIP code.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  };

  return (
    <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
      {/* Hero Section */}
      <section className="relative mb-16 py-20 rounded-2xl overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0" 
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.7)'
          }}
        ></div>
        
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-white mb-6">
            Find Your Local Farmers Market
          </h1>
          <p className="text-xl text-white mb-12">
            Support local farmers and discover fresh, seasonal produce near you
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Enter ZIP code or state abbreviation (e.g., VA)"
                className="flex-1 px-4 py-3 rounded-lg border border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-gray-800 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleSearch}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold flex-shrink-0"
                >
                  Search
                </button>
                <button
                  onClick={handleLocationClick}
                  className="px-8 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors text-lg font-semibold flex-shrink-0"
                >
                  Near Me
                </button>
              </div>
            </div>
            {error && <div className="mt-4 text-red-500 bg-white/90 p-2 rounded">{error}</div>}
          </div>
        </div>
      </section>

      {/* State Links Grid */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-green-700 mb-2">Browse Markets by State</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {states.map((state) => {
            const stateAbbr = stateAbbreviations[state];
            const stateCount = stateCounts.find(s => 
              s._id.trim().toUpperCase() === state.toUpperCase() || 
              s._id.trim().toUpperCase() === stateAbbr
            );
            return (
              <Link
                key={state}
                to={`/state/${stateAbbr}`}
                className="p-3 text-center bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="font-semibold">{state}</div>
                <div className="text-sm text-gray-500">{stateAbbr}</div>
                {stateCount && (
                  <div className="text-sm text-green-600">
                    {stateCount.count} markets
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Markets Section */}
      <section className="mb-16">
        <FeaturedMarkets />
      </section>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-green-700 mb-6">Search Results</h2>
          <div className="grid grid-cols-1 gap-4">
            {searchResults.map((market) => (
              <div key={market._id} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-green-800">{market.Name}</h3>
                <p className="text-gray-600">{market.Address}</p>
                {market.phone_number && (
                  <p className="text-gray-600">Phone: {market.phone_number}</p>
                )}
                {market.website && (
                  <a
                    href={market.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Visit Website
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && <div className="text-center">Loading...</div>}
    </div>
  );
};

export default HomePage; 