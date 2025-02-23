import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

function Navbar() {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // State for search input on mobile

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSideNavOpen(false); // Close side nav on desktop
        setIsSearchOpen(false); // Close search on desktop
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSideNav = () => {
    setIsSideNavOpen(!isSideNavOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <header className="Navbar">
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

      {/* Mobile Search Icon and Input */}
      {isMobile && (
        <>
          <button className="search-toggle" onClick={toggleSearch}>
            <span className="search-icon">🔍</span>
          </button>
          {isSearchOpen && (
            <div className="search-overlay">
              <input
                type="text"
                placeholder="Search DVDs by title..."
                className="search-bar-mobile"
                autoFocus
              />
              <button className="close-search" onClick={toggleSearch}>×</button>
            </div>
          )}
          <button className="menu-toggle" onClick={toggleSideNav}>
            <span className="hamburger">☰</span>
          </button>
          <div className={`side-nav ${isSideNavOpen ? 'open' : ''}`}>
            <button className="close-nav" onClick={toggleSideNav}>×</button>
            <nav className="side-nav-links">
              <Link to="/home" onClick={toggleSideNav}>Browse</Link>
              <Link to="/new-releases" onClick={toggleSideNav}>New Releases</Link>
              <Link to="/queue" onClick={toggleSideNav}>My Queue</Link>
              <Link to="/account" onClick={toggleSideNav}>Account</Link>
              <Link to="/login" onClick={toggleSideNav}>Sign Out</Link>
            </nav>
          </div>
        </>
      )}

      {/* Desktop Nav Bar */}
      {!isMobile && (
        <nav className="nav-bar">
          <Link to="/home">Browse</Link>
          <Link to="/new-releases">New Releases</Link>
          <Link to="/queue">My Queue</Link>
          <Link to="/account">Account</Link>
          <Link to="/login">Sign Out</Link>
        </nav>
      )}
    </header>
  );
}

export default Navbar;