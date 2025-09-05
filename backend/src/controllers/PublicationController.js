// src/controllers/publicationController.js
const Publication = require('../models/Publication');
const Notification = require('../models/Notification');


exports.create = async (req, res, next) => {
  try {
    console.log('Publication data received:', req.body, req.file);

    const data = req.body;
    // Add user info if you want:
    data.auteur = req.user._id;
    data.departement = req.user.departement;

    // If you want to save file info:
    if (req.file) {
      data.image = req.file.path; // or store filename etc.
    }

    const pub = await Publication.create(data);

    res.status(201).json(pub);
  } catch (err) {
    console.error('Error creating publication:', err);
    next(err);
  }
};


exports.list = async (req, res) => {
  try {
    const filter = { deleted: false };
    if (req.query.departement) filter.departement = req.query.departement;
    if (req.query.type) filter.type = req.query.type;
    if (req.query.statut) filter.statut = req.query.statut;
    // paginate optionally
    const pubs = await Publication.find(filter)
      .populate('auteur', 'nom email role')
      // .populate('responsable', 'nom email');
    res.json(pubs);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.get = async (req, res) => {
  try {
    const pub = await Publication.findById(req.params.id)
      .populate('auteur', 'nom email role')
      // .populate('responsable', 'nom email');
      

    if (!pub || pub.deleted) return res.status(404).json({ message: "Publication introuvable" });
    res.json(pub);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const updated = await Publication.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.delete = async (req, res) => {
  try {
    const pub = await Publication.findByIdAndUpdate(req.params.id, { deleted: true }, { new: true });
    res.json(pub);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// To count publications
  // GET /api/publications/stats

exports.count =  async (req, res) => {
  try {
    const stats = await Publication.aggregate([
      { $match: { deleted: false } }, // optional: only count non-deleted
      {
        $group: {
          _id: '$type', // group by type
          count: { $sum: 1 }
        }
      }
    ]);

    // Convert aggregation result into an object like { type: count }
    const result = {
      reclamation: 0,
      demande: 0,
      incident: 0,
      audit: 0,
      information: 0,
      autre: 0
    };

    stats.forEach(item => {
      result[item._id] = item.count;
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};