import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import Navbar from '../components/Navbar';
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
      navigate('/pricing'); // Redirect to pricing after signup
    } catch (err) {
      setError('Failed to create account');
      console.error('Signup error:', err);
    }
  };

  return (
    <div className="Signup">
      <Navbar />
      <section className="signup-form">
        <h1>Create Your Account</h1>
        <p>Sign up for unlimited DVDs & Blu-rays. Try 30 days free!</p>
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
          <button type="submit" className="signup-button">Continue</button>
        </form>
        <p>
          Already a member? <Link to="/login">Sign in</Link>.
        </p>
      </section>
      <footer className="Signup-footer">
        <p>© 2025 Libraula. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Signup;