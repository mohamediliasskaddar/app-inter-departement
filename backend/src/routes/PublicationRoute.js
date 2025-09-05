// // src/routes/publications.js
// const router = require('express').Router();
// const pubCtrl = require('../controllers/PublicationController');
// const auth = require('../middlewares/auth');
// const authorize = require('../middlewares/authorize');
// const multer = require('multer');
// const upload = multer({ dest: 'public/uploads/' });


// // Multer storage config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/uploads/');
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const name = file.fieldname + '-' + Date.now() + ext;
//     cb(null, name);
//   }
// });

// const upload1 = multer({ storage: storage });


// router.post('/', auth, upload.single('image'), pubCtrl.create);
// router.post('/', auth, pubCtrl.create);
// router.get('/', auth, pubCtrl.list);
// router.get('/:id', auth, pubCtrl.get);
// router.put('/:id', auth, authorize(['Cadre','Admin']), pubCtrl.update); 
// router.delete('/:id', auth, authorize(['Cadre','Admin']), pubCtrl.delete);
// router.get('/count/pubsType', auth, authorize(['Admin', 'Cadre']), pubCtrl.count);
// module.exports = router;

const router = require('express').Router();
const path = require('path');
const pubCtrl = require('../controllers/PublicationController');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const multer = require('multer');

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = file.fieldname + '-' + Date.now() + ext;
    cb(null, name);
  }
});

const upload = multer({ storage: storage });

// Routes
router.post('/', auth, upload.single('image'), pubCtrl.create);
router.get('/', auth, pubCtrl.list);
router.get('/:id', auth, pubCtrl.get);
router.put('/:id', auth, authorize(['Cadre','Admin']), pubCtrl.update); 
router.delete('/:id', auth, authorize(['Cadre','Admin']), pubCtrl.delete);
router.get('/count/pubsType', auth, authorize(['Admin', 'Cadre']), pubCtrl.count);

module.exports = router;
