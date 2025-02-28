import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import Navbar from '../components/Navbar';
import { FiMail, FiLock, FiUserPlus, FiAlertCircle } from 'react-icons/fi';
import '../styles/signup.css';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('Signed up successfully');
      navigate('/pricing');
    } catch (err) {
      setError('Failed to create account');
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <Navbar />
      
      <main className="signup-main">
        <div className="signup-card">
          <div className="signup-header">
            <h1>Create Your Account</h1>
            <p>Sign up for unlimited DVDs & Blu-rays. Try 30 days free!</p>
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
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="signup-button"
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

          <p className="login-redirect">
            Already a member?{' '}
            <Link to="/login">Sign in</Link>
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