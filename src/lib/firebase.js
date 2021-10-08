// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { seedDatabase } from "../seed";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQZd-l2OEZBd6smYlbZ8xDbOa-zhXBX10",
  authDomain: "instagram-f0e73.firebaseapp.com",
  projectId: "instagram-f0e73",
  storageBucket: "instagram-f0e73.appspot.com",
  messagingSenderId: "386141276633",
  appId: "1:386141276633:web:684efff909adcebc43b1c8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// reference to firestore
const db = getFirestore(app);
const storage = getStorage(app);

// call the seedDatabase function ONCE!
// seedDatabase(db);
export { app, storage };
export default db;
