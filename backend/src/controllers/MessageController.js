// src/controllers/messageController.js
const Message = require('../models/Message');


exports.create = async (req, res) => {
  try {
    const data = req.body;
    data.auteur = req.user._id;
    // if you want message always for the user's department:
    data.departement = data.departement || req.user.departement;
    const msg = await Message.create(data);
    res.status(201).json(msg);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.list = async (req, res) => {
  try {
    const filter = { deleted: false };
    if (req.query.departement) filter.departement = req.query.departement;
    const list = await Message.find(filter).populate('auteur', 'nom email').sort({ dateDebut: -1 });
    res.json(list);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(msg);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.delete = async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, { deleted: true }, { new: true });
    res.json(msg);
  } catch (err) { res.status(500).json({ error: err.message }); }
};
  

// récupérer un message par son ID
exports.get = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id)
            .populate('auteur', 'nom email role')

        if (!message) {
            return res.status(404).json({ message: "Message non trouvé" });
        }

        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};
