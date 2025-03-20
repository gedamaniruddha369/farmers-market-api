import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import BlogPage from './BlogPage';

describe('BlogPage', () => {
  test('renders the Blog page with coming soon message', () => {
    render(
      <BrowserRouter>
        <BlogPage />
      </BrowserRouter>
    );
    
    // Check for main heading
    expect(screen.getByText('PlanetWiseLiving Blog')).toBeInTheDocument();
    
    // Check for coming soon message
    expect(screen.getByText('Coming Soon!')).toBeInTheDocument();
    
    // Check for content description
    expect(screen.getByText(/We're working on creating valuable content/)).toBeInTheDocument();
    
    // Check for blog categories
    expect(screen.getByText('🌱 Seasonal Produce Guides')).toBeInTheDocument();
    expect(screen.getByText('👨‍🌾 Farmer Spotlights')).toBeInTheDocument();
    expect(screen.getByText('🍽️ Farm-to-Table Recipes')).toBeInTheDocument();
    expect(screen.getByText('♻️ Sustainable Living Tips')).toBeInTheDocument();
    
    // Check for call to action button
    expect(screen.getByText('Explore Farmers\' Markets')).toBeInTheDocument();
    
    // Check for contact link
    expect(screen.getByText('Contact us')).toBeInTheDocument();
  });
}); 