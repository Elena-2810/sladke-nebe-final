import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// ВСТАВЬ СЮДА СВОЙ КОНФИГ ИЗ FIREBASE!
const firebaseConfig = {
  apiKey: "AIzaSyDj9UMnxQlNKAWly_TmMQW7ZaldPNhtsk8",
  authDomain: "sladke-nebe-final.firebaseapp.com",
  projectId: "sladke-nebe-final",
  storageBucket: "sladke-nebe-final.firebasestorage.app",
  messagingSenderId: "310324730606",
  appId: "1:310324730606:web:0e8aa8353b3a691735f1ff",
  measurementId: "G-P02SDJWCT7"
};

// Защита от повторной инициализации
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);


// Получаем контейнер для вывода заказов
const ordersContainer = document.getElementById("orders-container");

// Загрузка заказов
async function loadOrders() {
  ordersContainer.innerHTML = ""; // Очистим перед загрузкой
  const querySnapshot = await getDocs(collection(db, "orders"));

  querySnapshot.forEach((docSnap) => {
    const order = docSnap.data();
    const editBtn = document.createElement("button");



    const orderDiv = document.createElement("div");
    orderDiv.classList.add("order");
   

    orderDiv.innerHTML = `
      <p><strong>Jméno:</strong> ${order.name}</p>
      <p><strong>Email:</strong> ${order.email}</p>
      <p><strong>Dort:</strong> ${order.product}</p>
      <p><strong>Poznámka:</strong> ${order.message || ''}</p>
      ${order.image ? `<img src="${order.image}" alt="Dort" style="max-width: 150px;" />` : ''}
      <button data-id="${docSnap.id}">Smazat</button>
    `;
    editBtn.textContent = "Upravit";
editBtn.addEventListener("click", () => {
  const newName = prompt("Změnit jméno:", order.name);
  const newMessage = prompt("Změnit poznámku:", order.message);

  if (newName !== null && newMessage !== null) {
    const orderRef = doc(db, "orders", docSnap.id);
    updateDoc(orderRef, {
      name: newName,
      message: newMessage
    }).then(() => {
      loadOrders(); // перезагрузим список
    });
  }
});

 orderDiv.appendChild(editBtn);
    
    // Удаление заказа
    const deleteBtn = orderDiv.querySelector("button");
    deleteBtn.addEventListener("click", async () => {
      await deleteDoc(doc(db, "orders", docSnap.id));
      loadOrders(); // Обновим после удаления
    });

    ordersContainer.appendChild(orderDiv);
  });
}

loadOrders();
