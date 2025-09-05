const router = require('express').Router();
const auth = require('../middlewares/auth');
const colCtrl = require('../controllers/ColonneController');

router.post('/', auth, colCtrl.create);        // body: { nom, type, tableauId? }
router.get('/', auth, colCtrl.list);           // optional query tableauId
router.put('/:id', auth, colCtrl.update);
router.delete('/:id', auth, colCtrl.delete);

module.exports = router;
