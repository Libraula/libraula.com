// hooks/useUserDetails.js
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export function useUserDetails() {
  const [hasDetails, setHasDetails] = useState(null); // null = loading, true = has details, false = no details
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserDetails = async () => {
      if (!auth.currentUser) {
        console.log('No authenticated user found for useUserDetails.');
        setHasDetails(false);
        setLoading(false);
        return;
      }

      try {
        const userId = auth.currentUser.uid;
        console.log('Checking user details for user:', userId);

        const userDocRef = doc(db, 'users', userId);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const data = userDocSnapshot.data();
          console.log('User details data:', data);

          // Check required fields with fallbacks
          const hasRequiredDetails = 
            (data.firstName && data.phoneNumber && data.shippingAddress?.address) || // Primary check
            (data.firstName && data.phoneNumber && data.paymentDetails); // Fallback: payment details indicate some user activity
          
          setHasDetails(hasRequiredDetails);
          console.log('Has required details:', hasRequiredDetails);
          if (!hasRequiredDetails) {
            console.log('Missing fields - firstName:', data.firstName, 'phoneNumber:', data.phoneNumber, 'shippingAddress:', data.shippingAddress);
          }
        } else {
          setHasDetails(false);
          console.log('No user document found in users collection.');
        }
      } catch (err) {
        console.error('Error checking user details:', err);
        setHasDetails(false); // Default to no details on error
      } finally {
        setLoading(false);
      }
    };

    checkUserDetails();

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged(() => {
      checkUserDetails();
    });

    return () => unsubscribe();
  }, []);

  return { hasDetails, loading };
}