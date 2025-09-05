// src/routes/messages.js
const router = require('express').Router();
const msgCtrl = require('../controllers/MessageController');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

router.post('/', auth, msgCtrl.create);
router.get('/', auth, msgCtrl.list);
router.get('/:id', auth, msgCtrl.get); 
router.put('/:id', auth, authorize(['Cadre','Admin']), msgCtrl.update);
router.delete('/:id', auth, authorize(['Cadre','Admin']), msgCtrl.delete);

module.exports = router;
