const mongoose = require('mongoose');

const ProcedureVersionSchema = new mongoose.Schema({
  procedure: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Procedure',
    required: true
  },
  version: String,
  fichierUrl: String,
  dateCreation: {
    type: Date,
    default: Date.now
  },
  auteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: String
});

module.exports = mongoose.model('ProcedureVersion', ProcedureVersionSchema);
