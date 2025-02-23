import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Navbar from '../components/Navbar';
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
    <div className="Login">
      <Navbar />
      <section className="login-form">
        <h1>Sign In</h1>
        <p>Enter your email and password to sign in.</p>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <button type="submit" className="login-button">Sign In</button>
        </form>
        <button className="google-login-button" onClick={handleGoogleSignIn}>
          Sign In with Google
        </button>
        <p>
          Don't have an account? <Link to="/signup">Sign up here</Link>.
        </p>
      </section>
      <footer className="Login-footer">
        <p>© 2025 Libraula. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Login;