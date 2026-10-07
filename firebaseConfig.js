// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCN0Q4rilmn90hj5Hw7OkJUMw_V6iWZHv8",
  authDomain: "trailfinder-9ad0b.firebaseapp.com",
  projectId: "trailfinder-9ad0b",
  storageBucket: "trailfinder-9ad0b.firebasestorage.app",
  messagingSenderId: "659941644149",
  appId: "1:659941644149:web:ee5a1f4b17ee835f17e53c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);