import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import TermsPage from './TermsPage';

describe('TermsPage', () => {
  test('renders the Terms and Conditions page with correct content', () => {
    render(
      <BrowserRouter>
        <TermsPage />
      </BrowserRouter>
    );
    
    // Check for main heading
    expect(screen.getByText('Terms and Conditions')).toBeInTheDocument();
    
    // Check for key sections
    expect(screen.getByText('1. Acceptance of Terms')).toBeInTheDocument();
    expect(screen.getByText('2. Services Provided')).toBeInTheDocument();
    expect(screen.getByText('3. User Responsibilities')).toBeInTheDocument();
    expect(screen.getByText('4. Farmers\' Market Listings')).toBeInTheDocument();
    expect(screen.getByText('5. User-Generated Content (Reviews & Comments)')).toBeInTheDocument();
    expect(screen.getByText('6. Intellectual Property')).toBeInTheDocument();
    expect(screen.getByText('7. External Links & Third-Party Services')).toBeInTheDocument();
    expect(screen.getByText('8. Disclaimer of Warranties')).toBeInTheDocument();
    expect(screen.getByText('9. Limitation of Liability')).toBeInTheDocument();
    expect(screen.getByText('10. Termination of Access')).toBeInTheDocument();
    expect(screen.getByText('11. Governing Law')).toBeInTheDocument();
    expect(screen.getByText('12. Contact Information')).toBeInTheDocument();
    
    // Check for back to home link
    expect(screen.getByText('← Back to Home')).toBeInTheDocument();
  });
}); 