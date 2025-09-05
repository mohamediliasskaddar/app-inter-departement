const mongoose = require('mongoose');

const publicationSchema = new mongoose.Schema({
    titre: { type: String, required: true },
    description: { type: String, required: true },
    type: {
        type: String,
        enum: ["reclamation", "demande", "incident", "audit", "information", "autre"],
        required: true
    },
    auteur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    departement: { type: String, required: true },
    image: { type: String },
    dateDebut: { type: Date },
    dateFin: { type: Date },
    deleted: { type: Boolean, default: false },
    statut: {
        type: String,
        enum: ["ouverte", "en cours", "traitée"],
        default: "ouverte"
    }
});

publicationSchema.index({ type: 1 });
publicationSchema.index({ departement: 1 });
publicationSchema.index({ statut: 1 });
publicationSchema.index({ titre: 'text', description: 'text' }); // recherche full-text



module.exports = mongoose.model('Publication', publicationSchema);

