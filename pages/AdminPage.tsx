import React, { useState } from 'react';
import Auth from '../components/Auth';
import AdminDashboard from '../components/AdminDashboard';
import SeoManager from '../components/SeoManager';

const ADMIN_KEY_STORAGE = 'adminSecretKey';

const AdminPage: React.FC = () => {
  // Check session storage for an auth key to persist login across refreshes.
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => 
    !!sessionStorage.getItem(ADMIN_KEY_STORAGE)
  );

  const handleAuthSuccess = (key: string) => {
    // When authentication is successful, store the key and update state.
    sessionStorage.setItem(ADMIN_KEY_STORAGE, key);
    setIsAuthenticated(true);
  };

  return (
    <>
      <SeoManager title="Admin Panel - Party 24/7" description="Manage parties for Party 24/7." />
      <div>
        {isAuthenticated ? (
          <AdminDashboard />
        ) : (
          <Auth onAuthSuccess={handleAuthSuccess} />
        )}
      </div>
    </>
  );
};

export default AdminPage;
