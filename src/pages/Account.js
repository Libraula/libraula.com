import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore'; // Use getDoc for single doc
import { auth, db } from '../firebase';
import Navbar from '../components/Navbar';
import '../styles/account.css';

function Account() {
  const [userData, setUserData] = useState(null);
  const [billingHistory, setBillingHistory] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        try {
          const userDocRef = doc(db, 'users', userId);
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            setUserData(userDocSnapshot.data());
          } else {
            setError('No user data found.');
          }

          // Mock billing history (replace with real data later)
          const history = [
            { date: 'January 15, 2025', amount: '$11.99', status: 'Paid' },
            { date: 'December 15, 2024', amount: '$11.99', status: 'Paid' },
          ];
          setBillingHistory(history);
        } catch (err) {
          setError('Failed to load account details: ' + err.message);
          console.error('Error fetching user data:', err);
        }
      } else {
        setError('You must be logged in to view this page.');
      }
    };
    fetchUserData();
  }, []);

  if (error) {
    return (
      <div className="Account">
        <Navbar />
        <section className="account-section">
          <h1>Your Account</h1>
          <p className="error">{error}</p>
        </section>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="Account">
        <Navbar />
        <section className="account-section">
          <h1>Your Account</h1>
          <p>Loading...</p>
        </section>
      </div>
    );
  }

  return (
    <div className="Account">
      <Navbar />
      <section className="account-section">
        <h1>Your Account</h1>
        <p>Manage your subscription, billing, and shipping details.</p>

        <div className="account-card">
          <h2>Subscription</h2>
          <div className="subscription-details">
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Plan:</strong> {userData.plan}</p>
            <p><strong>Price:</strong> {userData.plan === 'Basic' ? '$7.99/mo' : userData.plan === 'Standard' ? '$11.99/mo' : '$15.99/mo'}</p>
            <p><strong>Start Date:</strong> {userData.startDate}</p>
            <p><strong>Next Billing Date:</strong> {userData.nextBillingDate}</p>
            <p><strong>Status:</strong> <span className={userData.status.toLowerCase()}>{userData.status}</span></p>
          </div>
          <div className="account-actions">
            <button className="action-button">Change Plan</button>
            <button className="action-button cancel">Cancel Subscription</button>
          </div>
        </div>

        <div className="account-card">
          <h2>Billing History</h2>
          {billingHistory.length > 0 ? (
            <table className="billing-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {billingHistory.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.date}</td>
                    <td>{entry.amount}</td>
                    <td>{entry.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No billing history available.</p>
          )}
        </div>

        <div className="account-card">
          <h2>Shipping Address</h2>
          <div className="shipping-details">
            <p>{userData.shippingAddress.line1}</p>
            <p>{userData.shippingAddress.city}, {userData.shippingAddress.state} {userData.shippingAddress.zip}</p>
          </div>
          <button className="action-button">Edit Address</button>
        </div>

        <div className="account-card">
          <h2>Account Settings</h2>
          <div className="settings-options">
            <button className="action-button">Change Password</button>
            <button className="action-button">Update Email</button>
            <button className="action-button">Manage Payment Methods</button>
          </div>
        </div>
      </section>
      <footer className="Account-footer">
        <div className="footer-links">
          <a href="#">Help Center</a> | <a href="#">Terms of Use</a> | <a href="#">Privacy Policy</a> | <a href="#">Contact Us</a>
        </div>
        <p>© 2025 Libraula. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Account;