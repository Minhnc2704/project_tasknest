import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB5oNegxw03zJpogrpwb7pbPLvkHduPPAY",
  authDomain: "task-nest-c2198.firebaseapp.com",
  projectId: "task-nest-c2198",
  storageBucket: "task-nest-c2198.appspot.com",
  messagingSenderId: "625678127536",
  appId: "1:625678127536:web:6538b211f7f5e844a28675",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
