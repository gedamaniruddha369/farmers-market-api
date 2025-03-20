import React from 'react';
import { Link } from 'react-router-dom';
import LazyImage from './common/LazyImage';

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-green-800 mb-6 text-center">About Us</h1>
        
        {/* Hero Banner */}
        <div className="relative rounded-xl overflow-hidden mb-10 shadow-lg">
          <LazyImage 
            src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
            alt="Vibrant farmers market with fresh produce and local vendors" 
            className="w-full h-64 md:h-80 object-cover"
            width={1200}
            height={320}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-6 text-white">
              <p className="text-2xl font-bold mb-2">
                🌱 Connecting You with Fresh, Local Goodness!
              </p>
              <p className="text-lg">
                Discover the joy of farm-fresh food at your local farmers' markets
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-10">
          <p className="text-gray-700 mb-8 text-lg">
            At PlanetWiseLiving, we believe in the power of fresh, locally sourced food and the communities that support it. 
            Our mission is simple: to help you discover, explore, and connect with farmers' markets across the United States.
          </p>
          
          <div className="mb-10">
            <div className="flex flex-col md:flex-row items-center mb-6">
              <h2 className="text-2xl font-bold text-green-800 mb-4 md:mb-0 md:mr-4">Who We Are</h2>
              <div className="flex-grow h-0.5 bg-green-100 rounded"></div>
            </div>
            
            <div className="md:flex items-center">
              <div className="md:w-1/3 mb-6 md:mb-0 md:pr-6">
                <LazyImage 
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Colorful array of fresh organic produce at a local farmers market" 
                  className="rounded-lg shadow-md w-full h-auto"
                  width={600}
                  height={400}
                />
              </div>
              <div className="md:w-2/3">
                <p className="text-gray-700 mb-4">
                  PlanetWiseLiving is an online Farmers' Market Directory dedicated to promoting sustainable living, 
                  healthy eating, and local agriculture. We provide a comprehensive, easy-to-use platform where you can:
                </p>
                <ul className="list-none space-y-2 mb-4 pl-6">
                  <li className="flex items-start">
                    <span className="text-green-600 font-bold mr-2">✅</span>
                    <span>Find farmers' markets by location, name, or ZIP code.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 font-bold mr-2">✅</span>
                    <span>Explore fresh produce, artisanal products, and local vendors.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 font-bold mr-2">✅</span>
                    <span>Support small-scale farmers and organic growers in your area.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mb-10">
            <div className="flex flex-col md:flex-row items-center mb-6">
              <h2 className="text-2xl font-bold text-green-800 mb-4 md:mb-0 md:mr-4">Why We Created This Platform</h2>
              <div className="flex-grow h-0.5 bg-green-100 rounded"></div>
            </div>
            
            <p className="text-gray-700 mb-4">
              In a fast-paced world, finding authentic, fresh food can be a challenge. 
              We built PlanetWiseLiving to make it effortless for you to:
            </p>
            <div className="md:flex items-center">
              <div className="md:w-2/3 pr-0 md:pr-6">
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4 pl-4">
                  <li>Eat healthier with farm-fresh, organic produce.</li>
                  <li>Support local farmers and small businesses.</li>
                  <li>Make sustainable choices that benefit both you and the planet.</li>
                </ul>
                <p className="text-gray-700 italic">
                  "We're passionate about connecting communities with the people who grow their food, fostering relationships that benefit everyone involved."
                </p>
              </div>
              <div className="md:w-1/3 mt-6 md:mt-0">
                <img 
                  src="https://images.unsplash.com/photo-1579113800032-c38bd7635818?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Farmer with fresh produce" 
                  className="rounded-lg shadow-md w-full h-auto"
                />
              </div>
            </div>
          </div>
          
          <div className="mb-10">
            <div className="flex flex-col md:flex-row items-center mb-6">
              <h2 className="text-2xl font-bold text-green-800 mb-4 md:mb-0 md:mr-4">What Makes Us Different?</h2>
              <div className="flex-grow h-0.5 bg-green-100 rounded"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="font-semibold text-green-800 mb-2">🌾 A Nationwide Directory</p>
                <p className="text-gray-700">Access listings of farmers' markets in all 50 states.</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="font-semibold text-green-800 mb-2">🍎 User-Friendly Search</p>
                <p className="text-gray-700">Easily search by market name, address, or ZIP code.</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="font-semibold text-green-800 mb-2">🌍 A Commitment to Sustainability</p>
                <p className="text-gray-700">We advocate for eco-friendly food choices and ethical farming practices.</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="font-semibold text-green-800 mb-2">🤝 Community-Driven</p>
                <p className="text-gray-700">We welcome market owners and visitors to share insights, reviews, and updates.</p>
              </div>
            </div>
          </div>
          
          <div className="mb-10">
            <div className="flex flex-col md:flex-row items-center mb-6">
              <h2 className="text-2xl font-bold text-green-800 mb-4 md:mb-0 md:mr-4">Join the Movement!</h2>
              <div className="flex-grow h-0.5 bg-green-100 rounded"></div>
            </div>
            
            <p className="text-gray-700 mb-4">
              Whether you're a health-conscious foodie, a sustainability advocate, or someone simply looking for the freshest ingredients, 
              PlanetWiseLiving is here for you.
            </p>
            <p className="text-gray-700 mb-6">
              Start your journey toward healthier, fresher, and more sustainable choices today! 🌿
            </p>
            
            <div className="bg-green-50 border border-green-100 rounded-lg p-6 text-center">
              <p className="text-xl font-semibold text-green-800 mb-2">Ready to discover local markets?</p>
              <Link 
                to="/" 
                className="inline-block mt-2 px-6 py-3 bg-green-600 text-white font-medium rounded-md shadow-sm hover:bg-green-700 transition-colors"
              >
                Find Markets Near You
              </Link>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h3 className="text-xl font-bold text-green-800 mb-2">Meet the Creator</h3>
                <p className="text-gray-700 mb-1">
                  <span className="font-semibold">Aniruddha W. Gedam</span>
                </p>
                <p className="text-gray-700 italic">
                  A developer, helping people to make their life easy
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <p className="text-gray-700">
                  <span className="font-semibold">📧 Contact:</span>{' '}
                  <a 
                    href="mailto:contact@planetwiseliving.com" 
                    className="text-green-600 hover:text-green-800"
                  >
                    contact@planetwiseliving.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Link 
            to="/contact" 
            className="inline-flex items-center text-green-600 hover:text-green-800 font-medium"
          >
            Have questions or want to list your market?
            <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 