const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  destinataire: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ["nouvellePublication","tacheAssignée","message","info"], required: true },
  referenceId: { type: mongoose.Schema.Types.ObjectId }, // id de publication/message/tache...
  lu: { type: Boolean, default: false },
  dateEnvoi: { type: Date, default: Date.now }
}, { timestamps: true });


notificationSchema.index({ destinataire: 1, lu: 1, dateEnvoi: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
