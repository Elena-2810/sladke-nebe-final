const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public2')));

const DATA_FILE = './data.json';


app.get('/api/data', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json(data);
});


const { db } = require('./public2/firebase'); // убедись, что у тебя есть этот файл
const { collection, addDoc } = require('firebase/firestore');

app.post('/api/data', async (req, res) => {
  try {
    const docRef = await addDoc(collection(db, 'orders'), req.body);
    res.status(201).json({ id: docRef.id });
  } catch (error) {
    console.error('Ошибка при добавлении в Firestore:', error);
    res.status(500).send('Ошибка сервера');
  }
});


app.put('/api/data/:id', (req, res) => {
  let data = JSON.parse(fs.readFileSync(DATA_FILE));
  const id = parseInt(req.params.id);
  data = data.map(item => item.id === id ? { ...item, ...req.body } : item);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data));
  res.json({ success: true });
});


app.delete('/api/data/:id', (req, res) => {
  let data = JSON.parse(fs.readFileSync(DATA_FILE));
  const id = parseInt(req.params.id);
  data = data.filter(item => item.id !== id);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data));
  res.json({ success: true });
});

app.use(express.static(path.join(__dirname, 'public2')));
app.use(express.static(path.join(__dirname, 'public')));

console.log("Starting server...");


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});