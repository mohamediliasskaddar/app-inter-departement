//models/Colone.js
const mongoose = require('mongoose');

const colonneSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    type: {
        type: String,
        enum: ["texte", "nombre", "date", "booleen"],
        required: true }
});

module.exports = mongoose.model('Colonne', colonneSchema);
