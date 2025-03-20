import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import PrivacyPage from './PrivacyPage';

describe('PrivacyPage', () => {
  test('renders the Privacy Policy page with correct content', () => {
    render(
      <BrowserRouter>
        <PrivacyPage />
      </BrowserRouter>
    );
    
    // Check for main heading
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    
    // Check for key sections
    expect(screen.getByText('1. Information We Collect')).toBeInTheDocument();
    expect(screen.getByText('2. How We Use Your Information')).toBeInTheDocument();
    expect(screen.getByText('3. Cookies & Tracking Technologies')).toBeInTheDocument();
    expect(screen.getByText('4. Third-Party Services')).toBeInTheDocument();
    expect(screen.getByText('5. Data Security')).toBeInTheDocument();
    expect(screen.getByText('6. Third-Party Links')).toBeInTheDocument();
    expect(screen.getByText('7. Children\'s Privacy')).toBeInTheDocument();
    expect(screen.getByText('8. Your Privacy Rights')).toBeInTheDocument();
    expect(screen.getByText('9. Changes to This Policy')).toBeInTheDocument();
    expect(screen.getByText('10. Contact Us')).toBeInTheDocument();
    
    // Check for back to home link
    expect(screen.getByText('← Back to Home')).toBeInTheDocument();
  });
}); 