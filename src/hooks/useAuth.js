import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      // Define public routes
      const publicRoutes = ['/', '/login', '/signup'];
      const currentPath = window.location.pathname;

      // Redirect logic
      if (!currentUser && !publicRoutes.includes(currentPath)) {
        navigate('/login'); // Redirect unauthenticated users to login
      } else if (currentUser && (currentPath === '/login' || currentPath === '/signup')) {
        navigate('/home'); // Redirect logged-in users away from login/signup
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return { user, loading };
};