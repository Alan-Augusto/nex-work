// firebase.ts
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBvi2xljWKWkZ_gP40_JXGM_QF-UDBlmnA",
  authDomain: "nexwork-e5f34.firebaseapp.com",
  projectId: "nexwork-e5f34",
  storageBucket: "nexwork-e5f34.firebasestorage.app",
  messagingSenderId: "548348070740",
  appId: "1:548348070740:web:705f5297f707484d32d6c1",
  measurementId: "G-1MCWRJNZD7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);