import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { PuppiesPage } from './pages/PuppiesPage';
import { PuppyDetailPage } from './pages/PuppyDetailPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { HappyFamiliesPage } from './pages/HappyFamiliesPage';
import { GoneHomePage } from './pages/GoneHomePage';
import { FAQPage } from './pages/FAQPage';
import { ContactPage } from './pages/ContactPage';
import { PawTrailCanvas } from './components/PawTrailCanvas';
import { RouteCurtain } from './components/RouteCurtain';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export const App: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-milk text-cocoa">
      <PawTrailCanvas />
      <RouteCurtain />
      <ScrollToTop />
      <Header />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/puppies" element={<PuppiesPage />} />
          <Route path="/puppies/:slug" element={<PuppyDetailPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/happy-families" element={<HappyFamiliesPage />} />
          <Route path="/gone-home" element={<GoneHomePage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<PuppiesPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;

