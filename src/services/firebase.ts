import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC2I7skoG9_3VSKese9O8wUu1z3evYdI9g",
  authDomain: "myhabitapp-50a31.firebaseapp.com",
  projectId: "myhabitapp-50a31",
  storageBucket: "myhabitapp-50a31.firebasestorage.app",
  messagingSenderId: "911502558093",
  appId: "1:911502558093:web:7a5b5d0e700ba6641a73c4",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);