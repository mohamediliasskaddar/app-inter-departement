
// src/app.js (extrait)
const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });
const pubCtrl = require('./controllers/PublicationController');

require('dotenv').config();

app.use(cors());
app.use(express.json());

// import routes
app.use('/api/auth', require('./routes/authRoute.js'));
app.use('/api/users', require('./routes/UserRoute'));
app.use('/api/publications', require('./routes/PublicationRoute'));
app.use('/uploads', express.static('public/uploads'));
app.use('/api/messages', require('./routes/MessageRoute'));
app.use('/api/notifications', require('./routes/NotificationRoute.js'));
app.use('/api/colonnes', require('./routes/ColonneRoute.js'));
app.use('/api/lignes', require('./routes/LigneRoute'));
app.use('/api/valeurs', require('./routes/ValeurCelluleRoute.js'));
app.use('/api/tableaux', require('./routes/tableauRoute'));


// ✅ Global error handler — MUST be the last middleware
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err.stack || err);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;

