const mongoose = require('mongoose');

const ProcedureSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true
  },
  description: String,
  domaine: {
    type: String,
    default: 'Qualité'
  },
  version: {
    type: String,
    default: '1.0'
  },
  statut: {
    type: String,
    enum: ['Brouillon', 'En validation', 'Validé', 'Archivé'],
    default: 'Brouillon'
  },
  fichierUrl: String,
  dateCreation: {
    type: Date,
    default: Date.now
  },
  dateModification: Date,
  dateValidation: Date,
  auteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  validateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  commentairesValidation: String,
  versionsAntérieures: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProcedureVersion'
  }],
  historique: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProcedureHistory'
  }],
  tags: [String]
});

module.exports = mongoose.model('Procedure', ProcedureSchema);
