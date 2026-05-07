module.exports = app => {
  const router = require("express").Router();

  const categorieController = require("../controllers/categorie.controller");
  const platController = require("../controllers/plat.controller");
  const commandeController = require("../controllers/commande.controller");
  const upload = require('../../middleware/upload');


  // ========== ROUTES CATÉGORIES ==========
  router.post("/categories", categorieController.create);
  router.get("/categories", categorieController.findAll);
  router.get("/categories/:id", categorieController.findOne);
  router.put("/categories/:id", categorieController.update);
  router.delete("/categories/:id", categorieController.delete);

  // ========== ROUTES PLATS ==========
  router.post("/plats", platController.create);
  router.get("/plats", platController.findAll);
  router.get("/plats/search", platController.search);
  router.get("/plats/categorie/:categorieId", platController.findByCategorie);
  router.get("/plats/:id", platController.findOne);
  router.put("/plats/:id", platController.update);
  router.delete("/plats/:id", platController.delete);

  // ========== ROUTES COMMANDES ==========
  router.post("/commandes", commandeController.create);
  router.get("/commandes", commandeController.findAll);
  router.get("/commandes/:id", commandeController.findOne);
  router.put("/commandes/:id", commandeController.update);
  router.delete("/commandes/:id", commandeController.delete);


// Ajouter AVANT app.use('/api', router)
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).send({ message: 'Aucun fichier reçu.' });
  const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
  res.send({ imageUrl });
});


  app.use("/api", router);
};
