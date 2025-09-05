const Colonne = require('../models/Colonne');
const Tableau = require('../models/Tableau');
const ValeurCellule = require('../models/ValeurCellule.js');
const mongoose = require('mongoose');
const { serverSupportsTransactions } = require('../utils/mongoUtils');

exports.create = async (req, res) => {
  try {
    const { nom, type, tableauId } = req.body;
    if (!nom || !type) return res.status(400).json({ message: 'nom et type requis' });

    const col = await Colonne.create({ nom, type });

    // si on fournit tableauId -> attacher la colonne au tableau
    if (tableauId && mongoose.Types.ObjectId.isValid(tableauId)) {
      await Tableau.findByIdAndUpdate(tableauId, { $push: { colonnes: col._id } });
    }

    res.status(201).json(col);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    // possibilité de lister toutes les colonnes ou celles d'un tableau en donnant tableauId
    const { tableauId } = req.query;
    if (tableauId) {
      const t = await Tableau.findById(tableauId).populate('colonnes');
      return res.json(t ? t.colonnes : []);
    }
    const cols = await Colonne.find();
    res.json(cols);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const colId = req.params.id;
    const { nom, type } = req.body;
    if (!mongoose.isValidObjectId(colId)) return res.status(400).json({ message: 'Id colonne invalide' });

    const col = await Colonne.findById(colId);
    if (!col) return res.status(404).json({ message: 'Colonne introuvable' });

    // if type is changed, validate existing cellule values compatibility
    if (type && type !== col.type) {
      const invalidCell = await ValeurCellule.findOne({ colonne: colId }).lean();
      if (invalidCell) {
        // Option : check all cells and if any not convertible -> reject
        const cells = await ValeurCellule.find({ colonne: colId }).lean();
        const bad = cells.some(c => {
          if (type === 'nombre') return typeof c.valeur !== 'number';
          if (type === 'texte') return typeof c.valeur !== 'string';
          if (type === 'booleen') return typeof c.valeur !== 'boolean';
          if (type === 'date') return isNaN(new Date(c.valeur).getTime());
          return false;
        });
        if (bad) return res.status(400).json({ message: 'Des cellules existent et ne sont pas compatibles avec le nouveau type' });
      }
    }

    // apply updates
    if (nom) col.nom = nom;
    if (type) col.type = type;
    await col.save();

    return res.json(col);
  } catch (err) {
    console.error('colonne.update error', err);
    return res.status(500).json({ error: err.message });
  }
};
exports.delete = async (req, res) => {
  try {
    const colId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(colId)) return res.status(400).json({ message: 'Id invalide' });

    // trouver toutes les cellules liées à cette colonne
    const cells = await ValeurCellule.find({ colonne: colId });
    const cellIds = cells.map(c => c._id);

    // retirer ces cellules des lignes
    const Ligne = require('../models/Ligne');
    await Ligne.updateMany({ valeurs: { $in: cellIds } }, { $pull: { valeurs: { $in: cellIds } } });

    // supprimer les cellules
    await ValeurCellule.deleteMany({ _id: { $in: cellIds } });

    // retirer la colonne des tableaux qui la référencent
    await Tableau.updateMany({ colonnes: colId }, { $pull: { colonnes: colId } });

    // supprimer la colonne
    await Colonne.findByIdAndDelete(colId);

    res.json({ message: 'Colonne supprimée (et cellules associées nettoyées)' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
