import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-green-100">
      <div className="container mx-auto px-6 sm:px-8 md:px-12 lg:px-16 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-green-800">PlanetWiseLiving</span>
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-green-700 hover:text-green-900">Home</Link>
            <Link to="/near-me" className="text-green-700 hover:text-green-900">Markets Near Me</Link>
            <Link to="/blog" className="text-green-700 hover:text-green-900">Blog</Link>
            <Link to="/about" className="text-green-700 hover:text-green-900">About</Link>
            <Link to="/contact" className="text-green-700 hover:text-green-900">Contact</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 