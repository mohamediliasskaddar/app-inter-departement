// src/controllers/userController.js
const User = require('../models/User');
const Notification = require('../models/Notification');

exports.list = async (req, res) => {
  try {
    const q = {};
    if (req.query.departement) q.departement = req.query.departement;
    if (req.query.role) q.role = req.query.role;
    const users = await User.find(q).select('-password');
    res.json(users);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.get = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').populate('departement', 'nom');
    res.json(user);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const update = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json(update);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id).select('-password');
    res.json(deleted);
    //create a notification about deletion
    await Notification.create({
      destinataire: null,
      description: `Utilisateur supprimé: ${deleted.nom} (${deleted.email})`,
      type: "DelUser",
      referenceId: deleted._id
    });
  } catch (err) { res.status(500).json({ error: err.message }); } 
}

//to count the number of users
exports.count =  async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Get current user info
exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id; // `req.user` must be set by your auth middleware
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Update current user info
exports.updateMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const allowedFields = ['nom', 'email' ,'departement']; // restrict editable fields
    const updates = {};

    allowedFields.forEach(field => {
      if (req.body[field]) {
        updates[field] = req.body[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
