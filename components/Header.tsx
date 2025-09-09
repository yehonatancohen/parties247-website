import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-jungle-surface/80 backdrop-blur-sm sticky top-0 z-50 shadow-lg border-b-2 border-wood-brown/50" aria-label="Main Navigation">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center">
            <img src="https://vjkiztnx7gionfos.public.blob.vercel-storage.com/Partieslogo.PNG" alt="Party 24/7 Logo" className="h-16 w-auto" />
          </Link>

          {/* Navigation */}
          <nav>
            <ul className="flex items-center gap-6 font-display text-xl">
              <li>
                <NavLink 
                  to="/" 
                  end
                  className={({ isActive }) => 
                    `text-jungle-text hover:text-white transition-colors tracking-wide ${isActive ? 'text-jungle-accent' : ''}`
                  }
                >
                  עמוד הבית
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/all-parties" 
                  className={({ isActive }) => 
                    `text-jungle-text hover:text-white transition-colors tracking-wide ${isActive ? 'text-jungle-accent' : ''}`
                  }
                >
                  כל המסיבות
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/blog" 
                  className={({ isActive }) => 
                    `text-jungle-text hover:text-white transition-colors tracking-wide ${isActive ? 'text-jungle-accent' : ''}`
                  }
                >
                  כתבות
                </NavLink>
              </li>
               <li>
                <NavLink 
                  to="/about" 
                  className={({ isActive }) => 
                    `text-jungle-text hover:text-white transition-colors tracking-wide ${isActive ? 'text-jungle-accent' : ''}`
                  }
                >
                  עלינו
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/admin" 
                  className={({ isActive }) => 
                    `text-jungle-text hover:text-white transition-colors tracking-wide ${isActive ? 'text-jungle-lime' : ''}`
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