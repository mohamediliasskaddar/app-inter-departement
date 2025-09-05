// src/routes/users.js
const router = require('express').Router();
const userCtrl = require('../controllers/UserController');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

// New /me routes
router.get('/me', auth, userCtrl.getMe);
router.put('/me', auth, userCtrl.updateMe);

//list get update delete
router.get('/', auth, authorize(['Admin', 'cadre']), userCtrl.list);
router.get('/:id', auth, authorize('any'), userCtrl.get);
router.put('/:id', auth, authorize(['Admin','Cadre']), userCtrl.update);
router.delete('/:id', auth, authorize(['Admin', 'Cadre']), userCtrl.delete); 
router.get('/count/all', auth, authorize(['Admin', 'Cadre']), userCtrl.count);






module.exports = router;

