import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDpQKB-WWEUPFdyr26YiIdxcB1-kzriu0c",
  authDomain: "e-cell-task-8fac9.firebaseapp.com",
  projectId: "e-cell-task-8fac9",
  storageBucket: "e-cell-task-8fac9.firebasestorage.app",
  messagingSenderId: "77114863507",
  appId: "1:77114863507:web:2052212bac7743d8290266",
  measurementId: "G-0RE1PVQZCJ"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();