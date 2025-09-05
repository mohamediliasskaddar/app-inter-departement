// src/controllers/tableauController.js
// safeCreateOneShot.js (controller)
// src/controllers/tableauController.js (corrigé)
const mongoose = require('mongoose');
const Tableau = require('../models/Tableau');
const Colonne = require('../models/Colonne');
const Ligne = require('../models/Ligne');
const ValeurCellule = require('../models/ValeurCellule');
const { serverSupportsTransactions } = require('../utils/mongoUtils');

function validateValueType(type, value) {
  if (type === 'nombre') return typeof value === 'number';
  if (type === 'texte') return typeof value === 'string';
  if (type === 'booleen') return typeof value === 'boolean';
  if (type === 'date') return !isNaN(new Date(value).getTime());
  return true;
}

// async function serverSupportsTransactions() {
//   try {
//     const admin = mongoose.connection.db.admin();
//     const info = await admin.command({ ismaster: 1 });
//     return !!info.setName;
//   } catch (err) {
//     return false;
//   }
// }

exports.createOneShot = async (req, res) => {
  const supportsTransactions = await serverSupportsTransactions();

  let session;
  if (supportsTransactions) {
    session = await mongoose.startSession();
    session.startTransaction();
  }

  // lists to rollback if no transactions available
  const createdColIds = [];
  const createdCellIds = [];
  const createdLineIds = [];
  let createdTableauId = null;

  try {
    const { titre, typeGraph = 'table', colonnes = [], lignes = [] } = req.body;
    if (!titre) return res.status(400).json({ message: 'titre requis' });

    const auteur = req.user._id;
    const departement = req.user.departement;

    // build ordered column placeholders
    const colsToInsert = [];
    const colOrder = []; // will contain ObjectId instances (or strings validated then converted)
    for (const c of colonnes) {
      if (!c) continue;
      if (typeof c === 'string' && mongoose.isValidObjectId(c)) {
        colOrder.push(new mongoose.Types.ObjectId(c));
      } else if (typeof c === 'object' && c.nom && c.type) {
        colsToInsert.push({ nom: c.nom, type: c.type });
        colOrder.push(null); // placeholder to fill with created id later
      } else {
        return res.status(400).json({ message: 'colonnes must be objects {nom,type} or existing _id strings' });
      }
    }

    // insert new columns in bulk
    let createdCols = [];
    if (colsToInsert.length) {
      createdCols = supportsTransactions
        ? await Colonne.insertMany(colsToInsert, { session })
        : await Colonne.insertMany(colsToInsert);
      for (const c of createdCols) createdColIds.push(c._id);
    }

    // fill placeholders in colOrder with created ids (maintain order)
    let createdIdx = 0;
    for (let i = 0; i < colOrder.length; i++) {
      if (colOrder[i] === null) {
        colOrder[i] = createdCols[createdIdx]._id;
        createdIdx++;
      }
    }

    // fetch column documents for validation
    const uniqueColIds = Array.from(new Set(colOrder.map(id => id.toString())))
      .map(s => new mongoose.Types.ObjectId(s));
    const colDocs = await Colonne.find({ _id: { $in: uniqueColIds } }).lean();
    const colDocMap = {};
    for (const cd of colDocs) colDocMap[cd._id.toString()] = cd;

    // prepare all cell docs in bulk and per-line counts
    const allCellDocs = [];
    const perLineCounts = [];
    for (const l of lignes) {
      const vals = Array.isArray(l.valeurs) ? l.valeurs : [];
      for (const v of vals) {
        if (typeof v.colIndex !== 'number') {
          return res.status(400).json({ message: 'Chaque valeur doit contenir colIndex (number) et valeur' });
        }
        const colIndex = v.colIndex;
        if (colIndex < 0 || colIndex >= colOrder.length) {
          return res.status(400).json({ message: `colIndex hors limites: ${colIndex}` });
        }
        const colId = colOrder[colIndex];
        const colDoc = colDocMap[colId.toString()];
        if (!colDoc) return res.status(404).json({ message: `Colonne introuvable: ${colId}` });
        if (!validateValueType(colDoc.type, v.valeur)) {
          return res.status(400).json({ message: `Type invalide pour la colonne "${colDoc.nom}" (attendu ${colDoc.type})` });
        }
        allCellDocs.push({ colonne: colId, valeur: (colDoc.type === 'date') ? new Date(v.valeur) : v.valeur });
      }
      perLineCounts.push(vals.length);
    }

    // insert all cells
    let createdCells = [];
    if (allCellDocs.length) {
      createdCells = supportsTransactions
        ? await ValeurCellule.insertMany(allCellDocs, { session })
        : await ValeurCellule.insertMany(allCellDocs);
      for (const c of createdCells) createdCellIds.push(c._id);
    }

    // create lines using createdCells slices
    let cursor = 0;
    for (const cnt of perLineCounts) {
      const slice = createdCells.slice(cursor, cursor + cnt);
      const ids = slice.map(s => s._id);
      let newLine;
      if (supportsTransactions) {
        const docs = await Ligne.create([{ valeurs: ids }], { session });
        newLine = docs[0];
      } else {
        newLine = await Ligne.create({ valeurs: ids });
      }
      createdLineIds.push(newLine._id);
      cursor += cnt;
    }

    // create tableau
    const tableauDoc = {
      titre, auteur, departement, typeGraph,
      colonnes: colOrder,
      lignes: createdLineIds
    };

    let createdTableau;
    if (supportsTransactions) {
      const docs = await Tableau.create([tableauDoc], { session });
      createdTableau = docs[0];
      await session.commitTransaction();
      session.endSession();
    } else {
      createdTableau = await Tableau.create(tableauDoc);
    }
    createdTableauId = createdTableau._id;

    // populate and return
    const result = await Tableau.findById(createdTableauId)
      .populate('colonnes')
      .populate({ path: 'lignes', populate: { path: 'valeurs', populate: { path: 'colonne' } } });

    return res.status(201).json(result);

  } catch (err) {
    // rollback cleanup if no transaction support
    try {
      if (!supportsTransactions) {
        if (createdTableauId) await Tableau.findByIdAndDelete(createdTableauId);
        if (createdLineIds.length) await Ligne.deleteMany({ _id: { $in: createdLineIds } });
        if (createdCellIds.length) await ValeurCellule.deleteMany({ _id: { $in: createdCellIds } });
        if (createdColIds.length) await Colonne.deleteMany({ _id: { $in: createdColIds } });
      } else {
        try { await session.abortTransaction(); session.endSession(); } catch (_) {}
      }
    } catch (cleanupErr) {
      console.error('Rollback cleanup error:', cleanupErr);
    }

    console.error('createOneShot error:', err);
    return res.status(500).json({ error: err.message });
  }
};


//deleteCascade (controller)
exports.deleteCascade = async (req, res) => {
  const supportsTx = await serverSupportsTransactions();
  let session;
  if (supportsTx) {
    session = await mongoose.startSession();
    session.startTransaction();
  }

  try {
    const tableId = req.params.id;
    if (!mongoose.isValidObjectId(tableId)) return res.status(400).json({ message: 'Id tableau invalide' });

    const table = await Tableau.findById(tableId).lean();
    if (!table) return res.status(404).json({ message: 'Tableau introuvable' });

    const colonnesIds = (table.colonnes || []).map(String);
    const lignesIds = (table.lignes || []).map(String);

    // 1) supprimer cellules associées aux lignes
    if (lignesIds.length) {
      // récupérer toutes les cellules liées
      const lignes = await Ligne.find({ _id: { $in: lignesIds } }).select('valeurs').lean();
      const cellIds = lignes.flatMap(l => (l.valeurs || []).map(String));
      if (cellIds.length) {
        if (supportsTx) {
          await ValeurCellule.deleteMany({ _id: { $in: cellIds } }).session(session);
        } else {
          await ValeurCellule.deleteMany({ _id: { $in: cellIds } });
        }
      }
    }

    // 2) supprimer les lignes
    if (lignesIds.length) {
      if (supportsTx) {
        await Ligne.deleteMany({ _id: { $in: lignesIds } }).session(session);
      } else {
        await Ligne.deleteMany({ _id: { $in: lignesIds } });
      }
    }

    // 3) supprimer les colonnes
    if (colonnesIds.length) {
      if (supportsTx) {
        await Colonne.deleteMany({ _id: { $in: colonnesIds } }).session(session);
      } else {
        await Colonne.deleteMany({ _id: { $in: colonnesIds } });
      }
    }

    // 4) supprimer le tableau
    if (supportsTx) {
      await Tableau.findByIdAndDelete(tableId).session(session);
      await session.commitTransaction();
      session.endSession();
    } else {
      await Tableau.findByIdAndDelete(tableId);
    }

    return res.json({ message: 'Tableau et données associées supprimés' });

  } catch (err) {
    if (session) {
      try { await session.abortTransaction(); session.endSession(); } catch (_) {}
    }
    console.error('deleteCascade error', err);
    return res.status(500).json({ error: err.message });
  }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.create = async (req, res) => {
  try {
    const { titre, typeGraph, colonnes = [], lignes = [] } = req.body;
    const auteur = req.user._id;
    const departement = req.user.departement;

    // créer colonnes si fournies (array d'objets {nom,type}) et récupérer leurs ids
    const createdCols = [];
    for (const c of colonnes) {
      const col = await Colonne.create({ nom: c.nom, type: c.type });
      createdCols.push(col._id);
    }

    // créer lignes (non-natives) : ici on crée lignes vides; si tu veux initialiser valeurs -> envoyer structure
    const createdLines = [];
    for (const l of lignes) {
      // chaque l peut contenir valeurs comme [{colonne: colId, valeur: ...}, ...]
      const newLine = await Ligne.create({ valeurs: [] });
      if (Array.isArray(l.valeurs) && l.valeurs.length) {
        const cells = await Promise.all(l.valeurs.map(v => ValeurCellule.create({ colonne: v.colonne, valeur: v.valeur })));
        newLine.valeurs = cells.map(c => c._id);
        await newLine.save();
      }
      createdLines.push(newLine._id);
    }

    const table = await Tableau.create({
      titre,
      auteur,
      departement,
      typeGraph,
      colonnes: createdCols,
      lignes: createdLines
    });

    res.status(201).json(await Tableau.findById(table._id)
      .populate({ path: 'colonnes' })
      .populate({ path: 'lignes', populate: { path: 'valeurs', populate: { path: 'colonne' } } }));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.list = async (req, res) => {
  try {
    const filter = {};
    if (req.query.departement) filter.departement = req.query.departement;
    const tables = await Tableau.find(filter).populate('auteur', 'nom').select('-__v');
    res.json(tables);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.get = async (req, res) => {
  try {
    const t = await Tableau.findById(req.params.id)
      .populate('auteur', 'nom email')
      .populate('colonnes')
      .populate({ path: 'lignes', populate: { path: 'valeurs', populate: { path: 'colonne' } } });
    if (!t) return res.status(404).json({ message: 'Tableau introuvable' });
    res.json(t);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.update = async (req, res) => {
  try {
    // Mise à jour simple : titre, typeGraph. Pour colonnes/lignes on utilise endpoints dédiés.
    const allowed = {};
    if (req.body.titre) allowed.titre = req.body.titre;
    if (req.body.typeGraph) allowed.typeGraph = req.body.typeGraph;

    const updated = await Tableau.findByIdAndUpdate(req.params.id, allowed, { new: true });
    res.json(updated);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Id invalide' });

    const table = await Tableau.findById(id);
    if (!table) return res.status(404).json({ message: 'Tableau introuvable' });

    // supprimer cascade : cellules -> lignes -> colonnes -> tableau
    // 1) supprimer cellules des lignes
    const lignesIds = table.lignes || [];
    for (const ligneId of lignesIds) {
      const ligne = await Ligne.findById(ligneId);
      if (ligne && ligne.valeurs && ligne.valeurs.length) {
        await ValeurCellule.deleteMany({ _id: { $in: ligne.valeurs } });
      }
    }
    // 2) supprimer lignes
    await Ligne.deleteMany({ _id: { $in: lignesIds } });

    // 3) supprimer colonnes
    if (table.colonnes && table.colonnes.length) {
      await Colonne.deleteMany({ _id: { $in: table.colonnes } });
    }

    // 4) supprimer le tableau
    await Tableau.findByIdAndDelete(id);

    res.json({ message: 'Tableau et données associées supprimés' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
