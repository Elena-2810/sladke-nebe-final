import { db, collection, addDoc } from './firebase.js';

document.getElementById('contact-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

let selectedProductName = '';
let selectedProductImage = '';
const productDataString = localStorage.getItem('confirmedOrderDetail');
if (productDataString) {
  try {
    const product = JSON.parse(productDataString);
    selectedProductName = product.name;
    selectedProductImage = product.image; // <-- добавлено
  } catch (err) {
    console.error('Ошибка при чтении продукта:', err);
  }
}

  try {
    await addDoc(collection(db, 'orders'), {
      name,
      email,
      message,
      product: selectedProductName,
      image: selectedProductImage,
      timestamp: new Date()
    });

    document.getElementById('response-message').textContent = 'Objednávka byla úspěšně odeslána!';
    document.getElementById('contact-form').reset();
  } catch (error) {
    console.error('Ошибка при добавлении заказа в Firestore:', error);
    document.getElementById('response-message').textContent = 'Nepodařilo se odeslat objednávku.';
  }
});