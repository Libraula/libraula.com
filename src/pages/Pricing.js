import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/pricing.css';

function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Plan selected:', selectedPlan);
    navigate('/home'); // Redirect to home (catalog) screen
  };

  const plans = [
    { id: 'basic', name: 'Basic', price: '$7.99/mo', discs: '1 disc at a time' },
    { id: 'standard', name: 'Standard', price: '$11.99/mo', discs: '2 discs at a time' },
    { id: 'premium', name: 'Premium', price: '$15.99/mo', discs: '3 discs at a time' },
  ];

  return (
    <div className="Pricing">
      <header className="Pricing-header">
        <div className="logo">Libraula</div>
      </header>
      <section className="pricing-form">
        <h1>Choose Your Plan</h1>
        <p>Select a plan to start your 30-day free trial.</p>
        <form onSubmit={handleSubmit}>
          <div className="plan-container">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`plan-card ${selectedPlan === plan.id ? 'selected' : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <h2>{plan.name}</h2>
                <p className="price">{plan.price}</p>
                <p>{plan.discs}</p>
                <span className="select-text">
                  {selectedPlan === plan.id ? 'Selected' : 'Select'}
                </span>
              </div>
            ))}
          </div>
          <button type="submit" className="pricing-button">Start Membership</button>
        </form>
        <p>
          Need to sign in? <Link to="/login">Click here</Link>.
        </p>
      </section>
      <footer className="Pricing-footer">
        <p>© 2025 Libraula. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Pricing;