// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth'; // Add Authentication
import { getFirestore } from 'firebase/firestore'; // Add Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRpi6fts3d2yCwM38z7TUk4G-x7eV71Lw",
  authDomain: "libraula-c21ca.firebaseapp.com",
  projectId: "libraula-c21ca",
  storageBucket: "libraula-c21ca.firebasestorage.app",
  messagingSenderId: "129372526463",
  appId: "1:129372526463:web:702e12d470d52e8719ac4a",
  measurementId: "G-TG7ZGXBWLF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Authentication and Firestore
export const auth = getAuth(app); // Export auth for Authentication
export const db = getFirestore(app); // Export db for Firestore