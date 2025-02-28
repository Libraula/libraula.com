import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../styles/subscription.css';

function Subscription() {
  const [formData, setFormData] = useState({
    mobileProvider: 'MTNUG',
    phone: '',
  });
  const [subscriptionPlan, setSubscriptionPlan] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const plan = JSON.parse(localStorage.getItem('selectedPlan'));
    if (!plan) {
      setError('No plan selected. Please choose a plan.');
      navigate('/pricing');
    } else {
      setSubscriptionPlan(plan);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.phone || formData.phone.length < 9) {
      setError('Please enter a valid phone number (9 digits without leading 0).');
      return;
    }

    if (!auth.currentUser) {
      setError('You must be logged in to process payment.');
      navigate('/login');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const userId = auth.currentUser.uid;
      const email = auth.currentUser.email;
      const txRef = `tx-${userId}-${Date.now()}`;
      const phoneNumber = `256${formData.phone}`;

      console.log('Sending payment request:', { phoneNumber, mobileProvider: formData.mobileProvider, amount: subscriptionPlan.priceUGX, email, txRef });

      const response = await axios.post('http://localhost:5000/initiate-payment', {
        phoneNumber,
        mobileProvider: formData.mobileProvider,
        amount: subscriptionPlan.priceUGX,
        email,
        txRef,
      }, {
        timeout: 10000 // Add timeout to prevent hanging
      });

      const paymentResponse = response.data;
      console.log('Payment initiation response:', paymentResponse);

      if (paymentResponse.status === 'success' && paymentResponse.meta?.authorization?.mode === 'redirect') {
        window.location.href = paymentResponse.meta.authorization.redirect;
      } else {
        throw new Error('Payment initiation failed: Invalid response from server');
      }
    } catch (err) {
      if (err.code === 'ECONNREFUSED' || err.message === 'Network Error') {
        setError('Failed to connect to payment server. Please ensure the backend is running.');
      } else if (err.response) {
        setError(`Payment server error: ${err.response.data.error || err.response.statusText}`);
      } else {
        setError(`Failed to initiate payment: ${err.message || 'Unknown error'}`);
      }
      console.error('Payment error:', err);
      setIsLoading(false);
    }
  };

  if (!subscriptionPlan) {
    return (
      <div className="Subscription">
        <Navbar />
        <p>Loading subscription details...</p>
      </div>
    );
  }

  return (
    <div className="Subscription">
      <Navbar />
      <section className="subscription-form">
        <h1>Add Your Payment Details</h1>
        <p>Complete your {subscriptionPlan.name} subscription (UGX {subscriptionPlan.priceUGX.toLocaleString()})</p>
        {error && <p className="error">{error}</p>}
        <div className="card-selection-body">
          <h2>Mobile Money</h2>
          <form id="mobileMoney" className="pi-submit" onSubmit={handleSubmit}>
            <input name="paymentMethod" type="hidden" value="mobileMoney" />

            <div className="input-field">
              <label>Select your operator</label>
              <select
                name="mobileProvider"
                className="mtn validate unselect"
                value={formData.mobileProvider}
                onChange={(e) => setFormData({ ...formData, mobileProvider: e.target.value })}
                disabled={isLoading}
              >
                <option value="MTNUG">MTN</option>
                <option value="AIRTELUG">Airtel</option>
              </select>
            </div>

            <div className="input-field phone-group">
              <input
                className="disable dont-clear"
                placeholder="Code"
                readOnly
                disabled
                name="countryPhoneCode"
                type="text"
                value="+256"
              />
              <input
                id="phone"
                className="validate"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="insert mobile number without 0"
                required
                disabled={isLoading}
              />
            </div>

            <button type="submit" className="pay-now-button" disabled={isLoading}>
              {isLoading ? 'Processing...' : `Pay Now: UGX ${subscriptionPlan.priceUGX.toLocaleString()}`}
            </button>
            <p className="terms-notice">
              By clicking "Pay Now", I accept Libraula’s <a href="#">Terms & Conditions</a> and <a href="#">Privacy and Cookie Notice</a>
            </p>
          </form>
        </div>
      </section>
      <footer className="Subscription-footer">
        <p>© 2025 Libraula. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Subscription;