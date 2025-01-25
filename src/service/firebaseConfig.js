// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZoUEF8Bu-STEaxJhca2Lt1ZTrbciZZ-k",
  authDomain: "travel-planner-83523.firebaseapp.com",
  projectId: "travel-planner-83523",
  storageBucket: "travel-planner-83523.firebasestorage.app",
  messagingSenderId: "121722345431",
  appId: "1:121722345431:web:1d7a8b9218c02274d19d92",
  measurementId: "G-91RE91JEM2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);