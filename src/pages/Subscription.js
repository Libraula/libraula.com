import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore'; // Added getDoc for verification
import { useUserDetails } from '../hooks/useUserDetails'; // Import the new hook
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
  const { hasDetails, loading: detailsLoading } = useUserDetails();

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

    if (detailsLoading) {
      setError('Checking your profile details, please wait...');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const userId = auth.currentUser.uid;
      const email = auth.currentUser.email;
      const txRef = `tx-${userId}-${Date.now()}`;
      const phoneNumber = `256${formData.phone}`;

      const payload = {
        phoneNumber,
        mobileProvider: formData.mobileProvider,
        amount: subscriptionPlan.priceUGX,
        email,
        txRef,
      };

      console.log('Initiating payment with payload:', payload);

      const response = await axios.post('http://localhost:5000/initiate-payment', payload, {
        timeout: 10000,
      });

      const paymentResponse = response.data;
      console.log('Payment initiation response:', paymentResponse);

      if (paymentResponse.status === 'success' && paymentResponse.meta?.authorization?.mode === 'redirect') {
        // Store payment details in Firestore before redirecting
        const paymentDetails = {
          paymentMethod: 'Mobile Money',
          mobileProvider: formData.mobileProvider === 'MTNUG' ? 'MTN' : 'Airtel',
          phoneNumber: phoneNumber,
          subscriptionAmount: subscriptionPlan.priceUGX,
          paymentDate: new Date().toISOString().split('T')[0],
          transactionRef: txRef,
        };

        const userDocRef = doc(db, 'users', userId);
        await setDoc(userDocRef, { paymentDetails }, { merge: true });
        console.log('Payment details saved to Firestore:', paymentDetails);

        // Store subscription status (assuming payment initiation implies subscription start)
        const subscriptionRef = doc(db, 'subscriptions', userId);
        await setDoc(subscriptionRef, { isActive: true }, { merge: true });

        // Redirect based on whether user details exist
        const redirectUrl = hasDetails ? '/home' : '/user-details';
        navigate(redirectUrl, { state: { fromPayment: !hasDetails } });
        window.location.href = paymentResponse.meta.authorization.redirect;
      } else {
        throw new Error('Payment initiation failed: Invalid response');
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
              <label htmlFor="mobileProvider">Select your operator</label>
              <select
                id="mobileProvider"
                name="mobileProvider"
                className="mtn validate unselect"
                value={formData.mobileProvider}
                onChange={(e) => setFormData({ ...formData, mobileProvider: e.target.value })}
                disabled={isLoading || detailsLoading}
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
                placeholder="Insert mobile number without 0"
                required
                disabled={isLoading || detailsLoading}
              />
            </div>

            <button type="submit" className="pay-now-button" disabled={isLoading || detailsLoading}>
              {isLoading ? 'Processing...' : `Pay Now: UGX ${subscriptionPlan.priceUGX.toLocaleString()}`}
            </button>
            <p className="terms-notice">
              By clicking "Pay Now", I accept Libraula’s{' '}
              <a href="#">Terms & Conditions</a> and{' '}
              <a href="#">Privacy and Cookie Notice</a>
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