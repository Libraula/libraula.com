import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; // To check user document
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
      const result = await signInWithPopup(auth, googleProvider);
      await redirectUser(result.user);
    } catch (err) {
      setError('Failed to sign in with Google: ' + err.message);
      console.error('Google sign-in error:', err);
    }
  };

  const redirectUser = async (user) => {
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      // Returning user (has account details)
      console.log('Returning user, redirecting to /home');
      navigate('/home');
    } else {
      // New user (no account details yet)
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