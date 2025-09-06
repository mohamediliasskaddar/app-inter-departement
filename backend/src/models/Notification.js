const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  destinataire: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // null for system-wide
  description: { type: String, required: true },
  type: { type: String, enum: ["NewPub","NewMsg","NewTab"," NewUser","DelUser", "DelPub", "DelMsg", "DelTab"], required: true },
  referenceId: { type: mongoose.Schema.Types.ObjectId }, //optional reference to related entity
  lu: { type: Boolean, default: false },
  dateEnvoi: { type: Date, default: Date.now }
}, { timestamps: true });


notificationSchema.index({ destinataire: 1, lu: 1, dateEnvoi: -1 });
module.exports = mongoose.model('Notification', notificationSchema);
