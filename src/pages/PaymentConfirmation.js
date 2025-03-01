import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/payment-confirmation.css';

function PaymentConfirmation() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.removeItem('selectedPlan');
      navigate('/user-details'); // Redirect to UserDetails after payment
    }, 3000); // Redirect after 3 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="PaymentConfirmation">
      <Navbar />
      <section className="confirmation-section">
        <h1>Payment Processing</h1>
        <p>Your payment is being processed. You’ll be redirected to enter your details shortly.</p>
        <div className="spinner"></div>
      </section>
      <footer className="confirmation-footer">
        <p>© 2025 Libraula. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default PaymentConfirmation;