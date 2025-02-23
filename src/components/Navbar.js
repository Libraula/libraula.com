import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Add useNavigate
import { auth, db } from '../firebase'; // Adjust path if needed
import { doc, getDoc } from 'firebase/firestore';
import './navbar.css';

function Navbar() {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!auth.currentUser);
  const navigate = useNavigate(); // For redirect after sign out

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSideNavOpen(false);
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);

    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsLoggedIn(!!user);
      if (user) {
        const checkAdminStatus = async () => {
          try {
            const userId = user.uid;
            const adminDocRef = doc(db, 'admins', userId);
            const adminDocSnapshot = await getDoc(adminDocRef);
            setIsAdmin(adminDocSnapshot.exists());
          } catch (err) {
            console.error('Error checking admin status:', err);
            setIsAdmin(false);
          }
        };
        checkAdminStatus();
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      unsubscribe();
    };
  }, []);

  const toggleSideNav = () => {
    setIsSideNavOpen(!isSideNavOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setIsLoggedIn(false); // Update state immediately
      setIsAdmin(false); // Reset admin status
      navigate('/'); // Redirect to landing page
    } catch (err) {
      console.error('Error signing out:', err);
    }
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

        {/* Desktop Nav Links */}
        {!isMobile && (
          <nav className="nav-menu">
            <div className="nav-links">
              {isLoggedIn && <Link to="/home">Browse</Link>}
              {isLoggedIn && <Link to="/new-releases">New Releases</Link>}
              {isLoggedIn && <Link to="/queue">My Queue</Link>}
              {isLoggedIn && <Link to="/account">Account</Link>}
              {isLoggedIn && isAdmin && <Link to="/admin">Admin</Link>}
              {isLoggedIn ? (
                <span
                  onClick={handleSignOut}
                  style={{ cursor: 'pointer', color: 'white', textDecoration: 'none', fontSize: '16px', fontWeight: 500 }}
                >
                  Sign Out
                </span>
              ) : (
                <Link to="/login">Sign In</Link>
              )}
            </div>
          </nav>
        )}

        {/* Mobile Controls */}
        {isMobile && (
          <div className="mobile-controls">
            <button className="search-toggle" onClick={toggleSearch}>
              <span className="search-icon">🔍</span>
            </button>
            <button className="menu-toggle" onClick={toggleSideNav}>
              <span className="hamburger">☰</span>
            </button>
          </div>
        )}

        {/* Mobile Search Overlay */}
        {isMobile && isSearchOpen && (
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

        {/* Mobile Side Nav */}
        {isMobile && (
          <nav className={`nav-menu mobile ${isSideNavOpen ? 'open' : ''}`}>
            <button className="close-nav" onClick={toggleSideNav}>×</button>
            <div className="nav-links">
              {isLoggedIn && <Link to="/home" onClick={toggleSideNav}>Browse</Link>}
              {isLoggedIn && <Link to="/new-releases" onClick={toggleSideNav}>New Releases</Link>}
              {isLoggedIn && <Link to="/queue" onClick={toggleSideNav}>My Queue</Link>}
              {isLoggedIn && <Link to="/account" onClick={toggleSideNav}>Account</Link>}
              {isLoggedIn && isAdmin && <Link to="/admin" onClick={toggleSideNav}>Admin</Link>}
              {isLoggedIn ? (
                <span
                  onClick={() => {
                    handleSignOut();
                    toggleSideNav();
                  }}
                  style={{ cursor: 'pointer', color: 'white', textDecoration: 'none', fontSize: '18px', fontWeight: 500 }}
                >
                  Sign Out
                </span>
              ) : (
                <Link to="/login" onClick={toggleSideNav}>Sign In</Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Navbar;