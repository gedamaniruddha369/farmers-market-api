import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPage: React.FC = () => {
  const effectiveDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-gradient-to-b from-green-50 to-white min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-green-800 mb-6">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Effective Date: {effectiveDate}</p>

          <div className="prose prose-green max-w-none">
            <p>
              Welcome to PlanetWiseLiving (the "Website"). Your privacy is important to us. 
              This Privacy Policy explains how we collect, use, and protect your information when you use our website.
            </p>
            
            <p>
              By accessing or using PlanetWiseLiving, you agree to the terms outlined in this policy. 
              If you do not agree, please refrain from using our services.
            </p>

            <h2 className="text-xl font-semibold text-green-700 mt-6 mb-3">1. Information We Collect</h2>
            <p>We collect two types of information:</p>
            
            <h3 className="text-lg font-medium text-green-700 mt-4 mb-2">(A) Personal Information (Provided by You)</h3>
            <p>You may voluntarily provide personal information when you:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Subscribe to our newsletter.</li>
              <li>Contact us via email.</li>
              <li>Submit a farmers' market listing or review.</li>
            </ul>
            
            <p className="mt-2">This may include:</p>
            <ul className="space-y-1 pl-6">
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✅</span>
                <span>Name</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✅</span>
                <span>Email address</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✅</span>
                <span>Phone number (if provided)</span>
              </li>
            </ul>

            <h3 className="text-lg font-medium text-green-700 mt-4 mb-2">(B) Non-Personal Information (Automatically Collected)</h3>
            <p>We may automatically collect certain technical data when you visit our Website, including:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device type</li>
              <li>Pages visited & time spent</li>
              <li>Referring website or search engine</li>
            </ul>
            <p className="mt-2">This data helps us analyze trends and improve user experience.</p>

            <h2 className="text-xl font-semibold text-green-700 mt-6 mb-3">2. How We Use Your Information</h2>
            <p>We use the information collected to:</p>
            <ul className="space-y-1 pl-6">
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✅</span>
                <span>Provide and improve our Farmers' Market Directory.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✅</span>
                <span>Respond to inquiries and customer support requests.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✅</span>
                <span>Send newsletters or updates (only if you subscribe).</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✅</span>
                <span>Monitor and analyze website traffic.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✅</span>
                <span>Prevent fraudulent activity and enhance security.</span>
              </li>
            </ul>
            
            <p className="mt-3 font-medium">We do not sell, rent, or trade your personal data to third parties.</p>

            <h2 className="text-xl font-semibold text-green-700 mt-6 mb-3">3. Cookies & Tracking Technologies</h2>
            <p>Our Website uses cookies and similar tracking technologies to enhance user experience.</p>
            
            <h3 className="text-lg font-medium text-green-700 mt-4 mb-2">What are cookies?</h3>
            <p>
              Cookies are small files stored on your device to remember your preferences and improve site functionality.
            </p>
            
            <h3 className="text-lg font-medium text-green-700 mt-4 mb-2">Types of Cookies We Use:</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Essential Cookies: Required for basic site functionality.</li>
              <li>Analytics Cookies: Help us analyze traffic and improve services.</li>
              <li>Marketing Cookies: Used for advertising and retargeting (if applicable).</li>
            </ul>
            
            <h3 className="text-lg font-medium text-green-700 mt-4 mb-2">Managing Cookies</h3>
            <p>
              You can control or disable cookies through your browser settings. However, some features may not function properly without them.
            </p>

            <h2 className="text-xl font-semibold text-green-700 mt-6 mb-3">4. Third-Party Services</h2>
            <p>We may integrate third-party tools such as:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Google Maps API (for displaying farmers' market locations).</li>
              <li>Google Analytics (for website traffic analysis).</li>
              <li>Social Media Plugins (for sharing content).</li>
            </ul>
            <p className="mt-2">
              These third parties have their own privacy policies, and we encourage you to review them.
            </p>

            <h2 className="text-xl font-semibold text-green-700 mt-6 mb-3">5. Data Security</h2>
            <p>
              We take reasonable measures to protect your data from unauthorized access, loss, or misuse. 
              However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
            <p className="mt-2">
              If you believe your data has been compromised, please contact us immediately at <a href="mailto:contact@planetwiseliving.com" className="text-green-600 hover:text-green-800">contact@planetwiseliving.com</a>.
            </p>

            <h2 className="text-xl font-semibold text-green-700 mt-6 mb-3">6. Third-Party Links</h2>
            <p>
              Our Website may contain links to external websites. We are not responsible for the privacy practices of third-party sites 
              and encourage you to review their policies before providing personal information.
            </p>

            <h2 className="text-xl font-semibold text-green-700 mt-6 mb-3">7. Children's Privacy</h2>
            <p>
              PlanetWiseLiving is not intended for children under 13 years of age. We do not knowingly collect data from children. 
              If we discover that a child has provided us with personal information, we will delete it promptly.
            </p>

            <h2 className="text-xl font-semibold text-green-700 mt-6 mb-3">8. Your Privacy Rights</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul className="space-y-1 pl-6">
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✅</span>
                <span>Access, correct, or delete your personal data.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✅</span>
                <span>Opt out of marketing emails (unsubscribe at any time).</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✅</span>
                <span>Restrict or object to certain types of data processing.</span>
              </li>
            </ul>
            
            <p className="mt-3">
              To exercise your rights, email us at <a href="mailto:contact@planetwiseliving.com" className="text-green-600 hover:text-green-800">contact@planetwiseliving.com</a>.
            </p>

            <h2 className="text-xl font-semibold text-green-700 mt-6 mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on this page, 
              and the updated date will be noted at the top. We encourage you to review this page regularly.
            </p>

            <h2 className="text-xl font-semibold text-green-700 mt-6 mb-3">10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please reach out to us:
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

export default PrivacyPage; 