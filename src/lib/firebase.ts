
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyAtuqroUbp9TpqjNvbl99eDaihRMenhEqw",
  authDomain: "pint-145f3.firebaseapp.com",
  projectId: "pint-145f3",
  storageBucket: "pint-145f3.firebasestorage.app",
  messagingSenderId: "77141015675",
  appId: "1:77141015675:web:c6d8a85808f1bc798ab6de",
  measurementId: "G-B7ZLVRH8FF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

export default app;
