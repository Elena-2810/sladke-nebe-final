import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { updateDoc, doc} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Твоя конфигурация Firebase
const firebaseConfig = {
  apiKey: "ТВОЙ_API_KEY",
  authDomain: "ТВОЙ_AUTH_DOMAIN",
  projectId: "ТВОЙ_PROJECT_ID",
  storageBucket: "ТВОЙ_STORAGE_BUCKET",
  messagingSenderId: "ТВОЙ_SENDER_ID",
  appId: "ТВОЙ_APP_ID"
};

const app = initializeApp(firebaseConfig);
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

    const orderDiv = document.createElement("div");
    orderDiv.classList.add("order");

    orderDiv.innerHTML = `
      <p><strong>Jméno:</strong> ${order.name}</p>
      <p><strong>Email:</strong> ${order.email}</p>
      <p><strong>Dort:</strong> ${order.product}</p>
      <p><strong>Poznámka:</strong> ${order.message || ''}</p>
      ${order.image ? <img src="${order.image}" alt="Dort" style="max-width: 150px;" /> : ''}
      <button data-id="${docSnap.id}">Smazat</button>
    `;

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