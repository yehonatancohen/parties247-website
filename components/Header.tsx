import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-brand-surface/80 backdrop-blur-sm sticky top-0 z-50 shadow-lg" aria-label="Main Navigation">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center">
            <img src="../logo.png" alt="Party 24/7 Logo" className="h-16 w-auto" />
          </Link>

          {/* Navigation */}
          <nav>
            <ul className="flex items-center gap-6">
              <li>
                <NavLink 
                  to="/" 
                  end
                  className={({ isActive }) => 
                    `text-gray-300 hover:text-white transition-colors font-medium ${isActive ? 'text-brand-secondary' : ''}`
                  }
                >
                  כל המסיבות
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/admin" 
                  className={({ isActive }) => 
                    `text-gray-300 hover:text-white transition-colors font-medium ${isActive ? 'text-brand-primary' : ''}`
                  }
                >
                  אדמין
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;