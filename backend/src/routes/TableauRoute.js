const router = require('express').Router();
const auth = require('../middlewares/auth');
const tblCtrl = require('../controllers/TableauController');

router.post('/', auth, tblCtrl.create);          // create table with colonnes/lignes optional
router.get('/', auth, tblCtrl.list);             // ?departement=
router.get('/:id', auth, tblCtrl.get);
router.put('/:id', auth, tblCtrl.update);
router.delete('/:id', auth, tblCtrl.delete);
router.post('/one-shot', auth, tblCtrl.createOneShot);   // create table with colonnes/lignes and valeurs in one shot

// DELETE /api/tableaux/:id
router.delete('/:id', auth, tblCtrl.deleteCascade);

module.exports = router;
