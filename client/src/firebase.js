// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_KEY,
    authDomain: "riyl-estate.firebaseapp.com",
    projectId: "riyl-estate",
    storageBucket: "riyl-estate.appspot.com",
    messagingSenderId: "175252292964",
    appId: "1:175252292964:web:585fafae9aba86a9cf6671"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);