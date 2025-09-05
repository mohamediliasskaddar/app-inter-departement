//models/Tableau
const mongoose = require('mongoose');

const tableauSchema = new mongoose.Schema({
    titre: { type: String, required: true },
    auteur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    departement: { type: String, required: true },
    colonnes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Colonne' }],
    lignes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ligne' }]
});

tableauSchema.index({ departement: 1 });
tableauSchema.index({ auteur: 1 });


module.exports = mongoose.model('Tableau', tableauSchema);

