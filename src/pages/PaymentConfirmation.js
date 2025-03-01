import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserDetails } from '../hooks/useUserDetails'; // Import the new hook
import Navbar from '../components/Navbar';
import '../styles/payment-confirmation.css';

function PaymentConfirmation() {
  const navigate = useNavigate();
  const { hasDetails, loading } = useUserDetails();

  useEffect(() => {
    if (loading) return; // Wait until user details check is complete

    const timer = setTimeout(() => {
      localStorage.removeItem('selectedPlan');
      // Redirect based on whether user details exist
      const redirectPath = hasDetails ? '/home' : '/user-details';
      navigate(redirectPath, { state: { fromPayment: !hasDetails } });
    }, 3000); // Redirect after 3 seconds

    return () => clearTimeout(timer);
  }, [navigate, hasDetails, loading]);

  return (
    <div className="PaymentConfirmation">
      <Navbar />
      <section className="confirmation-section">
        <h1>Payment Processing</h1>
        <p>
          {loading
            ? 'Checking your profile details, please wait...'
            : 'Your payment is being processed. You’ll be redirected shortly.'}
        </p>
        <div className="spinner"></div>
      </section>
      <footer className="confirmation-footer">
        <p>© 2025 Libraula. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default PaymentConfirmation;