// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// import { getFirestore, collection, addDoc } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4JwvWv4IW3Jn0I6vhRGOXR_yk4u0y5aM",
  authDomain: "pkm-hino.firebaseapp.com",
  projectId: "pkm-hino",
  storageBucket: "pkm-hino.appspot.com",
  messagingSenderId: "274862351643",
  appId: "1:274862351643:web:6899a4765a9f1dca035fbe",
  measurementId: "G-EM376W3BYX"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const storage = getStorage(app);
// export { auth, db, collection, addDoc, getFirestore , storage, getStorage}

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);