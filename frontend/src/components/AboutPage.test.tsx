import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import AboutPage from './AboutPage';

describe('AboutPage', () => {
  test('renders the About page with correct content', () => {
    render(
      <BrowserRouter>
        <AboutPage />
      </BrowserRouter>
    );
    
    // Check for main heading
    expect(screen.getByText('About Us')).toBeInTheDocument();
    
    // Check for key sections
    expect(screen.getByText('Who We Are')).toBeInTheDocument();
    expect(screen.getByText('Why We Created This Platform')).toBeInTheDocument();
    expect(screen.getByText('What Makes Us Different?')).toBeInTheDocument();
    expect(screen.getByText('Join the Movement!')).toBeInTheDocument();
    
    // Check for creator information
    expect(screen.getByText('Meet the Creator')).toBeInTheDocument();
    expect(screen.getByText('Aniruddha W. Gedam')).toBeInTheDocument();
    
    // Check for call to action button
    expect(screen.getByText('Find Markets Near You')).toBeInTheDocument();
  });
}); 