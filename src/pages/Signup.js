import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import Navbar from '../components/Navbar';
import { FiMail, FiLock, FiUserPlus, FiAlertCircle } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import '../styles/signup.css';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // For email/password signup
  const [isGoogleLoading, setIsGoogleLoading] = useState(false); // For Google signup
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with:', { email, password });
    setError('');
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Signed up successfully:', userCredential.user);
      navigate('/home');
    } catch (err) {
      let errorMessage = 'Failed to create account';
      switch (err.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already in use.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email format.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password must be at least 6 characters.';
          break;
        default:
          errorMessage = `Signup failed: ${err.message}`;
      }
      setError(errorMessage);
      console.error('Signup error:', err.code, err.message);
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
      navigate('/home');
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

  return (
    <div className="signup-container">
      <Navbar />
      
      <main className="signup-main">
        <div className="signup-card">
          <div className="signup-header">
            <h1>Create Your Account</h1>
            <p>Sign up for unlimited Books, Comics & Manga.</p>
          </div>

          {error && (
            <div className="signup-error">
              <FiAlertCircle />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="input-group">
              <div className="input-icon">
                <FiMail />
              </div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="input-group">
              <div className="input-icon">
                <FiLock />
              </div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className="signup-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="button-spinner"></span>
              ) : (
                <>
                  <FiUserPlus />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="google-button"
            disabled={isGoogleLoading}
          >
            {isGoogleLoading ? (
              <span className="button-spinner dark"></span>
            ) : (
              <>
                <FcGoogle />
                <span>Sign up with Google</span>
              </>
            )}
          </button>

          <p className="login-redirect">
            Already a member? <Link to="/login">Sign in</Link>
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

export default Signup;