import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Navbar from '../components/Navbar';
import { FiMail, FiLock, FiLogIn, FiAlertCircle } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import '../styles/login.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      await redirectUser(auth.currentUser);
    } catch (err) {
      setError('Failed to sign in: ' + err.message);
      console.error('Email sign-in error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      console.log('Attempting Google Sign-In');
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google Sign-In successful, user:', result.user.uid);
      await redirectUser(result.user);
    } catch (err) {
      console.error('Google Sign-In error:', err.code, err.message);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Google Sign-In was canceled. Please keep the popup open and select an account.');
      } else {
        setError('Failed to sign in with Google: ' + err.message);
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const redirectUser = async (user) => {
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      console.log('Returning user, redirecting to /home');
      navigate('/home');
    } else {
      console.log('New user, redirecting to /pricing');
      navigate('/pricing');
    }
  };

  return (
    <div className="login-container">
      <Navbar />
      
      <main className="login-main">
        <div className="login-card">
          <div className="login-header">
            <h1>Sign In</h1>
            <p>Enter your email and password to sign in.</p>
          </div>

          {error && (
            <div className="login-error">
              <FiAlertCircle />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <div className="input-icon">
                <FiMail />
              </div>
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <div className="input-icon">
                <FiLock />
              </div>
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="login-button"
            >
              {isLoading ? (
                <span className="button-spinner"></span>
              ) : (
                <>
                  <FiLogIn />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <button 
            onClick={handleGoogleSignIn} 
            disabled={isGoogleLoading}
            className="google-button"
          >
            {isGoogleLoading ? (
              <span className="button-spinner dark"></span>
            ) : (
              <>
                <FcGoogle />
                <span>Sign in with Google</span>
              </>
            )}
          </button>

          <p className="signup-redirect">
            Don't have an account? <Link to="/signup">Sign up here</Link>.
          </p>
        </div>
      </main>
      
      <footer className="modern-footer">
        <div className="footer-content">
          <p className="copyright">© 2025 Libraula. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Login;