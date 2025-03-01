// hooks/useSubscription.js
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export function useSubscription() {
  const [isSubscribed, setIsSubscribed] = useState(null); // null = loading, true = subscribed, false = not subscribed
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      if (!auth.currentUser) {
        console.log('No authenticated user found.');
        setIsSubscribed(false);
        setLoading(false);
        return;
      }

      try {
        const userId = auth.currentUser.uid;
        console.log('Checking subscription for user:', userId);

        // Check subscriptions collection
        const subscriptionRef = doc(db, 'subscriptions', userId);
        const subscriptionDoc = await getDoc(subscriptionRef);

        if (subscriptionDoc.exists()) {
          const subscriptionData = subscriptionDoc.data();
          console.log('Subscription data:', subscriptionData);
          if (subscriptionData.isActive) {
            setIsSubscribed(true);
            console.log('User is subscribed based on subscriptions collection.');
            setLoading(false);
            return;
          }
        } else {
          console.log('No subscription document found in subscriptions collection.');
        }

        // Fallback: Check users collection for payment details as an indicator
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log('User data:', userData);
          // Check if paymentDetails or a subscription status exists
          if (userData.paymentDetails?.subscriptionAmount || userData.status === 'Active') {
            setIsSubscribed(true);
            console.log('User is subscribed based on users collection (paymentDetails or status).');
          } else {
            setIsSubscribed(false);
            console.log('User is not subscribed based on users collection.');
          }
        } else {
          setIsSubscribed(false);
          console.log('No user document found in users collection.');
        }
      } catch (err) {
        console.error('Error checking subscription:', err);
        setIsSubscribed(false); // Default to not subscribed on error
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged(() => {
      checkSubscription();
    });

    return () => unsubscribe();
  }, []);

  return { isSubscribed, loading };
}