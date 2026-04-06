import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent as firebaseLogEvent } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCrC11SjXwKJiy4Q92VYiH7ZWHIR4navvA",
  authDomain: "d-banking-ai-demo.firebaseapp.com",
  projectId: "d-banking-ai-demo",
  storageBucket: "d-banking-ai-demo.firebasestorage.app",
  messagingSenderId: "268411044376",
  appId: "1:268411044376:web:76fd8e23407e0c1657b96d",
  measurementId: "G-7LZP1ZQQN0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only if supported in environment)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export const logEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (analytics) {
    firebaseLogEvent(analytics, eventName, eventParams);
    if (import.meta.env.DEV) {
      console.log(`[Analytics] Event: ${eventName}`, eventParams);
    }
  }
};

export default app;
