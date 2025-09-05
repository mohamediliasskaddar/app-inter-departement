// src/routes/auth.js
const router = require('express').Router();
const authCtrl = require('../controllers/authController');

router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);

module.exports = router;
