import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { FaBars, FaTimes, FaHome, FaBookOpen, FaBookmark, FaUser, FaSignOutAlt, FaUserShield } from 'react-icons/fa'; // Updated icons
import logo from './logo.png';
import './navbar.css';

function Navbar() {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!auth.currentUser);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSideNavOpen(false);
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
        <div className="logo-nav-container">
          <Link to="/home" className="logo-link">
            <img src={logo} alt="Libraula Logo" className="logo" />
          </Link>

          {/* Desktop Nav Links Next to Logo */}
          {!isMobile && (
            <nav className="nav-menu desktop left">
              <div className="nav-links">
                {isLoggedIn && (
                  <>
                    <Link to="/home" title="Browse"><FaHome size={24} /></Link>
                    <Link to="/new-releases" title="New Releases"><FaBookOpen size={24} /></Link> {/* Replaced FaFilm with FaBookOpen */}
                    <Link to="/queue" title="My Queue"><FaBookmark size={24} /></Link> {/* Replaced FaList with FaBookmark */}
                  </>
                )}
              </div>
            </nav>
          )}
        </div>

        {/* Desktop Right-Side Icons */}
        {!isMobile && (
          <nav className="nav-menu desktop right">
            <div className="nav-links">
              {isLoggedIn && (
                <>
                  <Link to="/account" title="Account"><FaUser size={24} /></Link>
                  {isAdmin && <Link to="/admin" title="Admin"><FaUserShield size={24} /></Link>}
                  <span onClick={handleSignOut} className="sign-out-link" title="Sign Out"><FaSignOutAlt size={24} /></span>
                </>
              )}
              {!isLoggedIn && <Link to="/login">Sign In</Link>}
            </div>
          </nav>
        )}

        {/* Mobile Controls */}
        {isMobile && (
          <div className="mobile-controls">
            <button className="menu-toggle" onClick={toggleSideNav}>
              {isSideNavOpen ? <FaTimes /> : <FaBars />}
            </button>
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
                  <Link to="/new-releases" onClick={toggleSideNav}><FaBookOpen /> New Releases</Link> {/* Replaced FaFilm with FaBookOpen */}
                  <Link to="/queue" onClick={toggleSideNav}><FaBookmark /> My Queue</Link> {/* Replaced FaList with FaBookmark */}
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