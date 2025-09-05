const router = require('express').Router();
const auth = require('../middlewares/auth');
const ligneCtrl = require('../controllers/LigneController');


router.post('/', auth, ligneCtrl.create);       // body: { tableauId, valeurs? }
router.get('/:id', auth, ligneCtrl.get);
router.put('/:id', auth, ligneCtrl.update);
router.delete('/:id', auth, ligneCtrl.delete);

// PUT /api/lignes/:id
// router.put('/:id', auth, ligneCtrl.update); // remplace complètement la ligne (ou ses valeurs)


module.exports = router;
