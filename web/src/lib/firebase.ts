import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Replace with your Firebase config from Firebase Console
// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: "AIzaSyBnOWHKKOzfCUMs_oddbyoTiIw1uh4HIR8",

  authDomain: "bimbi-749b2.firebaseapp.com",

  projectId: "bimbi-749b2",

  storageBucket: "bimbi-749b2.firebasestorage.app",

  messagingSenderId: "595275515854",

  appId: "1:595275515854:web:3a400131ce830272460d9f"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const storage = getStorage(app);
