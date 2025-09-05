// src/controllers/notificationController.js
const Notification = require('../models/Notification');

// exports.listForUser = async (req, res) => {
//   try {
//     const notifs = await Notification.find({ destinataire: req.user._id }).sort({ dateEnvoi: -1 });
//     res.json(notifs);
//   } catch (err) { res.status(500).json({ error: err.message }); }
// };

exports.listForUser = async (req, res) => {
  try {
    const userId = req.user._id;

    // Count unread notifications
    // const unreadCount = await Notification.countDocuments({ destinataire: userId, lu: false });
    const unreadCount = await Notification.countDocuments();

    // Get latest notifications (e.g., top 5)
    const latestNotifs = await Notification.find()
    // const latestNotifs = await Notification.find({ destinataire: userId })
      .sort({ dateEnvoi: -1 })
      .limit(5); // You can change this number as needed

    res.json({
      count: unreadCount,
      notifications: latestNotifs
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.markRead = async (req, res) => {
  try {
    const notif = await Notification.findByIdAndUpdate(req.params.id, { lu: true }, { new: true });
    res.json(notif);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Optionnel : endpoint pour créer une notif (admin/system)
exports.create = async (req, res) => {
  try {
    const n = await Notification.create(req.body);
    res.status(201).json(n);
  } catch (err) { res.status(500).json({ error: err.message }); }
};
