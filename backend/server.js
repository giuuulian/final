const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let messages = [
  { id: 1, text: 'Bienvenue dans l\'API simple!' },
  { id: 2, text: 'Ceci est un second message' }
];
let counter = 3;

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

app.get('/api/messages', (req, res) => {
  res.json(messages);
});

app.get('/api/messages/:id', (req, res) => {
  const message = messages.find(m => m.id === parseInt(req.params.id));
  if (!message) return res.status(404).json({ error: 'Message non trouvé' });
  res.json(message);
});

app.post('/api/messages', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text requis' });
  
  const newMessage = { id: counter++, text };
  messages.push(newMessage);
  res.status(201).json(newMessage);
});

app.delete('/api/messages/:id', (req, res) => {
  const index = messages.findIndex(m => m.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Message non trouvé' });
  
  const deleted = messages.splice(index, 1);
  res.json(deleted[0]);
});

app.get('/', (req, res) => {
  res.json({ message: 'API simple - Utilisez /api/messages ou /health' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erreur serveur' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur actif sur http://0.0.0.0:${PORT}`);
  console.log(`Health check: http://0.0.0.0:${PORT}/health`);
});
