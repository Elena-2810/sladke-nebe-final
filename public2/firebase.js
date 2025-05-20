import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// КОНФИГУРАЦИЯ — оставь свою
const firebaseConfig = {
  apiKey: "AI...твой-ключ",
  authDomain: "sladke-nebe-final.firebaseapp.com",
  projectId: "sladke-nebe-final",
  storageBucket: "sladke-nebe-final.appspot.com",
  messagingSenderId: "310324730606",
  appId: "1:310324730606:web:0e8aa8353b3a691735f1ff",
  measurementId: "G-P02SDJWCT7"
};

// ИНИЦИАЛИЗАЦИЯ Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp); // <<< ВАЖНО: инициализируем Firestore

// ЭКСПОРТИРУЕМ
export  { db, collection, addDoc };