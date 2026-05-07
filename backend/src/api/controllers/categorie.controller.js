const db = require("../../database/db.config");
const Categorie = db.categories;

// Créer une catégorie
exports.create = (req, res) => {
  const { nom, description, icone } = req.body;

  if (!nom) {
    return res.status(400).send({ message: "Le nom de la catégorie est obligatoire." });
  }

  const newCategorie = new Categorie({ nom, description, icone });

  newCategorie.save().then(data => {
    res.status(201).send(data);
  }).catch(err => {
    console.error(err);
    res.status(500).send({ message: "Erreur lors de la création de la catégorie." });
  });
};

// Lister toutes les catégories
exports.findAll = (req, res) => {
  Categorie.find().then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).send({ message: err.message });
  });
};

// Trouver une catégorie par ID
exports.findOne = (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).send({ message: "ID requis." });

  Categorie.findById(id).then(data => {
    if (!data) return res.status(404).send({ message: "Catégorie non trouvée." });
    res.send(data);
  }).catch(err => {
    res.status(500).send({ message: err.message });
  });
};

// Modifier une catégorie
exports.update = (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).send({ message: "ID requis." });

  Categorie.findByIdAndUpdate(id, req.body, { useFindAndModify: false, new: true })
    .then(data => {
      if (!data) return res.status(404).send({ message: `Catégorie avec id=${id} non trouvée.` });
      res.send({ message: "Catégorie mise à jour avec succès.", data });
    }).catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// Supprimer une catégorie
exports.delete = (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).send({ message: "ID requis." });

  Categorie.findByIdAndDelete(id).then(data => {
    if (!data) return res.status(404).send({ message: "Catégorie non trouvée." });
    res.send({ message: "Catégorie supprimée avec succès." });
  }).catch(err => {
    res.status(500).send({ message: err.message });
  });
};
