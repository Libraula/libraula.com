import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempted with:', { email, password });
  };

  return (
    <div className="Login">
      <header className="Login-header">
        <div className="logo">Libraula</div>
      </header>
      <section className="login-form">
        <h1>Sign In</h1>
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
          New to Libraula? <Link to="/signup">Sign up now</Link>. {/* Changed from / to /signup */}
        </p>
      </section>
      <footer className="Login-footer">
        <p>© 2025 Libraula. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Login;