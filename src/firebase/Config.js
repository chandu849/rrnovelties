
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage"

export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FB_API_KEY,
  authDomain: "eshop-bf6e1.firebaseapp.com",
  projectId: "eshop-bf6e1",
  storageBucket: "eshop-bf6e1.appspot.com",
  messagingSenderId: "704612981571",
  appId: "1:704612981571:web:0520ebc38edae24b532df6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;