
////////////////////////////////////////////////////////////////////////////
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "campusx-359af.firebaseapp.com",
  projectId: "campusx-359af",
  storageBucket: "campusx-359af.appspot.com",
  messagingSenderId: "871508661404",
  appId: "1:871508661404:web:0ce46b0eb8ba2f08ed8959",
  measurementId: "G-BNP1Z9C3J4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;