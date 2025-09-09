import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const HamburgerIcon = ({ className }: { className?: string }) => (
  <svg className={className} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
  </svg>
);

const CloseIcon = ({ className }: { className?: string }) => (
    <svg className={className} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
    </svg>
);

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const navigate = useNavigate();
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoClick = () => {
    setLogoClickCount(prev => prev + 1);

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    clickTimeoutRef.current = setTimeout(() => {
      setLogoClickCount(0);
    }, 2000); // Reset after 2 seconds
  };

  useEffect(() => {
    if (logoClickCount === 5) {
      navigate('/admin');
      setLogoClickCount(0);
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    }
  }, [logoClickCount, navigate]);

  useEffect(() => {
    // Prevent body scroll when mobile menu is open
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);
  
  const NavLinks: React.FC<{ onLinkClick?: () => void }> = ({ onLinkClick }) => (
    <>
      <li>
        <NavLink to="/" end onClick={onLinkClick} className={({ isActive }) => `block py-2 text-jungle-text hover:text-white transition-colors tracking-wide ${isActive ? 'text-jungle-accent' : ''}`}>
          עמוד הבית
        </NavLink>
      </li>
      <li>
        <NavLink to="/all-parties" onClick={onLinkClick} className={({ isActive }) => `block py-2 text-jungle-text hover:text-white transition-colors tracking-wide ${isActive ? 'text-jungle-accent' : ''}`}>
          כל המסיבות
        </NavLink>
      </li>
      <li>
        <NavLink to="/blog" onClick={onLinkClick} className={({ isActive }) => `block py-2 text-jungle-text hover:text-white transition-colors tracking-wide ${isActive ? 'text-jungle-accent' : ''}`}>
          כתבות
        </NavLink>
      </li>
      <li>
        <NavLink to="/about" onClick={onLinkClick} className={({ isActive }) => `block py-2 text-jungle-text hover:text-white transition-colors tracking-wide ${isActive ? 'text-jungle-accent' : ''}`}>
          עלינו
        </NavLink>
      </li>
    </>
  );

  return (
    <>
      <header className="bg-jungle-surface/80 backdrop-blur-sm sticky top-0 z-50 shadow-lg border-b-2 border-wood-brown/50" aria-label="Main Navigation">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Brand Logo */}
            <div onClick={handleLogoClick} className="cursor-pointer flex-shrink-0 z-50">
               <Link to="/" className="flex items-center">
                 <img src="https://vjkiztnx7gionfos.public.blob.vercel-storage.com/Partieslogo.PNG" alt="Party 24/7 Logo" className="h-16 w-auto" />
               </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <ul className="flex items-center gap-6 font-display text-xl">
                <NavLinks />
              </ul>
            </nav>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden z-50">
               <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu" className="text-white text-3xl">
                 {isMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
               </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="mobile-menu fixed inset-0 bg-jungle-deep/95 backdrop-blur-md z-40 flex flex-col items-center justify-center md:hidden">
          <nav>
            <ul className="flex flex-col items-center gap-6 font-display text-3xl">
              <NavLinks onLinkClick={() => setIsMenuOpen(false)} />
            </ul>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
