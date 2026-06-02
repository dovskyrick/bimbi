import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBnOWHKKOzfCUMs_oddbyoTiIw1uh4HIR8",
  authDomain: "bimbi-749b2.firebaseapp.com",
  projectId: "bimbi-749b2",
  storageBucket: "bimbi-749b2.firebasestorage.app",
  messagingSenderId: "595275515854",
  appId: "1:595275515854:web:3a400131ce830272460d9f"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
