import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import StatePage from './components/StatePage';
import MarketPage from './components/MarketPage';
import ContactPage from './components/ContactPage';
import AboutPage from './components/AboutPage';
import TermsPage from './components/TermsPage';
import PrivacyPage from './components/PrivacyPage';
import BlogPage from './components/BlogPage';
import NearMePage from './components/NearMePage';

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/state/:state" element={<StatePage />} />
              <Route path="/market/:id" element={<MarketPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/near-me" element={<NearMePage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  );
};

export default App;