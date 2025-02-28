import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/pricing.css';

function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const navigate = useNavigate();

  const plans = [
    { id: 'basic', name: 'Basic', priceUSD: 7.99, priceUGX: 7900, discs: '1 disc at a time' },
    { id: 'standard', name: 'Standard', priceUSD: 11.99, priceUGX: 11900, discs: '2 discs at a time' },
    { id: 'premium', name: 'Premium', priceUSD: 15.99, priceUGX: 15900, discs: '3 discs at a time' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const plan = plans.find(p => p.id === selectedPlan);
    localStorage.setItem('selectedPlan', JSON.stringify({
      id: plan.id,
      name: plan.name,
      priceUGX: plan.priceUGX,
    }));
    navigate('/subscription'); // Changed to match your routing
  };

  return (
    <div className="Pricing">
      <Navbar />
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
                <p className="price">{plan.priceUSD}/mo (UGX {plan.priceUGX.toLocaleString()})</p>
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