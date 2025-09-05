// src/routes/notifications.js
const router = require('express').Router();
const notifCtrl = require('../controllers/NotificationController');
const auth = require('../middlewares/auth');

router.get('/', auth, notifCtrl.listForUser);
router.put('/:id/read', auth, notifCtrl.markRead);
router.post('/', auth, notifCtrl.create); // optional system/admin route

module.exports = router;
