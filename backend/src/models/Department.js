const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  nom: { type: String, required: true, unique: true },
  description: String,
  dateCreation: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Department', DepartmentSchema);
