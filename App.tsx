import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { PartyProvider } from './hooks/useParties';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import SocialsCta from './components/SocialsCta';

function App() {
  return (
    <PartyProvider>
      <HashRouter>
        <div className="min-h-screen flex flex-col bg-brand-bg">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>
          <SocialsCta />
          <Footer />
        </div>
      </HashRouter>
    </PartyProvider>
  );
}

export default App;