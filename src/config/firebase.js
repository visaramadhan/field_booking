import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCgb3vJ4w_rimY3yt5ItJqWvCkfU2r1e98",
  authDomain: "field-rental-48318.firebaseapp.com",
  projectId: "field-rental-48318",
  storageBucket: "field-rental-48318.firebasestorage.app",
  messagingSenderId: "107285017924",
  appId: "1:107285017924:web:4a8a5bfbdbba151c941311",
  measurementId: "G-1B6D2PSDE4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;