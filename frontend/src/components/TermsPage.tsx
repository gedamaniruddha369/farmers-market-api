import React from 'react';
import { Link } from 'react-router-dom';

const TermsPage: React.FC = () => {
  const effectiveDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-gradient-to-b from-green-50 to-white min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-green-800 mb-6">Terms and Conditions</h1>
          <p className="text-gray-600 mb-8">Effective Date: {effectiveDate}</p>

          <div className="prose prose-green max-w-none">
            <p>
              Welcome to PlanetWiseLiving (the "Website"), a platform dedicated to helping users find farmers' markets across the United States. 
              By accessing or using our website, you agree to comply with and be bound by the following Terms and Conditions ("Terms"). 
              If you do not agree to these Terms, please do not use our services.
            </p>

            <h2 className="text-xl font-semibold text-green-700 mt-6 mb-3">1. Acceptance of Terms</h2>
            <p>
              By using our website, you acknowledge that you have read, understood, and agree to abide by these Terms. 
              These Terms may be updated from time to time, and continued use of the Website constitutes acceptance of any modifications.
            </p>

            <h2 className="text-xl font-semibold text-green-700 mt-6 mb-3">2. Services Provided</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>PlanetWiseLiving provides a directory of farmers' markets to help users locate and explore local markets.</li>
              <li>We do not own, operate, or manage any of the farmers' markets listed on the Website.</li>
              <li>Information about markets (such as location, hours, contact details) is sourced from public data, market owners, and user contributions.</li>
            </ul>

            <h2 className="text-xl font-semibold text-green-700 mt-6 mb-3">3. User Responsibilities</h2>
            <p>By using our Website, you agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate and truthful information when submitting listings, reviews, or inquiries.</li>
              <li>Use the Website lawfully and avoid any activities that could harm its functionality.</li>
              <li>Refrain from submitting false, misleading, or defamatory content.</li>
            </ul>

            <h2 className="text-xl font-semibold text-green-700 mt-6 mb-3">4. Farmers' Market Listings</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>The information provided on the Website is for general informational purposes only and may change without notice.</li>
              <li>We strive to keep information up-to-date, but we do not guarantee the accuracy, completeness, or reliability of the listings.</li>
              <li>Market owners may request updates or corrections to their listings by contacting us at <a href="mailto:contact@planetwiseliving.com" className="text-green-600 hover:text-green-800">contact@planetwiseliving.com</a>.</li>
            </ul>

            <h2 className="text-xl font-semibold text-green-700 mt-6 mb-3">5. User-Generated Content (Reviews & Comments)</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Users may submit reviews, ratings, and comments about farmers' markets.</li>
              <li>By posting content, you grant PlanetWiseLiving a non-exclusive, royalty-free license to use, modify, and display the content on our website.</li>
              <li>We reserve the right to remove any content that is inappropriate, offensive, false, or violates laws.</li>
            </ul>

            <h2 className="text-xl font-semibold text-green-700 mt-6 mb-3">6. Intellectual Property</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>All website content, including text, images, logos, and design, is owned by PlanetWiseLiving or licensed for use.</li>
              <li>You may not copy, distribute, or reproduce any content without written permission.</li>
            </ul>

            <h2 className="text-xl font-semibold text-green-700 mt-6 mb-3">7. External Links & Third-Party Services</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Our Website may contain links to third-party websites (e.g., market websites, government resources).</li>
              <li>We do not control or endorse third-party websites and are not responsible for their content or policies.</li>
              <li>Users should review the privacy policies and terms of third-party sites before interacting with them.</li>
            </ul>

            <h2 className="text-xl font-semibold text-green-700 mt-6 mb-3">8. Disclaimer of Warranties</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>The Website is provided on an "as-is" and "as-available" basis.</li>
              <li>We do not warrant that the Website will be error-free, uninterrupted, or free of harmful components.</li>
              <li>Users acknowledge that any reliance on information found on this Website is at their own risk.</li>
            </ul>

            <h2 className="text-xl font-semibold text-green-700 mt-6 mb-3">9. Limitation of Liability</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>PlanetWiseLiving is not responsible for any inaccuracies, errors, or damages arising from the use of the Website.</li>
              <li>We are not liable for financial losses, personal injuries, or business disruptions related to farmers' market visits.</li>
              <li>In no event shall PlanetWiseLiving be liable for indirect, incidental, or consequential damages.</li>
            </ul>

            <h2 className="text-xl font-semibold text-green-700 mt-6 mb-3">10. Termination of Access</h2>
            <p>
              We reserve the right to suspend or terminate access to our Website for any user who violates these Terms or engages in fraudulent or harmful activities.
            </p>

            <h2 className="text-xl font-semibold text-green-700 mt-6 mb-3">11. Governing Law</h2>
            <p>
              These Terms shall be governed by and interpreted in accordance with the laws of the United States, without regard to conflict of law principles.
              Any disputes arising from these Terms will be subject to the exclusive jurisdiction of the courts in the United States.
            </p>

            <h2 className="text-xl font-semibold text-green-700 mt-6 mb-3">12. Contact Information</h2>
            <p>
              For questions regarding these Terms, please contact us at:
              <br />
              📧 Email: <a href="mailto:contact@planetwiseliving.com" className="text-green-600 hover:text-green-800">contact@planetwiseliving.com</a>
            </p>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-200">
            <Link to="/" className="text-green-600 hover:text-green-800 font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage; 