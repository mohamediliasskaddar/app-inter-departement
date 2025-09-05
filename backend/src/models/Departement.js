const mongoose = require('mongoose');

const departementSchema = new mongoose.Schema({
    nom: { type: String, required: true }
    
});

module.exports = mongoose.model('Departement', departementSchema);

