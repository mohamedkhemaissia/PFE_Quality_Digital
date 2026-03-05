require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads')); // Rend les fichiers accessibles via URL

// Connexion Cloud
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connecté à MongoDB Cloud ! ✅"))
  .catch(err => console.error("Erreur de connexion ❌", err));

// Configuration de Multer (Stockage des PDF)
const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, 'uploads/'); },
  filename: (req, file, cb) => { cb(null, Date.now() + '-' + file.originalname); }
});
const upload = multer({ storage: storage });

// Schéma de la base de données
const ProcedureSchema = new mongoose.Schema({
  titre: String,
  version: { type: String, default: '1.0' },
  statut: { type: String, default: 'Brouillon' },
  fichierUrl: String,
  dateCreation: { type: Date, default: Date.now }
});
const Procedure = mongoose.model('Procedure', ProcedureSchema);

// ROUTES
// 1. Ajouter une procédure avec un fichier
app.post('/procedures', upload.single('pdf'), async (req, res) => {
  try {
    const nouvelleProc = new Procedure({
      titre: req.body.titre,
      fichierUrl: req.file ? req.file.path : null
    });
    await nouvelleProc.save();
    res.status(201).send(nouvelleProc);
  } catch (e) {
    res.status(400).send(e);
  }
});

// 2. Récupérer la liste
app.get('/procedures', async (req, res) => {
  const procedures = await Procedure.find();
  res.send(procedures);
});

// 3. Mettre à jour le statut d'une procédure
app.put('/procedures/:id', async (req, res) => {
  try {
    const { statut } = req.body;
    const procedure = await Procedure.findByIdAndUpdate(req.params.id, { statut }, { new: true });
    res.send(procedure);
  } catch (e) {
    res.status(400).send(e);
  }
});

// 4. Supprimer une procédure
app.delete('/procedures/:id', async (req, res) => {
  try {
    await Procedure.findByIdAndDelete(req.params.id);
    res.send({ message: 'Procédure supprimée' });
  } catch (e) {
    res.status(400).send(e);
  }
});

// 5. Chatbot intelligent (Module 4)
app.post('/chat', async (req, res) => {
  const { message } = req.body;
  const procedures = await Procedure.find();
  const trouverDoc = procedures.find(p => message.toLowerCase().includes(p.titre.toLowerCase()));

  let reply = trouverDoc 
    ? `Oui, je trouve le document "${trouverDoc.titre}". Statut : ${trouverDoc.statut}.` 
    : "Je ne trouve pas de document correspondant à votre recherche.";
  
  res.json({ reply });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur sur le port ${PORT}`));