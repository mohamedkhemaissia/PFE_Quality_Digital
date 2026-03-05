require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Vérifier les variables d'environnement requises au démarrage
const required_vars = ['MONGO_URI', 'JWT_SECRET'];
const missing_vars = required_vars.filter(v => !process.env[v]);
if (missing_vars.length > 0) {
  console.error('\n🚨 ERREUR: Variables d\'environnement manquantes:');
  missing_vars.forEach(v => console.error(`  - ${v}`));
  console.error('\nVérifiez votre fichier .env ou définissez ces variables.\n');
  process.exit(1);
}

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// Connexion MongoDB
const { MONGO_URI } = process.env;
if (!MONGO_URI) {
  console.error('🚨 La variable d\'environnement MONGO_URI est manquante.');
  process.exit(1);
}
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Connecté à MongoDB Cloud!"))
  .catch(err => {
    console.error("❌ Erreur de connexion MongoDB", err);
    process.exit(1);
  });

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
