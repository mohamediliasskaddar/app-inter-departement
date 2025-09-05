// server.js
require('dotenv').config(); // charge les variables d'env

const app = require('./src/app'); // importe l'application déjà configurée

const mongoose = require("mongoose");

// MONGO_URI=mongodb://localhost:27017/app_inter_departement

mongoose.connect("mongodb://localhost:27017/app_inter_departement", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connecté"))
.catch(err => console.error("❌ Erreur de connexion MongoDB:", err));


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
