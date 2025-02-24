import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Navbar from '../components/Navbar';
import '../styles/account.css';

function Account() {
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!auth.currentUser) {
        navigate('/login');
        return;
      }

      try {
        const userId = auth.currentUser.uid;
        const userDocRef = doc(db, 'users', userId);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          setUserDetails(userDocSnapshot.data());
          console.log('Fetched user details:', userDocSnapshot.data());
        } else {
          setError('No account details found.');
        }
      } catch (err) {
        setError('Failed to load account details: ' + err.message);
        console.error('Error fetching user details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [navigate]);

  if (loading) {
    return (
      <div className="Account">
        <Navbar />
        <p>Loading account details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="Account">
        <Navbar />
        <section className="account-section">
          <h1>My Account</h1>
          <p className="error">{error}</p>
        </section>
      </div>
    );
  }

  return (
    <div className="Account">
      <Navbar />
      <section className="account-section">
        <h1>My Account</h1>
        {userDetails ? (
          <div className="account-details">
            <h2>Personal Details</h2>
            <p><strong>First Name:</strong> {userDetails.firstName || 'N/A'}</p>
            <p><strong>Last Name:</strong> {userDetails.lastName || 'N/A'}</p>
            <p><strong>Phone Number:</strong> {userDetails.phoneNumber || 'N/A'}</p>
            <p><strong>Additional Phone Number:</strong> {userDetails.additionalPhoneNumber || 'N/A'}</p>

            <h2>Shipping Address</h2>
            <p><strong>Address:</strong> {userDetails.shippingAddress?.address || 'N/A'}</p>
            <p><strong>Additional Info:</strong> {userDetails.shippingAddress?.additionalInfo || 'N/A'}</p>
            <p><strong>Region:</strong> {userDetails.shippingAddress?.region || 'N/A'}</p>
            <p><strong>City:</strong> {userDetails.shippingAddress?.city || 'N/A'}</p>

            <h2>Subscription Details</h2>
            <p><strong>Plan:</strong> {userDetails.plan || 'N/A'}</p>
            <p><strong>Start Date:</strong> {userDetails.startDate || 'N/A'}</p>
            <p><strong>Next Billing Date:</strong> {userDetails.nextBillingDate || 'N/A'}</p>
            <p><strong>Status:</strong> {userDetails.status || 'N/A'}</p>

            <h2>Payment Details</h2>
            <p><strong>Payment Method:</strong> {userDetails.paymentDetails?.paymentMethod || 'N/A'}</p>
            <p><strong>Mobile Provider:</strong> {userDetails.paymentDetails?.mobileProvider || 'N/A'}</p>
            <p><strong>Mobile Number:</strong> {userDetails.paymentDetails?.phoneNumber || 'N/A'}</p>
            <p><strong>Amount Paid:</strong> {userDetails.paymentDetails?.subscriptionAmount ? `UGX ${userDetails.paymentDetails.subscriptionAmount.toLocaleString()}` : 'N/A'}</p>
            <p><strong>Payment Date:</strong> {userDetails.paymentDetails?.paymentDate || 'N/A'}</p>
          </div>
        ) : (
          <p>No account details available.</p>
        )}
      </section>
      <footer className="Account-footer">
        <p>Customer Support: <a href="mailto:support@libraula.com">support@libraula.com</a> | <a href="#">Chat</a></p>
        <div className="footer-links">
          <a href="#">Help Center</a> | <a href="#">Terms of Use</a> | <a href="#">Privacy Policy</a> | <a href="#">Contact Us</a>
        </div>
        <p>© 2025 Libraula. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Account;