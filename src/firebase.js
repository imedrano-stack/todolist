import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  // Aquí debes agregar la información de tu proyecto Firebase
  apiKey: "AIzaSyBfG6G-TtwFSJUe2ZDL-E6eHHLSBCNINZA",
  authDomain: "todolist-186d6.firebaseapp.com",
  projectId: "todolist-186d6",
  storageBucket: "todolist-186d6.appspot.com",
  messagingSenderId: "920978630951",
  appId: "1:920978630951:web:d69db30123d30113cfa102",
  measurementId: "G-DEQZG78S5L",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

export { app, db, auth };
