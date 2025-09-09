import React, { useState, useEffect } from 'react';
import Auth from '../components/Auth';
import AdminDashboard from '../components/AdminDashboard';
import SeoManager from '../components/SeoManager';
import * as api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const ADMIN_KEY_STORAGE = 'adminSecretKey';

const AdminPage: React.FC = () => {
  const [authStatus, setAuthStatus] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');

  useEffect(() => {
    const verifyKeyOnLoad = async () => {
      const key = sessionStorage.getItem(ADMIN_KEY_STORAGE);
      if (key) {
        try {
          // Validate the key from session storage against the backend.
          await api.verifyAdminKey();
          setAuthStatus('authenticated');
        } catch (error) {
          // If validation fails, remove the invalid key.
          sessionStorage.removeItem(ADMIN_KEY_STORAGE);
          setAuthStatus('unauthenticated');
        }
      } else {
        setAuthStatus('unauthenticated');
      }
    };

    verifyKeyOnLoad();
  }, []);

  const handleAuthSuccess = (key: string) => {
    // The key has already been verified by the Auth component.
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
      <SeoManager title="Admin Panel - Party 24/7" description="Manage parties for Party 24/7." />
      <div>
        {renderContent()}
      </div>
    </>
  );
};

export default AdminPage;
