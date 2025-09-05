// src/middlewares/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token missing" });

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Optionnel : fetch user basic data
    const user = await User.findById(payload.id).select('-password');
    if (!user) return res.status(401).json({ message: "Utilisateur introuvable" });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide" });
  }
};
