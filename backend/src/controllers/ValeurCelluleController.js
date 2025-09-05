const ValeurCellule = require('../models/ValeurCellule');
const Ligne = require('../models/Ligne');
const mongoose = require('mongoose');
// const ValeurCellule = require('../models/ValeurCellule');
const Colonne = require('../models/Colonne');
const { serverSupportsTransactions } = require('../utils/mongoUtils');

exports.create = async (req, res) => {
  try {
    const { colonne, valeur, ligneId } = req.body;
    if (!colonne || typeof valeur === 'undefined' || !ligneId) return res.status(400).json({ message: 'colonne, valeur et ligneId requis' });

    const cell = await ValeurCellule.create({ colonne, valeur });

    // attacher la cellule à la ligne
    await Ligne.findByIdAndUpdate(ligneId, { $push: { valeurs: cell._id } });

    res.status(201).json(cell);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// const mongoose = require('mongoose');


exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const { valeur } = req.body;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Id cellule invalide' });

    const cell = await ValeurCellule.findById(id);
    if (!cell) return res.status(404).json({ message: 'Cellule introuvable' });

    const col = await Colonne.findById(cell.colonne).lean();
    if (!col) return res.status(404).json({ message: 'Colonne de la cellule introuvable' });

    // validate according to col.type
    if (col.type === 'nombre' && typeof valeur !== 'number') return res.status(400).json({ message: 'Valeur doit être un nombre' });
    if (col.type === 'texte' && typeof valeur !== 'string') return res.status(400).json({ message: 'Valeur doit être un texte' });
    if (col.type === 'booleen' && typeof valeur !== 'boolean') return res.status(400).json({ message: 'Valeur doit être booléenne' });
    if (col.type === 'date' && isNaN(new Date(valeur).getTime())) return res.status(400).json({ message: 'Valeur doit être une date valide' });

    cell.valeur = (col.type === 'date') ? new Date(valeur) : valeur;
    await cell.save();

    return res.json(cell);
  } catch (err) {
    console.error('cellule.update error', err);
    return res.status(500).json({ error: err.message });
  }
};


exports.delete = async (req, res) => {
  try {
    const cellId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(cellId)) return res.status(400).json({ message: 'Id invalide' });

    // retirer de la ligne
    await Ligne.updateMany({ valeurs: cellId }, { $pull: { valeurs: cellId } });
    await ValeurCellule.findByIdAndDelete(cellId);

    res.json({ message: 'Cellule supprimée' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
