// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA6XW2TpJaqn-cD1IfJKdnIqWZL7Vgnnt4",
    authDomain: "codesprout-frontend.firebaseapp.com",
    projectId: "codesprout-frontend",
    storageBucket: "codesprout-frontend.appspot.com",
    messagingSenderId: "480923706167",
    appId: "1:480923706167:web:aff39385d9abcd10ddb0b2",
    measurementId: "G-Z3SX5EFB9B"
  };
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const storage = getStorage(app);

export default storage;
