const router = require('express').Router();
const auth = require('../middlewares/auth');
const cellCtrl = require('../controllers/ValeurCelluleController');

router.post('/', auth, cellCtrl.create);       // body: { colonne, valeur, ligneId }
router.put('/:id', auth, cellCtrl.update);
router.delete('/:id', auth, cellCtrl.delete);

module.exports = router;
