const db = require("../../database/db.config");
const Plat = db.plats;

// Créer un plat
exports.create = (req, res) => {
  const { nom, description, prix, image, disponible, categorie } = req.body;

  if (!nom || !prix || !categorie) {
    return res.status(400).send({ message: "nom, prix et categorie sont obligatoires." });
  }

  const newPlat = new Plat({ nom, description, prix, image, disponible, categorie });

  newPlat.save().then(data => {
    res.status(201).send(data);
  }).catch(err => {
    console.error(err);
    res.status(500).send({ message: "Erreur lors de la création du plat." });
  });
};

// Lister tous les plats (avec populate catégorie)
exports.findAll = (req, res) => {
  Plat.find().populate("categorie", "nom icone").then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).send({ message: err.message });
  });
};

// Chercher par nom (search)
exports.search = (req, res) => {
  const nom = req.query.nom || "";
  Plat.find({ nom: { $regex: nom, $options: "i" } })
    .populate("categorie", "nom icone")
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};

// Filtrer par catégorie
exports.findByCategorie = (req, res) => {
  const categorieId = req.params.categorieId;
  Plat.find({ categorie: categorieId })
    .populate("categorie", "nom icone")
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};

// Trouver un plat par ID
exports.findOne = (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).send({ message: "ID requis." });

  Plat.findById(id).populate("categorie", "nom icone").then(data => {
    if (!data) return res.status(404).send({ message: "Plat non trouvé." });
    res.send(data);
  }).catch(err => {
    res.status(500).send({ message: err.message });
  });
};

// Modifier un plat
exports.update = (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).send({ message: "ID requis." });

  Plat.findByIdAndUpdate(id, req.body, { useFindAndModify: false, new: true })
    .then(data => {
      if (!data) return res.status(404).send({ message: `Plat avec id=${id} non trouvé.` });
      res.send({ message: "Plat mis à jour avec succès.", data });
    }).catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// Supprimer un plat
exports.delete = (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).send({ message: "ID requis." });

  Plat.findByIdAndDelete(id).then(data => {
    if (!data) return res.status(404).send({ message: "Plat non trouvé." });
    res.send({ message: "Plat supprimé avec succès." });
  }).catch(err => {
    res.status(500).send({ message: err.message });
  });
};
