import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEOMetadata from './SEOMetadata';
import { getCurrentLocation, getLocationFromCoordinates, findMarketsNearMe, Coordinates, LocationData } from '../services/geolocationService';
import { generateStatePageStructuredData } from '../utils/structuredData';

// Import your market data or API service here
// import { getAllMarkets } from '../services/marketService';

const NearMePage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);
  const [nearbyMarkets, setNearbyMarkets] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchUserLocationAndMarkets = async () => {
      try {
        setLoading(true);
        
        // Get user's coordinates
        const coordinates = await getCurrentLocation();
        
        // Get location data from coordinates
        const locationData = await getLocationFromCoordinates(coordinates);
        setUserLocation(locationData);
        
        // Fetch all markets (replace with your actual API call)
        // const allMarkets = await getAllMarkets();
        
        // For demonstration, we'll use dummy data
        const dummyMarkets = [
          {
            id: 'union-square-greenmarket',
            name: 'Union Square Greenmarket',
            coordinates: { latitude: 40.7359, longitude: -73.9911 },
            address: 'E 17th St & Union Square W',
            city: 'New York',
            state: 'NY',
            zipCode: '10003',
            products: ['Vegetables', 'Fruits', 'Baked Goods', 'Flowers'],
            image: 'https://example.com/union-square.jpg'
          },
          {
            id: 'grand-army-plaza-greenmarket',
            name: 'Grand Army Plaza Greenmarket',
            coordinates: { latitude: 40.6734, longitude: -73.9700 },
            address: 'Prospect Park W & Flatbush Ave',
            city: 'Brooklyn',
            state: 'NY',
            zipCode: '11215',
            products: ['Vegetables', 'Fruits', 'Meat', 'Dairy'],
            image: 'https://example.com/grand-army-plaza.jpg'
          },
          // Add more dummy markets as needed
        ];
        
        // Find markets near the user
        const markets = findMarketsNearMe(coordinates, dummyMarkets, 50);
        setNearbyMarkets(markets);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching location or markets:', err);
        setError('Unable to find your location. Please enable location services or try again later.');
        setLoading(false);
      }
    };
    
    fetchUserLocationAndMarkets();
  }, []);
  
  // Generate page title and description based on user location
  const pageTitle = userLocation?.city 
    ? `Farmers Markets Near ${userLocation.city}, ${userLocation.state}`
    : 'Farmers Markets Near Me';
    
  const pageDescription = userLocation?.city
    ? `Find local farmers markets near ${userLocation.city}, ${userLocation.state}. Browse fresh produce, artisanal goods, and support local agriculture in your area.`
    : 'Find local farmers markets near you. Browse fresh produce, artisanal goods, and support local agriculture in your community.';
  
  // Generate structured data
  const structuredData = userLocation?.state
    ? generateStatePageStructuredData(userLocation.state, nearbyMarkets)
    : undefined;
  
  return (
    <>
      <SEOMetadata
        title={`${pageTitle} | PlanetWiseLiving`}
        description={pageDescription}
        keywords={`farmers markets near me, local markets, ${userLocation?.city || ''} farmers market, fresh produce, organic food`}
        canonicalUrl="/near-me"
        structuredData={structuredData}
      />
      
      <div className="bg-gradient-to-b from-green-50 to-white min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-green-800 mb-6">{pageTitle}</h1>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-600">Finding farmers markets near you...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-red-700 mb-2">Location Error</h2>
              <p className="text-gray-700 mb-4">{error}</p>
              <p className="text-gray-700">
                You can still browse markets by state or use the search function to find specific markets.
              </p>
              <div className="mt-4">
                <Link 
                  to="/" 
                  className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Browse All Markets
                </Link>
              </div>
            </div>
          ) : nearbyMarkets.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-yellow-700 mb-2">No Markets Found Nearby</h2>
              <p className="text-gray-700 mb-4">
                We couldn't find any farmers markets within 50 miles of your location.
              </p>
              <p className="text-gray-700">
                Try expanding your search or browse markets by state.
              </p>
              <div className="mt-4">
                <Link 
                  to="/" 
                  className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Browse All Markets
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-lg text-gray-700 mb-6">
                {userLocation?.city 
                  ? `Showing farmers markets near ${userLocation.city}, ${userLocation.state}.`
                  : 'Showing farmers markets near your current location.'}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {nearbyMarkets.map(market => (
                  <div key={market.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="h-48 bg-gray-200 relative">
                      {market.image ? (
                        <img 
                          src={market.image} 
                          alt={market.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-green-100">
                          <span className="text-green-700">No image available</span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-sm">
                        {market.distance} miles away
                      </div>
                    </div>
                    <div className="p-4">
                      <h2 className="text-xl font-semibold text-green-800 mb-2">{market.name}</h2>
                      <p className="text-gray-600 mb-2">{market.address}</p>
                      <p className="text-gray-600 mb-3">{market.city}, {market.state} {market.zipCode}</p>
                      
                      {market.products && market.products.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-500 mb-1">Products:</p>
                          <div className="flex flex-wrap gap-1">
                            {market.products.map((product: string, index: number) => (
                              <span 
                                key={index}
                                className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                              >
                                {product}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <Link 
                        to={`/market/${market.id}`}
                        className="inline-block w-full text-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <Link 
                  to="/" 
                  className="inline-block px-6 py-3 bg-white border border-green-600 text-green-600 rounded hover:bg-green-50 transition-colors"
                >
                  Browse All Markets
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NearMePage; 