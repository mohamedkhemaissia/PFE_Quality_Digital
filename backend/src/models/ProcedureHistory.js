const mongoose = require('mongoose');

const ProcedureHistorySchema = new mongoose.Schema({
  procedure: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Procedure',
    required: true
  },
  action: {
    type: String,
    enum: ['Créé', 'Modifié', 'Validé', 'Archivé', 'Restauré'],
    required: true
  },
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  details: String,
  dateAction: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ProcedureHistory', ProcedureHistorySchema);
