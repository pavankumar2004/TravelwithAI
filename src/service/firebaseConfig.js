// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Make sure to include this import

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBeF3BJLOOHGgQgwN7U_FUtxA8Il9vTHNU",
  authDomain: "travel-planner-ai-56d52.firebaseapp.com",
  projectId: "travel-planner-ai-56d52",
  storageBucket: "travel-planner-ai-56d52.firebasestorage.app",
  messagingSenderId: "7312808023",
  appId: "1:7312808023:web:1ee068725b6a6d1a782b12",
  measurementId: "G-JZV0Z8DJHS"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // Ensure this line is present
