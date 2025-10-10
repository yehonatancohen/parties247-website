
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PartyProvider, PartyProviderInitialState } from './hooks/useParties';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import AllPartiesPage from './pages/AllPartiesPage';
import AboutPage from './pages/AboutPage';
import LegalPage from './pages/LegalPage';
import CommunityPopup from './components/CommunityPopup';
import CookieBanner from './components/CookieBanner';
import JungleDecorations from './components/JungleDecorations';
import BlogPage from './pages/BlogPage';
import ScrollToTop from './components/ScrollToTop';
import EventPage from './pages/EventPage';
import ArticlePage from './pages/ArticlePage';
import TaxonomyPage from './pages/TaxonomyPage';
import TaxonomyListingPage from './pages/TaxonomyListingPage';
import { taxonomyConfigs, taxonomyListingConfigs } from './data/taxonomy';

interface AppProps {
  initialState?: PartyProviderInitialState;
}

function App({ initialState }: AppProps) {
  return (
    <PartyProvider initialState={initialState}>
      <ScrollToTop />
      <JungleDecorations />
      <div className="min-h-screen flex flex-col relative z-10">
        <Header />
        <main className="flex-grow py-8">
          <div className="page-transition">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/all-parties" element={<AllPartiesPage />} />
              <Route path="/all-parties/עמוד/:pageNumber" element={<AllPartiesPage />} />
              <Route path="/event/:slug" element={<EventPage />} />
              <Route path="/כתבות" element={<BlogPage />} />
              <Route path="/כתבות/:slug" element={<ArticlePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/terms" element={<LegalPage pageType="terms" />} />
              <Route path="/privacy" element={<LegalPage pageType="privacy" />} />
              <Route path="/accessibility" element={<LegalPage pageType="accessibility" />} />
              {taxonomyListingConfigs.map((config) => (
                <Route
                  key={config.path}
                  path={config.path}
                  element={
                    <TaxonomyListingPage
                      title={config.title}
                      description={config.description}
                      intro={config.intro}
                      canonicalPath={config.path}
                      breadcrumbs={config.breadcrumbs}
                      sections={config.sections}
                    />
                  }
                />
              ))}
              {taxonomyConfigs
                .filter((config) => config.type !== 'articles')
                .map((config) => (
                <Route
                  key={config.path}
                  path={config.path.replace(/^\//, '')}
                  element={<TaxonomyPage config={config} />}
                />
              ))}
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
      <CommunityPopup />
      <CookieBanner />
    </PartyProvider>
  );
}

export default App;
