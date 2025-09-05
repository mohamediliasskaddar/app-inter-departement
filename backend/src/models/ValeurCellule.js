//models/valeurCellule
const mongoose = require('mongoose');

const valeurCelluleSchema = new mongoose.Schema({
    colonne: { type: mongoose.Schema.Types.ObjectId, ref: 'Colonne', required: true },
    valeur: {} // peut contenir texte, nombre, date ou booleen
});

module.exports = mongoose.model('ValeurCellule', valeurCelluleSchema);


