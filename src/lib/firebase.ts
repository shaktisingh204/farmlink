// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmsMTAooMvQQ8ABcbe6TwgLxQltFSu1Ig",
  authDomain: "shivamproject-288ca.firebaseapp.com",
  projectId: "shivamproject-288ca",
  storageBucket: "shivamproject-288ca.firebasestorage.app",
  messagingSenderId: "1060221387669",
  appId: "1:1060221387669:web:bdd0650aa372c9af3d6c9c",
  measurementId: "G-Y2T9Q2SF02",
  databaseURL: "https://shivamproject-288ca.firebaseio.com" // Ensure databaseURL is present
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getDatabase(app);

// It's good practice to initialize Analytics if you plan to use it.
// We'll check if window is defined to prevent errors during server-side rendering.
if (typeof window !== 'undefined') {
    getAnalytics(app);
}

export { app, auth, db };
