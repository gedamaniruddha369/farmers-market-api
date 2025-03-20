import React from 'react';
import { Link } from 'react-router-dom';

const BlogPage: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-green-50 to-white min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-green-800 mb-6">PlanetWiseLiving Blog</h1>
          
          <div className="bg-white rounded-lg shadow-md p-12 mb-10">
            <div className="flex flex-col items-center justify-center">
              <svg 
                className="w-24 h-24 text-green-600 mb-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                />
              </svg>
              
              <h2 className="text-3xl font-bold text-green-700 mb-4">Coming Soon!</h2>
              
              <p className="text-xl text-gray-600 mb-6">
                We're working on creating valuable content about farmers' markets, 
                sustainable living, and local food systems.
              </p>
              
              <p className="text-lg text-gray-600 mb-8">
                Check back soon for articles, guides, and stories about:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto mb-8">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="font-semibold text-green-800 mb-2">🌱 Seasonal Produce Guides</p>
                  <p className="text-gray-700">What's fresh and when to buy it</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="font-semibold text-green-800 mb-2">👨‍🌾 Farmer Spotlights</p>
                  <p className="text-gray-700">Stories from local growers</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="font-semibold text-green-800 mb-2">🍽️ Farm-to-Table Recipes</p>
                  <p className="text-gray-700">Delicious ways to use market finds</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="font-semibold text-green-800 mb-2">♻️ Sustainable Living Tips</p>
                  <p className="text-gray-700">Eco-friendly practices for everyday life</p>
                </div>
              </div>
              
              <Link 
                to="/" 
                className="inline-block px-6 py-3 bg-green-600 text-white font-medium rounded-md shadow-sm hover:bg-green-700 transition-colors"
              >
                Explore Farmers' Markets
              </Link>
            </div>
          </div>
          
          <div className="text-gray-600">
            <p>
              Want to contribute to our blog or suggest topics? 
              <Link to="/contact" className="text-green-600 hover:text-green-800 ml-1">
                Contact us
              </Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage; 