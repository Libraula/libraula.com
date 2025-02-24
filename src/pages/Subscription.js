import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Add getDoc, setDoc
import { auth, db } from '../firebase';
import Navbar from '../components/Navbar';
import '../styles/subscription.css';

function Subscription() {
  const [formData, setFormData] = useState({
    mobileProvider: 'MTNUG', // Default to MTN
    phone: '',
  });
  const [subscriptionAmount, setSubscriptionAmount] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const selectedPlan = localStorage.getItem('selectedPlan') || 'Basic';
    const amounts = {
      'Basic': 7900,    // UGX 7,900
      'Standard': 11900, // UGX 11,900
      'Premium': 15900,  // UGX 15,900
    };
    const amount = amounts[selectedPlan] || amounts['Basic'];
    console.log('Selected plan:', selectedPlan, 'Amount:', amount);
    setSubscriptionAmount(amount);
  }, []);

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

    try {
      const userId = auth.currentUser.uid;
      const userDocRef = doc(db, 'users', userId);

      // Fetch existing user details
      const userDocSnapshot = await getDoc(userDocRef);
      const existingDetails = userDocSnapshot.exists() ? userDocSnapshot.data() : {};

      // Payment details to save
      const paymentDetails = {
        paymentMethod: 'mobileMoney',
        mobileProvider: formData.mobileProvider === 'MTNUG' ? 'MTN' : 'Airtel',
        phoneNumber: `+256${formData.phone}`,
        subscriptionAmount: subscriptionAmount,
        paymentDate: new Date().toISOString(),
      };

      // Merge existing details with payment details
      const updatedUserDetails = {
        ...existingDetails,
        paymentDetails: paymentDetails,
      };

      // Save to Firestore
      await setDoc(userDocRef, updatedUserDetails, { merge: true });
      console.log('Payment details saved to Firestore for UID:', userId);

      // Simulate payment success (replace with actual API call in production)
      setTimeout(() => {
        console.log('Payment successful');
        localStorage.removeItem('selectedPlan');
        navigate('/home');
      }, 1000);
    } catch (err) {
      setError('Failed to process payment: ' + err.message);
      console.error('Payment error:', err);
    }
  };

  if (subscriptionAmount === null) {
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
        <p>Choose your payment method to complete your subscription</p>
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
              />
            </div>

            <button type="submit" className="pay-now-button">
              Pay Now: UGX {subscriptionAmount.toLocaleString()}
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