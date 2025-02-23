import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const menuRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
      }
    };

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <header className="Navbar">
      <div className="navbar-content">
        <Link to="/home" className="logo-link">
          <div className="logo">Libraula</div>
        </Link>

        {/* Desktop Search Bar */}
        {!isMobile && (
          <input
            type="text"
            placeholder="Search DVDs by title..."
            className="search-bar"
          />
        )}

        {/* Mobile Controls */}
        {isMobile && (
          <div className="mobile-controls">
            <button className="search-toggle" onClick={toggleSearch}>
              <svg className="search-icon" viewBox="0 0 24 24" width="24" height="24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </button>
            <button className="menu-toggle" onClick={toggleMenu}>
              <span className="hamburger">{isMenuOpen ? '×' : '☰'}</span>
            </button>
          </div>
        )}

        {/* Mobile Search Overlay */}
        {isMobile && isSearchOpen && (
          <div className="search-overlay" ref={searchRef}>
            <input
              type="text"
              placeholder="Search DVDs by title..."
              className="search-bar-mobile"
              autoFocus
            />
            <button className="close-search" onClick={toggleSearch}>×</button>
          </div>
        )}

        {/* Navigation Menu - Desktop & Mobile */}
        <nav 
          className={`nav-menu ${isMenuOpen ? 'open' : ''} ${isMobile ? 'mobile' : ''}`}
          ref={menuRef}
        >
          <div className="nav-links">
            <Link to="/home" onClick={() => setIsMenuOpen(false)}>Browse</Link>
            <Link to="/new-releases" onClick={() => setIsMenuOpen(false)}>New Releases</Link>
            <Link to="/queue" onClick={() => setIsMenuOpen(false)}>My Queue</Link>
            <Link to="/account" onClick={() => setIsMenuOpen(false)}>Account</Link>
            <Link to="/login" onClick={() => setIsMenuOpen(false)}>Sign Out</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;