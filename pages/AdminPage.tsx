import React, { useState, useEffect } from 'react';
import Auth from '../components/Auth';
import AdminDashboard from '../components/AdminDashboard';
import SEO from '../components/SeoManager';
import * as api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

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
        return <AdminDashboard />;
      case 'unauthenticated':
      default:
        return <Auth onAuthSuccess={handleAuthSuccess} />;
    }
  };

  return (
    <>
      <SEO title="Admin Panel - Parties 24/7" description="Manage parties for Parties 24/7." canonicalPath="/admin" />
      <div className="container mx-auto px-4">
        {renderContent()}
      </div>
    </>
  );
};

export default AdminPage;