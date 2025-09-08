// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmsMTAooMvQQ8ABcbe6TwgLxQltFSu1Ig",
  authDomain: "shivamproject-288ca.firebaseapp.com",
  databaseURL: "https://shivamproject-288ca.firebaseio.com",
  projectId: "shivamproject-288ca",
  storageBucket: "shivamproject-288ca.appspot.com",
  messagingSenderId: "1060221387669",
  appId: "1:1060221387669:web:bdd0650aa372c9af3d6c9c",
  measurementId: "G-Y2T9Q2SF02"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getDatabase(app);

export { app, auth, db };
