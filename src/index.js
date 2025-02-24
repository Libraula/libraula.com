import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import './index.css';
import App from './App';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Pricing from './pages/Pricing';
import UserDetails from './pages/UserDetails';
import Subscription from './pages/Subscription';
import NewReleases from './pages/NewReleases';
import MyQueue from './pages/MyQueue';
import Details from './pages/Details';
import Admin from './pages/Admin';
import Account from './pages/Account';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './hooks/useAuth';

// Wrapper component to handle redirects
const AuthRedirect = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      const currentPath = window.location.pathname;
      const publicRoutes = ['/', '/login', '/signup'];
      const protectedRoutes = [
        '/home', '/pricing', '/user-details', '/subscription', '/new-releases',
        '/queue', '/movie/', '/admin', '/account' // Partial match for /movie/:id
      ];

      if (user) {
        // Logged in: Redirect to /home only if not on a protected route
        if (!protectedRoutes.some(route => currentPath === route || currentPath.startsWith(route))) {
          console.log('Logged in, redirecting to /home from:', currentPath);
          navigate('/home', { replace: true });
        }
      } else {
        // Not logged in: Redirect to / if not on a public route
        if (!publicRoutes.includes(currentPath)) {
          console.log('Not logged in, redirecting to / from:', currentPath);
          navigate('/', { replace: true });
        }
      }
    }
  }, [user, loading, navigate]);

  // Return children only if not loading; otherwise, show loading state
  return loading ? <div>Loading...</div> : children;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthRedirect>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pricing"
            element={
              <ProtectedRoute>
                <Pricing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-details"
            element={
              <ProtectedRoute>
                <UserDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subscription"
            element={
              <ProtectedRoute>
                <Subscription />
              </ProtectedRoute>
            }
          />
          <Route
            path="/new-releases"
            element={
              <ProtectedRoute>
                <NewReleases />
              </ProtectedRoute>
            }
          />
          <Route
            path="/queue"
            element={
              <ProtectedRoute>
                <MyQueue />
              </ProtectedRoute>
            }
          />
          <Route
            path="/movie/:id"
            element={
              <ProtectedRoute>
                <Details />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          {/* Catch-all route for unmatched paths */}
          <Route path="*" element={null} />
        </Routes>
      </AuthRedirect>
    </BrowserRouter>
  </React.StrictMode>
);