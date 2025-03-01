// index.js (unchanged)
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import './index.css';
import App from './App';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Pricing from './pages/Pricing';
import UserDetails from './pages/UserDetails';
import NewReleases from './pages/NewReleases';
import MyQueue from './pages/MyQueue';
import Details from './pages/Details';
import Admin from './pages/Admin';
import Account from './pages/Account';
import PaymentConfirmation from './pages/PaymentConfirmation';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import './styles/subscription.css';

const AuthRedirect = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      const currentPath = window.location.pathname;
      const publicRoutes = ['/', '/login', '/signup'];
      const protectedRoutes = [
        '/home', '/pricing', '/user-details', '/subscription', '/new-releases',
        '/queue', '/book/', '/admin', '/account', '/payment-confirmation'
      ];

      if (user && !protectedRoutes.some(route => currentPath === route || currentPath.startsWith(route))) {
        navigate('/home', { replace: true });
      } else if (!user && !publicRoutes.includes(currentPath)) {
        navigate('/', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  return loading ? <div>Loading...</div> : children;
};

const Subscription = () => {
  const [formData, setFormData] = useState({
    mobileProvider: 'MTNUG',
    phone: '',
  });
  const [subscriptionPlan, setSubscriptionPlan] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const plan = JSON.parse(localStorage.getItem('selectedPlan'));
    if (!plan) {
      setError('No plan selected. Please choose a plan.');
      navigate('/pricing');
    } else {
      setSubscriptionPlan(plan);
    }
  }, [navigate]);

  const config = {
    public_key: 'FLWPUBK_TEST-472e4bd67d6ccbf1c7561970bb3d0ba6-X',
    tx_ref: Date.now().toString(),
    amount: subscriptionPlan?.priceUGX || 0,
    currency: 'UGX',
    payment_options: 'mobilemoneyuganda',
    customer: {
      email: user?.email || '',
      phone_number: formData.phone ? `256${formData.phone}` : '',
      name: user?.displayName || 'Anonymous User',
    },
    customizations: {
      title: 'Libraula Subscription',
      description: `Payment for ${subscriptionPlan?.name} subscription`,
      logo: 'https://your-logo-url.com/logo.png',
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.phone || formData.phone.length < 9) {
      setError('Please enter a valid phone number (9 digits without leading 0).');
      return;
    }

    if (!user) {
      setError('You must be logged in to process payment.');
      navigate('/login');
      return;
    }

    setIsLoading(true);
    setError('');

    handleFlutterPayment({
      callback: (response) => {
        console.log('Payment response:', response);
        if (response.status === 'successful') {
          navigate('/payment-confirmation');
        }
        closePaymentModal();
        setIsLoading(false);
      },
      onClose: () => {
        setIsLoading(false);
        if (!error) {
          setError('Payment cancelled by user');
        }
      },
    });
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
                placeholder="Insert mobile number without 0"
                required
                disabled={isLoading}
              />
            </div>
            <button type="submit" className="pay-now-button" disabled={isLoading}>
              {isLoading ? 'Processing...' : `Pay Now: UGX ${subscriptionPlan.priceUGX.toLocaleString()}`}
            </button>
            <p className="terms-notice">
              By clicking "Pay Now", I accept Libraula’s <a href="#">Terms & Conditions</a> and{' '}
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
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthRedirect>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/pricing" element={<ProtectedRoute><Pricing /></ProtectedRoute>} />
          <Route path="/user-details" element={<ProtectedRoute><UserDetails /></ProtectedRoute>} />
          <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
          <Route path="/new-releases" element={<ProtectedRoute><NewReleases /></ProtectedRoute>} />
          <Route path="/queue" element={<ProtectedRoute><MyQueue /></ProtectedRoute>} />
          <Route path="/book/:id" element={<ProtectedRoute><Details /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
          <Route path="/payment-confirmation" element={<ProtectedRoute><PaymentConfirmation /></ProtectedRoute>} />
          <Route path="*" element={null} />
        </Routes>
      </AuthRedirect>
    </BrowserRouter>
  </React.StrictMode>
);