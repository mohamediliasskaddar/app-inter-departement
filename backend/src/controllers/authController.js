// src/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Notification = require('../models/Notification');

exports.register = async (req, res) => {
  try {
    const { nom, email, password, departement } = req.body;
    if (!nom || !email || !password || !departement) return res.status(400).json({ message: "Champs manquants" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email déjà utilisé" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ nom, email, password: hash, departement });
    // Create a notification for new user registration
    await Notification.create({
      destinataire: null, // null = broadcast to all (handled in frontend or query logic)
      description: `Nouvel utilisateur inscrit: ${user.nom} (${user.email})`,
      type: " NewUser",
      referenceId: user._id
    });
    res.status(201).json({ id: user._id, nom: user.nom, email: user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Identifiants invalides" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Identifiants invalides" });

    const token = jwt.sign({ id: user._id, role: user.role, nom : user.nom, email: user.email, departement: user.departement  }, process.env.JWT_SECRET, { expiresIn: '12h' });
    res.json({ token, user: { id: user._id, nom: user.nom, role: user.role, departement: user.departement } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

