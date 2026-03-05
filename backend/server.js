require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connecté à MongoDB Cloud!"))
  .catch(err => console.error("❌ Erreur de connexion MongoDB", err));

// Routes
const authRoutes = require('./src/routes/authRoutes');
const procedureRoutes = require('./src/routes/procedureRoutes');
const { verifyToken } = require('./src/middleware/auth');

app.use('/api/auth', authRoutes);
app.use('/api/procedures', verifyToken, procedureRoutes);

// Route de test
app.get('/', (req, res) => res.json({ message: 'API SMQ Digital active! ✅' }));

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Serveur sur le port ${PORT}`));
