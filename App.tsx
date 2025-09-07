import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { PartyProvider } from './hooks/useParties';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import AllPartiesPage from './pages/AllPartiesPage';
import AboutPage from './pages/AboutPage';
import CategoryPage from './pages/CategoryPage';
import LegalPage from './pages/LegalPage';
import SocialsCta from './components/SocialsCta';
import CommunityPopup from './components/CommunityPopup';
import CookieBanner from './components/CookieBanner';
import JungleDecorations from './components/JungleDecorations';
import BlogPage from './pages/BlogPage';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-transition">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/all-parties" element={<AllPartiesPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/terms" element={<LegalPage pageType="terms" />} />
        <Route path="/privacy" element={<LegalPage pageType="privacy" />} />
        <Route path="/accessibility" element={<LegalPage pageType="accessibility" />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <PartyProvider>
      <HashRouter>
        <JungleDecorations />
        <div className="min-h-screen flex flex-col relative z-10">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <AnimatedRoutes />
          </main>
          <SocialsCta />
          <Footer />
        </div>
        <CommunityPopup />
        <CookieBanner />
      </HashRouter>
    </PartyProvider>
  );
}

export default App;