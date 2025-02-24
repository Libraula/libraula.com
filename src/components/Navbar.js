import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { FaSearch, FaBars, FaTimes, FaHome, FaFilm, FaList, FaUser, FaSignOutAlt, FaUserShield } from 'react-icons/fa'; // React Icons
import './navbar.css';

function Navbar() {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!auth.currentUser);
  const navigate = useNavigate();

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
      setIsLoggedIn(false);
      setIsAdmin(false);
      navigate('/');
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
        {!isMobile && isLoggedIn && (
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
              {isLoggedIn && (
                <>
                  <Link to="/home"><FaHome /> Browse</Link>
                  <Link to="/new-releases"><FaFilm /> New Releases</Link>
                  <Link to="/queue"><FaList /> My Queue</Link>
                  <Link to="/account"><FaUser /> Account</Link>
                  {isAdmin && <Link to="/admin"><FaUserShield /> Admin</Link>}
                  <span onClick={handleSignOut} className="sign-out-link"><FaSignOutAlt /> Sign Out</span>
                </>
              )}
              {!isLoggedIn && <Link to="/login">Sign In</Link>}
            </div>
          </nav>
        )}

        {/* Mobile Controls */}
        {isMobile && (
          <div className="mobile-controls">
            {isLoggedIn && (
              <button className="search-toggle" onClick={toggleSearch}>
                <FaSearch />
              </button>
            )}
            <button className="menu-toggle" onClick={toggleSideNav}>
              {isSideNavOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        )}

        {/* Mobile Search Overlay */}
        {isMobile && isLoggedIn && isSearchOpen && (
          <div className="search-overlay">
            <input
              type="text"
              placeholder="Search DVDs by title..."
              className="search-bar-mobile"
              autoFocus
            />
            <button className="close-search" onClick={toggleSearch}><FaTimes /></button>
          </div>
        )}

        {/* Mobile Side Nav */}
        {isMobile && (
          <nav className={`nav-menu mobile ${isSideNavOpen ? 'open' : ''}`}>
            <button className="close-nav" onClick={toggleSideNav}><FaTimes /></button>
            <div className="nav-links">
              {isLoggedIn && (
                <>
                  <Link to="/home" onClick={toggleSideNav}><FaHome /> Browse</Link>
                  <Link to="/new-releases" onClick={toggleSideNav}><FaFilm /> New Releases</Link>
                  <Link to="/queue" onClick={toggleSideNav}><FaList /> My Queue</Link>
                  <Link to="/account" onClick={toggleSideNav}><FaUser /> Account</Link>
                  {isAdmin && <Link to="/admin" onClick={toggleSideNav}><FaUserShield /> Admin</Link>}
                  <span onClick={() => { handleSignOut(); toggleSideNav(); }} className="sign-out-link"><FaSignOutAlt /> Sign Out</span>
                </>
              )}
              {!isLoggedIn && <Link to="/login" onClick={toggleSideNav}>Sign In</Link>}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Navbar;