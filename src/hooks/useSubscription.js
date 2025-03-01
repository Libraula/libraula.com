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

          const currentDate = new Date();
          const nextBillingDate = subscriptionData.nextBillingDate 
            ? new Date(subscriptionData.nextBillingDate) 
            : null;

          // Subscription is valid if isActive is true and nextBillingDate is in the future
          if (subscriptionData.isActive && (!nextBillingDate || nextBillingDate > currentDate)) {
            setIsSubscribed(true);
            console.log('User is subscribed based on subscriptions collection.');
          } else {
            setIsSubscribed(false);
            console.log('Subscription expired or inactive:', {
              isActive: subscriptionData.isActive,
              nextBillingDate: subscriptionData.nextBillingDate,
              currentDate: currentDate.toISOString(),
            });
          }
        } else {
          console.log('No subscription document found in subscriptions collection.');
          // Fallback to users collection
          const userDocRef = doc(db, 'users', userId);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log('User data:', userData);
            const nextBillingDate = userData.nextBillingDate 
              ? new Date(userData.nextBillingDate) 
              : null;

            if ((userData.paymentDetails?.subscriptionAmount || userData.status === 'Active') && 
                (!nextBillingDate || nextBillingDate > new Date())) {
              setIsSubscribed(true);
              console.log('User is subscribed based on users collection.');
            } else {
              setIsSubscribed(false);
              console.log('No active subscription in users collection.');
            }
          } else {
            setIsSubscribed(false);
            console.log('No user document found in users collection.');
          }
        }
      } catch (err) {
        console.error('Error checking subscription:', err);
        setIsSubscribed(false); // Default to not subscribed on error
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();

    const unsubscribe = auth.onAuthStateChanged(() => {
      checkSubscription();
    });

    return () => unsubscribe();
  }, []);

  return { isSubscribed, loading };
}