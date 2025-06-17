// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyArSJjvW4_bvBGg2xq6kFcMQyxe7ImqiGc",
  authDomain: "parkeasy-3194e.firebaseapp.com",
  projectId: "parkeasy-3194e",
  storageBucket: "parkeasy-3194e.firebasestorage.app",
  messagingSenderId: "894075594740",
  appId: "1:894075594740:web:11d83c659f1b34b335fba1",
  measurementId: "G-3FEHGMSWTP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);


export { auth, app, analytics, db };

