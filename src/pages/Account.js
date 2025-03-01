import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useSubscription } from '../hooks/useSubscription';
import { useUserDetails } from '../hooks/useUserDetails'; // Import the user details hook
import Navbar from '../components/Navbar';
import { User, MapPin, CreditCard, Package } from 'lucide-react';
import '../styles/account.css';

function Account() {
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('personal');
  const navigate = useNavigate();
  const { isSubscribed, loading: subscriptionLoading } = useSubscription();
  const { hasDetails, loading: detailsLoading } = useUserDetails();

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!auth.currentUser) {
        navigate('/login');
        return;
      }

      // Wait for both subscription and details loading to resolve
      if (subscriptionLoading || detailsLoading) return;

      // Redirect to pricing if not subscribed
      if (isSubscribed === false) {
        navigate('/pricing');
        return;
      }

      // If subscribed but no details, redirect to user-details
      if (isSubscribed && hasDetails === false) {
        navigate('/user-details');
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
  }, [navigate, isSubscribed, subscriptionLoading, hasDetails, detailsLoading]);

  // Combined loading state for subscription, user details, and local fetch
  if (loading || subscriptionLoading || detailsLoading) {
    return (
      <div className="Account">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading account details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="Account">
        <Navbar />
        <section className="account-section">
          <h1>My Account</h1>
          <div className="error-message">{error}</div>
        </section>
      </div>
    );
  }

  const renderPersonalDetails = () => (
    <div className="details-card">
      <div className="details-header">
        <User size={22} />
        <h2>Personal Details</h2>
      </div>
      <div className="details-content">
        <div className="detail-item">
          <span className="detail-label">First Name</span>
          <span className="detail-value">{userDetails?.firstName || 'N/A'}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Last Name</span>
          <span className="detail-value">{userDetails?.lastName || 'N/A'}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Phone Number</span>
          <span className="detail-value">{userDetails?.phoneNumber || 'N/A'}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Additional Phone</span>
          <span className="detail-value">{userDetails?.additionalPhoneNumber || 'N/A'}</span>
        </div>
        <button className="edit-button" onClick={() => navigate('/user-details')}>
          Edit Personal Details
        </button>
      </div>
    </div>
  );

  const renderShippingAddress = () => (
    <div className="details-card">
      <div className="details-header">
        <MapPin size={22} />
        <h2>Shipping Address</h2>
      </div>
      <div className="details-content">
        <div className="detail-item">
          <span className="detail-label">Address</span>
          <span className="detail-value">{userDetails?.shippingAddress?.address || 'N/A'}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Additional Info</span>
          <span className="detail-value">{userDetails?.shippingAddress?.additionalInfo || 'N/A'}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Region</span>
          <span className="detail-value">{userDetails?.shippingAddress?.region || 'N/A'}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">City</span>
          <span className="detail-value">{userDetails?.shippingAddress?.city || 'N/A'}</span>
        </div>
        <button className="edit-button" onClick={() => navigate('/user-details')}>
          Update Address
        </button>
      </div>
    </div>
  );

  const renderSubscriptionDetails = () => (
    <div className="details-card">
      <div className="details-header">
        <Package size={22} />
        <h2>Subscription Details</h2>
      </div>
      <div className="details-content">
        <div className="detail-item">
          <span className="detail-label">Plan</span>
          <span className="detail-value plan-badge">{userDetails?.plan || 'N/A'}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Start Date</span>
          <span className="detail-value">{userDetails?.startDate || 'N/A'}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Next Billing Date</span>
          <span className="detail-value">{userDetails?.nextBillingDate || 'N/A'}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Status</span>
          <span className="detail-value status-badge">{userDetails?.status || 'N/A'}</span>
        </div>
        <button className="edit-button">Manage Subscription</button>
      </div>
    </div>
  );

  const renderPaymentDetails = () => (
    <div className="details-card">
      <div className="details-header">
        <CreditCard size={22} />
        <h2>Payment Details</h2>
      </div>
      <div className="details-content">
        <div className="detail-item">
          <span className="detail-label">Payment Method</span>
          <span className="detail-value">{userDetails?.paymentDetails?.paymentMethod || 'N/A'}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Mobile Provider</span>
          <span className="detail-value">{userDetails?.paymentDetails?.mobileProvider || 'N/A'}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Mobile Number</span>
          <span className="detail-value">{userDetails?.paymentDetails?.phoneNumber || 'N/A'}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Amount Paid</span>
          <span className="detail-value">
            {userDetails?.paymentDetails?.subscriptionAmount 
              ? `UGX ${userDetails.paymentDetails.subscriptionAmount.toLocaleString()}` 
              : 'N/A'}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Payment Date</span>
          <span className="detail-value">{userDetails?.paymentDetails?.paymentDate || 'N/A'}</span>
        </div>
        <button className="edit-button">Update Payment Method</button>
      </div>
    </div>
  );

  return (
    <div className="Account">
      <Navbar />
      <section className="account-section">
        <h1>My Account</h1>
        
        <div className="account-navbar">
          <button 
            className={activeSection === 'personal' ? 'active' : ''} 
            onClick={() => setActiveSection('personal')}
          >
            <User size={18} />
            <span>Personal</span>
          </button>
          <button 
            className={activeSection === 'shipping' ? 'active' : ''} 
            onClick={() => setActiveSection('shipping')}
          >
            <MapPin size={18} />
            <span>Address</span>
          </button>
          <button 
            className={activeSection === 'subscription' ? 'active' : ''} 
            onClick={() => setActiveSection('subscription')}
          >
            <Package size={18} />
            <span>Subscription</span>
          </button>
          <button 
            className={activeSection === 'payment' ? 'active' : ''} 
            onClick={() => setActiveSection('payment')}
          >
            <CreditCard size={18} />
            <span>Payment</span>
          </button>
        </div>
        
        {userDetails ? (
          <div className="account-details">
            {activeSection === 'personal' && renderPersonalDetails()}
            {activeSection === 'shipping' && renderShippingAddress()}
            {activeSection === 'subscription' && renderSubscriptionDetails()}
            {activeSection === 'payment' && renderPaymentDetails()}
          </div>
        ) : (
          <div className="empty-state">
            <p>No account details available.</p>
            <button className="primary-button" onClick={() => navigate('/user-details')}>
              Complete Your Profile
            </button>
          </div>
        )}
      </section>
      <footer className="Account-footer">
        <div className="footer-content">
          <p>Customer Support: <a href="mailto:support@libraula.com">support@libraula.com</a> | <a href="#">Chat</a></p>
          <div className="footer-links">
            <a href="#">Help Center</a> | <a href="#">Terms of Use</a> | <a href="#">Privacy Policy</a> | <a href="#">Contact Us</a>
          </div>
          <p>© 2025 Libraula. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Account;