import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import Navbar from '../components/Navbar';
import { FiMail, FiLock, FiUserPlus } from 'react-icons/fi';
import '../styles/signup.css';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('Signed up successfully');
      navigate('/pricing');
    } catch (err) {
      setError('Failed to create account');
      console.error('Signup error:', err);
    }
  };

  return (
    <div className="modern-signup">
      <Navbar />
      <section className="modern-signup-form">
        <h1>Create Your Account</h1>
        <p className="form-subtitle">Sign up for unlimited DVDs & Blu-rays. Try 30 days free!</p>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <FiMail className="input-icon" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-container">
            <FiLock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="primary-button">
            <FiUserPlus /> Continue
          </button>
        </form>
        <p className="login-link">
          Already a member? <Link to="/login">Sign in</Link>.
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

export default Signup;