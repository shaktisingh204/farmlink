// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA7CfvpJtRmM6z5N5WaS3walXeULInH4jk",
  authDomain: "data-app-ff431.firebaseapp.com",
  databaseURL: "https://data-app-ff431.firebaseio.com",
  projectId: "data-app-ff431",
  storageBucket: "data-app-ff431.appspot.com",
  messagingSenderId: "852782494583",
  appId: "1:852782494583:web:6956373597143678036772",
  measurementId: "G-F15YVNFB8C"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getDatabase(app);

export { app, auth, db };
