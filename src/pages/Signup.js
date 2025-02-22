import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/signup.css';

function Signup() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [district, setDistrict] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const signupData = {
      phoneNumber,
      password,
      firstName,
      lastName,
      district
    };
    console.log('Signup submitted with:', signupData);
    // Simulate account creation (replace with API call)
    navigate('/pricing');
  };

  return (
    <div className="Signup">
      <header className="Signup-header">
        <div className="logo">Libraula</div>
      </header>
      <section className="signup-form">
        <h1>Create Your Account</h1>
        <p>Sign up for unlimited DVDs & Blu-rays. Try 30 days free!</p>
        <form onSubmit={handleSubmit}>
          <input
            type="tel"
            placeholder="Phone Number (e.g. 0775123456)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            pattern="[0-9]{10}"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="District"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            required
          />
          <button type="submit" className="signup-button">Create Account</button>
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