const Ligne = require('../models/Ligne');
const Tableau = require('../models/Tableau');
const ValeurCellule = require('../models/ValeurCellule');
const mongoose = require('mongoose');
const { serverSupportsTransactions } = require('../utils/mongoUtils');
const Colonne = require('../models/Colonne');

exports.create = async (req, res) => {
  try {
    const { tableauId, valeurs } = req.body;
    if (!tableauId) return res.status(400).json({ message: 'tableauId requis' });

    // Créer ligne vide puis éventuellement créer les cellules et les lier
    const ligne = await Ligne.create({ valeurs: [] });

    if (Array.isArray(valeurs) && valeurs.length) {
      // valeurs: [{ colonne: colId, valeur: any }, ...]
      const createdCells = await Promise.all(valeurs.map(v => ValeurCellule.create({ colonne: v.colonne, valeur: v.valeur })));
      const cellIds = createdCells.map(c => c._id);
      ligne.valeurs = cellIds;
      await ligne.save();
    }

    // attacher la ligne au tableau
    await Tableau.findByIdAndUpdate(tableauId, { $push: { lignes: ligne._id } });

    res.status(201).json(await Ligne.findById(ligne._id).populate({ path: 'valeurs', populate: { path: 'colonne' } }));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.get = async (req, res) => {
  try {
    const ligne = await Ligne.findById(req.params.id).populate({ path: 'valeurs', populate: { path: 'colonne' } });
    if (!ligne) return res.status(404).json({ message: 'Ligne introuvable' });
    res.json(ligne);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.update = async (req, res) => {
  const supportsTx = await serverSupportsTransactions();
  let session;
  if (supportsTx) { session = await mongoose.startSession(); session.startTransaction(); }

  try {
    const ligneId = req.params.id;
    const { valeurs } = req.body; // expected: [{ colonne: colId, valeur: ... }, ...]
    if (!mongoose.isValidObjectId(ligneId)) return res.status(400).json({ message: 'Id ligne invalide' });
    if (!Array.isArray(valeurs)) return res.status(400).json({ message: 'valeurs attendu en tableau' });

    const ligne = await Ligne.findById(ligneId);
    if (!ligne) return res.status(404).json({ message: 'Ligne introuvable' });

    // 1) supprimer anciennes cellules
    const oldCellIds = ligne.valeurs || [];
    if (oldCellIds.length) {
      if (supportsTx) {
        await ValeurCellule.deleteMany({ _id: { $in: oldCellIds } }).session(session);
      } else {
        await ValeurCellule.deleteMany({ _id: { $in: oldCellIds } });
      }
    }

    // 2) créer nouvelles cellules
    // Validate each column exists and type good (optional)
    const colIds = valeurs.map(v => v.colonne);
    const cols = await Colonne.find({ _id: { $in: colIds } }).lean();
    const colMap = {}; cols.forEach(c => colMap[c._id.toString()] = c);

    const newCellsDocs = valeurs.map(v => {
      const col = colMap[v.colonne];
      if (!col) throw new Error(`Colonne introuvable: ${v.colonne}`);
      // optional: validate type here...
      return { colonne: v.colonne, valeur: (col.type === 'date') ? new Date(v.valeur) : v.valeur };
    });

    const createdCells = supportsTx
      ? await ValeurCellule.insertMany(newCellsDocs, { session })
      : await ValeurCellule.insertMany(newCellsDocs);

    const newCellIds = createdCells.map(c => c._id);

    // 3) mettre à jour la ligne avec les nouveaux ids
    ligne.valeurs = newCellIds;
    await ligne.save({ session });

    if (supportsTx) { await session.commitTransaction(); session.endSession(); }

    const updated = await Ligne.findById(ligneId).populate({ path: 'valeurs', populate: { path: 'colonne' } });
    return res.json(updated);

  } catch (err) {
    if (session) { try { await session.abortTransaction(); session.endSession(); } catch(_){} }
    console.error('ligne.update error', err);
    return res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const ligneId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(ligneId)) return res.status(400).json({ message: 'Id invalide' });

    // trouver et supprimer cellules
    const ligne = await Ligne.findById(ligneId);
    if (!ligne) return res.status(404).json({ message: 'Ligne introuvable' });
    const cellIds = ligne.valeurs || [];
    await ValeurCellule.deleteMany({ _id: { $in: cellIds } });

    // retirer la ligne des tableaux
    await Tableau.updateMany({ lignes: ligneId }, { $pull: { lignes: ligneId } });

    // supprimer la ligne
    await Ligne.findByIdAndDelete(ligneId);

    res.json({ message: 'Ligne supprimée (et cellules associées supprimées)' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
