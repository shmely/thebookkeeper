import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAoKpMeAowFlD0ikyNZkLwctfLPOExaguE",
  authDomain: "book-keeper-app-20b71.firebaseapp.com",
  projectId: "book-keeper-app-20b71",
  storageBucket: "book-keeper-app-20b71.firebasestorage.app",
  messagingSenderId: "677977523234",
  appId: "1:677977523234:web:bd638b710aa654ae81f67b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();