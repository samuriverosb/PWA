// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApfLJwlMpRDz_WjfxHIra0_x_havUHkPk",
  authDomain: "push-notifications-pc.firebaseapp.com",
  projectId: "push-notifications-pc",
  storageBucket: "push-notifications-pc.appspot.com",
  messagingSenderId: "94925818089",
  appId: "1:94925818089:web:5b56381f9cb15b47b74878",
  measurementId: "G-02V70WLKR1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);