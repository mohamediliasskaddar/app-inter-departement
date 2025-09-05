//models/Ligne
const mongoose = require('mongoose');

const ligneSchema = new mongoose.Schema({
    valeurs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ValeurCellule' }]
});

module.exports = mongoose.model('Ligne', ligneSchema);
