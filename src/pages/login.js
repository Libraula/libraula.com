import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Now correctly exported
import Navbar from '../components/Navbar';
import '../styles/login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Logged in successfully');
      navigate('/home');
    } catch (err) {
      setError('Invalid email or password');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="Login">
      <Navbar />
      <section className="login-form">
        <h1>Sign In</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">Sign In</button>
        </form>
        <p>
          New to Libraula? <Link to="/signup">Sign up now</Link>.
        </p>
      </section>
      <footer className="Login-footer">
        <p>© 2025 Libraula. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Login;