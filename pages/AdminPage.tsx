
import React, { useState, useEffect } from 'react';
import Auth from '../components/Auth';
import AdminDashboard from '../components/AdminDashboard';
import SeoManager from '../components/SeoManager';

const AdminPage: React.FC = () => {
  // Using sessionStorage to persist login across refreshes but not new tabs/windows.
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => 
    sessionStorage.getItem('isAdminAuthenticated') === 'true'
  );

  useEffect(() => {
    sessionStorage.setItem('isAdminAuthenticated', String(isAuthenticated));
  }, [isAuthenticated]);

  const handleAuthSuccess = () => {
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
