import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBmZ-mzYHMdsQDl7uLAwi6SJPkOsB-AUgQ",
  authDomain: "medical-lifeline.firebaseapp.com",
  projectId: "medical-lifeline",
  storageBucket: "medical-lifeline.firebasestorage.app",
  messagingSenderId: "222915951139",
  appId: "1:222915951139:web:79a2a5c90b2ba084b20f96",
  measurementId: "G-1LMD5DZ32B"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);