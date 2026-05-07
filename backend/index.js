const express = require("express");
const cors = require("cors");
const database = require("./src/database/db.config");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const path = require('path');
const fs = require('fs');
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Connexion MongoDB
database.mongoose.connect(database.url, {})
  .then(() => {
    console.log("✅ Connecté à MongoDB avec succès!");
    seedData(); // Insérer données de démo si vide
  })
  .catch(err => {
    console.error("❌ Erreur de connexion MongoDB:", err);
    process.exit();
  });

// Route de test
app.get("/", (req, res) => {
  res.send({ message: "🍽️ API Restaurant opérationnelle!", version: "1.0.0" });
});

// Charger les routes
require("./src/api/routes/routes")(app);

// Démarrage serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});

// ===== SEED : insérer des données de démonstration =====
async function seedData() {
  try {
    const Categorie = database.categories;
    const Plat = database.plats;

    const count = await Categorie.countDocuments();
    if (count > 0) return; // Déjà des données

    console.log("📦 Insertion des données de démonstration...");

    const cats = await Categorie.insertMany([
      { nom: "Entrées", description: "Soupes, salades, amuse-bouches", icone: "🥗" },
      { nom: "Plats principaux", description: "Viandes, poissons, pâtes", icone: "🍖" },
      { nom: "Desserts", description: "Gâteaux, crèmes, fruits", icone: "🍰" },
      { nom: "Boissons", description: "Eau, jus, sodas", icone: "🥤" }
    ]);

    await Plat.insertMany([
      { nom: "Salade César", description: "Laitue, parmesan, croûtons, sauce césar", prix: 8.5, categorie: cats[0]._id },
      { nom: "Soupe à l'oignon", description: "Soupe gratinée traditionnelle", prix: 6.0, categorie: cats[0]._id },
      { nom: "Entrecôte grillée", description: "300g, pommes de terre sautées", prix: 22.0, categorie: cats[1]._id },
      { nom: "Saumon rôti", description: "Filet de saumon, légumes de saison", prix: 18.5, categorie: cats[1]._id },
      { nom: "Pasta Carbonara", description: "Spaghetti, lardons, œuf, parmesan", prix: 14.0, categorie: cats[1]._id },
      { nom: "Fondant au chocolat", description: "Cœur coulant, glace vanille", prix: 7.5, categorie: cats[2]._id },
      { nom: "Crème brûlée", description: "Crème vanillée caramélisée", prix: 6.5, categorie: cats[2]._id },
      { nom: "Eau minérale", description: "50cl", prix: 2.5, categorie: cats[3]._id },
      { nom: "Jus d'orange frais", description: "Pressé à la commande", prix: 4.5, categorie: cats[3]._id }
    ]);

    console.log("✅ Données de démonstration insérées!");
  } catch (err) {
    console.error("Erreur seed:", err.message);
  }
}
