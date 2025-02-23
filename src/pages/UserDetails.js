import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase'; // Adjust path if needed
import Navbar from '../components/Navbar'; // Adjust path based on your structure
import '../styles/userdetails.css';

function UserDetails() {
  const [formData, setFormData] = useState({
    name: '',
    addressLine1: '',
    city: '',
    state: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      setError('You must be logged in to save details.');
      navigate('/login');
      return;
    }

    try {
      const userId = auth.currentUser.uid; // Use UID instead of email
      const userDocRef = doc(db, 'users', userId); // Document ID is now UID
      const selectedPlan = localStorage.getItem('selectedPlan') || 'Basic';

      // Data to upload to Firestore
      const userDetails = {
        name: formData.name,
        email: auth.currentUser.email, // Include email as a field for convenience
        shippingAddress: {
          line1: formData.addressLine1,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
        },
        payment: {
          cardNumber: formData.cardNumber,
          expiry: formData.expiry,
          cvv: formData.cvv,
        },
        plan: selectedPlan,
        startDate: new Date().toISOString().split('T')[0],
        nextBillingDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
        status: 'Active',
      };

      // Upload to Firestore
      await setDoc(userDocRef, userDetails, { merge: true });
      console.log(`User details for UID ${userId} saved to Firestore`);

      // Clear temporary storage and redirect to home
      localStorage.removeItem('selectedPlan');
      navigate('/home');
    } catch (err) {
      setError('Failed to save your details. Please try again.');
      console.error('Error saving user details to Firestore:', err);
    }
  };

  return (
    <div className="UserDetails">
      <Navbar />
      <section className="user-details-form">
        <h1>Complete Your Profile</h1>
        <p>Please provide your details to finalize your subscription.</p>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Address Line 1"
            value={formData.addressLine1}
            onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="City"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="State"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Zip Code"
            value={formData.zip}
            onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Card Number"
            value={formData.cardNumber}
            onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Expiry (MM/YY)"
            value={formData.expiry}
            onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="CVV"
            value={formData.cvv}
            onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
            required
          />
          <button type="submit" className="submit-button">Save Details</button>
        </form>
      </section>
      <footer className="UserDetails-footer">
        <p>© 2025 Libraula. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default UserDetails;