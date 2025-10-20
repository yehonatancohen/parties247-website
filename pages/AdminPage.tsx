import React, { useState, useEffect } from 'react';
import { NavLink, Route, Routes, Navigate } from 'react-router-dom';
import Auth from '../components/Auth';
import AdminDashboard from '../components/AdminDashboard';
import SeoManager from '../components/SeoManager';
import * as api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import AdminAnalytics from '../components/AdminAnalytics';

const JWT_TOKEN_STORAGE = 'jwtAuthToken';

const AdminPage: React.FC = () => {
  const [authStatus, setAuthStatus] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');

  useEffect(() => {
    const verifyTokenOnLoad = async () => {
      const token = sessionStorage.getItem(JWT_TOKEN_STORAGE);
      if (token) {
        try {
          // Validate the token from session storage against the backend.
          await api.verifyToken();
          setAuthStatus('authenticated');
        } catch (error) {
          // If validation fails, remove the invalid token.
          sessionStorage.removeItem(JWT_TOKEN_STORAGE);
          setAuthStatus('unauthenticated');
        }
      } else {
        setAuthStatus('unauthenticated');
      }
    };

    verifyTokenOnLoad();
  }, []);

  const handleAuthSuccess = () => {
    // The token is now stored in sessionStorage by the api.login service.
    // We just need to update the state to render the dashboard.
    setAuthStatus('authenticated');
  };
  
  const renderContent = () => {
    switch (authStatus) {
      case 'checking':
        return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
      case 'authenticated':
        return (
          <div className="py-8 space-y-6">
            <div className="bg-jungle-surface/60 border border-wood-brown/40 rounded-xl shadow-lg p-3 flex flex-wrap gap-2">
              <NavLink
                to="/admin"
                end
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-semibold transition-colors ${
                    isActive
                      ? 'bg-jungle-accent text-jungle-deep shadow-jungle-glow'
                      : 'text-white/80 hover:text-white hover:bg-jungle-accent/20'
                  }`
                }
              >
                ניהול קטלוג
              </NavLink>
              <NavLink
                to="/admin/analytics"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-semibold transition-colors ${
                    isActive
                      ? 'bg-jungle-accent text-jungle-deep shadow-jungle-glow'
                      : 'text-white/80 hover:text-white hover:bg-jungle-accent/20'
                  }`
                }
              >
                אנליטיקס
              </NavLink>
            </div>
            <Routes>
              <Route index element={<AdminDashboard />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </div>
        );
      case 'unauthenticated':
      default:
        return <Auth onAuthSuccess={handleAuthSuccess} />;
    }
  };

  return (
    <>
      <SeoManager title="Admin Panel - Parties 24/7" description="Manage parties for Parties 24/7." canonicalPath="/admin" />
      <div className="container mx-auto px-4">
        {renderContent()}
      </div>
    </>
  );
};

export default AdminPage;