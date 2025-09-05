const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["Cadre", "Operateur", "Admin", "En attente"],
        default: "En attente"
    },
    // departement: { type: mongoose.Schema.Types.ObjectId, ref: 'Departement', required: true }
  departement: { type: String, required: true },

});

userSchema.index({ email: 1 });       // pour recherche par email/login
userSchema.index({ departement: 1 }); // pour lister users par département
userSchema.index({ role: 1 });        // filtrage par rôle


module.exports = mongoose.model('User', userSchema);


