const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  contenu: { type: String, required: true },
  auteur: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  departement: { type: String, required: true },
  dateDebut: { type: Date },
  dateFin: { type: Date },
  deleted: { type: Boolean, default: false },
  statut: { type: String, enum: ["à venir","en cours","terminée","programmée","tache", "programmée"], default: "programmée" }
}, { timestamps: true });


messageSchema.index({ departement: 1 });
messageSchema.index({ dateDebut: -1 });

messageSchema.index({ dateDebut: 1 });
module.exports = mongoose.model('Message', messageSchema);

