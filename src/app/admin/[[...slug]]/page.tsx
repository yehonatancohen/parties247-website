"use client"
import React, { useState, useEffect } from 'react';
// 1. Remove react-router-dom imports
import { useRouter, usePathname } from "next/navigation"; // Added usePathname
import NavLink from '@/components/NavLink';
import Auth from '@/components/Auth';
import AdminDashboard from '@/components/AdminDashboard';
import SeoManager from '@/components/SeoManager';
import * as api from '@/services/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import AdminAnalytics from '@/components/AdminAnalytics';

const JWT_TOKEN_STORAGE = 'jwtAuthToken';

const AdminPage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname(); // 2. Hook to get current URL path
  const [authStatus, setAuthStatus] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');

  useEffect(() => {
    const verifyTokenOnLoad = async () => {
      const token = sessionStorage.getItem(JWT_TOKEN_STORAGE);
      if (token) {
        try {
          await api.verifyToken();
          setAuthStatus('authenticated');
        } catch (error) {
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
    setAuthStatus('authenticated');
  };

  // 3. Helper to generate class names based on active state
  const getNavLinkClass = (isActive: boolean) => 
    `px-4 py-2 rounded-lg font-semibold transition-colors ${
      isActive
        ? 'bg-jungle-accent text-jungle-deep shadow-jungle-glow'
        : 'text-white/80 hover:text-white hover:bg-jungle-accent/20'
    }`;

  const renderContent = () => {
    switch (authStatus) {
      case 'checking':
        return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
      
      case 'authenticated':
        // 4. Determine which component to show based on pathname
        const isAnalytics = pathname === '/admin/analytics';
        
        return (
          <div className="py-8 space-y-6">
            <div className="bg-jungle-surface/60 border border-wood-brown/40 rounded-xl shadow-lg p-3 flex flex-wrap gap-2">
              <NavLink
                href="/admin"
                className={getNavLinkClass(pathname === '/admin')} 
              >
                ניהול קטלוג
              </NavLink>
              
              <NavLink
                href="/admin/analytics"
                className={getNavLinkClass(pathname === '/admin/analytics')}
              >
                אנליטיקס
              </NavLink>
            </div>

            {/* 5. Conditional Rendering instead of <Routes> */}
            <div className="mt-4">
              {isAnalytics ? <AdminAnalytics /> : <AdminDashboard />}
            </div>
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