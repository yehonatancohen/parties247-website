
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PartyProvider } from './hooks/useParties';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import AllPartiesPage from './pages/AllPartiesPage';
import AboutPage from './pages/AboutPage';
import CategoryPage from './pages/CategoryPage';
import LegalPage from './pages/LegalPage';
import CommunityPopup from './components/CommunityPopup';
import CookieBanner from './components/CookieBanner';
import JungleDecorations from './components/JungleDecorations';
import BlogPage from './pages/BlogPage';
import ScrollToTop from './components/ScrollToTop';
import EventPage from './pages/EventPage';
import ArticlePage from './pages/ArticlePage';

function App() {
  return (
    <PartyProvider>
      <BrowserRouter>
        <ScrollToTop />
        <JungleDecorations />
        <div className="min-h-screen flex flex-col relative z-10">
          <Header />
          <main className="flex-grow py-8">
            <div className="page-transition">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/all-parties" element={<AllPartiesPage />} />
                <Route path="/event/:slug" element={<EventPage />} />
                <Route path="/כתבות" element={<BlogPage />} />
                <Route path="/כתבות/:slug" element={<ArticlePage />} />
                <Route path="/category/:categoryId" element={<CategoryPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/terms" element={<LegalPage pageType="terms" />} />
                <Route path="/privacy" element={<LegalPage pageType="privacy" />} />
                <Route path="/accessibility" element={<LegalPage pageType="accessibility" />} />
              </Routes>
            </div>
          </main>
          <Footer />
        </div>
        <CommunityPopup />
        <CookieBanner />
      </BrowserRouter>
    </PartyProvider>
  );
}

export default App;
