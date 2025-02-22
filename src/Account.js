import React from 'react';
import { Link } from 'react-router-dom';
import './account.css';

// Sample user data (replace with real data or API later)
const userData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  subscription: {
    plan: 'Standard',
    price: '$11.99/mo',
    discs: '2 discs at a time',
    startDate: 'January 15, 2025',
    nextBilling: 'February 15, 2025',
    status: 'Active',
  },
  billingHistory: [
    { date: 'January 15, 2025', amount: '$11.99', status: 'Paid' },
    { date: 'December 15, 2024', amount: '$11.99', status: 'Paid' },
  ],
  shippingAddress: {
    line1: '123 Movie Lane',
    city: 'Filmville',
    state: 'CA',
    zip: '90210',
  },
};

function Account() {
  return (
    <div className="Account">
      <header className="Account-header">
        <div className="logo">Libraula</div>
        <nav className="nav-bar">
          <Link to="/home">Browse</Link>
          <Link to="/new-releases">New Releases</Link>
          <Link to="/queue">My Queue</Link>
          <Link to="/account">Account</Link>
          <Link to="/login">Sign Out</Link>
        </nav>
      </header>

      <section className="account-section">
        <h1>Your Account</h1>
        <p>Manage your subscription, billing, and shipping details.</p>

        {/* Subscription Info */}
        <div className="account-card">
          <h2>Subscription</h2>
          <div className="subscription-details">
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Plan:</strong> {userData.subscription.plan} ({userData.subscription.discs})</p>
            <p><strong>Price:</strong> {userData.subscription.price}</p>
            <p><strong>Start Date:</strong> {userData.subscription.startDate}</p>
            <p><strong>Next Billing Date:</strong> {userData.subscription.nextBilling}</p>
            <p><strong>Status:</strong> <span className={userData.subscription.status.toLowerCase()}>{userData.subscription.status}</span></p>
          </div>
          <div className="account-actions">
            <button className="action-button">Change Plan</button>
            <button className="action-button cancel">Cancel Subscription</button>
          </div>
        </div>

        {/* Billing History */}
        <div className="account-card">
          <h2>Billing History</h2>
          {userData.billingHistory.length > 0 ? (
            <table className="billing-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {userData.billingHistory.map((entry, index) => (
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

        {/* Shipping Address */}
        <div className="account-card">
          <h2>Shipping Address</h2>
          <div className="shipping-details">
            <p>{userData.shippingAddress.line1}</p>
            <p>{userData.shippingAddress.city}, {userData.shippingAddress.state} {userData.shippingAddress.zip}</p>
          </div>
          <button className="action-button">Edit Address</button>
        </div>

        {/* Account Settings */}
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