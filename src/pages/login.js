import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Navbar from '../components/Navbar';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc'; // Google icon from react-icons
import '../styles/login.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      await redirectUser(auth.currentUser);
    } catch (err) {
      setError('Failed to sign in: ' + err.message);
      console.error('Email sign-in error:', err);
    }
  };

  const handleGoogleSignIn = async () => {
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
    <div className="modern-login">
      <Navbar />
      <section className="modern-login-form">
        <h1>Sign In</h1>
        <p className="form-subtitle">Enter your email and password to sign in.</p>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <FiMail className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="input-container">
            <FiLock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="primary-button">
            <FiLogIn /> Sign In
          </button>
        </form>
        <p className="or-sign-in">OR</p>
        <button className="google-login-button" onClick={handleGoogleSignIn}>
          <FcGoogle className="google-icon" /> Sign in with Google
        </button>
        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign up here</Link>.
        </p>
      </section>
      <footer className="modern-footer">
        <div className="footer-content">
          <p className="copyright">© 2025 Libraula. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Login;