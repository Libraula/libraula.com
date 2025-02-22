import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

function Navbar() {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setIsSideNavOpen(false); // Close side nav on resize to desktop
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSideNav = () => {
    setIsSideNavOpen(!isSideNavOpen);
  };

  return (
    <header className="Navbar">
      <Link to="/home" className="logo-link">
        <div className="logo">Libraula</div>
      </Link>
      <input
        type="text"
        placeholder="Search DVDs by title..."
        className="search-bar"
      />
      {isMobile ? (
        <>
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
      ) : (
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