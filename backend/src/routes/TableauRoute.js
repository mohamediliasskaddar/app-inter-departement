const router = require('express').Router();
const auth = require('../middlewares/auth');
const tblCtrl = require('../controllers/TableauController');

router.get('/', auth, tblCtrl.list);             // ?departement=
router.get('/:id', auth, tblCtrl.get);
router.put('/:id', auth, tblCtrl.update);
router.post('/one-shot', auth, tblCtrl.createOneShot);   // create table with colonnes/lignes and valeurs in one shot
router.delete('/:id', auth, tblCtrl.deleteCascade);

module.exports = router;
