const db = require("../../database/db.config");
const Commande = db.commandes;
const Plat = db.plats;

// Créer une commande
exports.create = async (req, res) => {
  const { numeroTable, client, lignes, notes } = req.body;

  if (!numeroTable || !lignes || lignes.length === 0) {
    return res.status(400).send({ message: "numeroTable et au moins un plat sont obligatoires." });
  }

  try {
    // Calcul du total et récupération des noms/prix depuis la DB
    let lignesCalculees = [];
    let total = 0;

    for (const ligne of lignes) {
      const plat = await Plat.findById(ligne.plat);
      if (!plat) return res.status(404).send({ message: `Plat introuvable: ${ligne.plat}` });

      const sousTotal = plat.prix * ligne.quantite;
      total += sousTotal;

      lignesCalculees.push({
        plat: plat._id,
        nomPlat: plat.nom,
        prixUnitaire: plat.prix,
        quantite: ligne.quantite,
        sousTotal
      });
    }

    const newCommande = new Commande({
      numeroTable,
      client: client || "Client",
      lignes: lignesCalculees,
      total,
      notes: notes || ""
    });

    const saved = await newCommande.save();
    res.status(201).send(saved);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Erreur lors de la création de la commande." });
  }
};

// Lister toutes les commandes
exports.findAll = (req, res) => {
  Commande.find().populate("lignes.plat", "nom prix image")
    .sort({ createdAt: -1 })
    .then(data => res.send(data))
    .catch(err => res.status(500).send({ message: err.message }));
};

// Trouver une commande par ID
exports.findOne = (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).send({ message: "ID requis." });

  Commande.findById(id).populate("lignes.plat", "nom prix image")
    .then(data => {
      if (!data) return res.status(404).send({ message: "Commande non trouvée." });
      res.send(data);
    }).catch(err => res.status(500).send({ message: err.message }));
};

// Mettre à jour le statut d'une commande
exports.update = (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).send({ message: "ID requis." });

  Commande.findByIdAndUpdate(id, req.body, { useFindAndModify: false, new: true })
    .then(data => {
      if (!data) return res.status(404).send({ message: `Commande avec id=${id} non trouvée.` });
      res.send({ message: "Commande mise à jour avec succès.", data });
    }).catch(err => res.status(500).send({ message: err.message }));
};

// Supprimer une commande
exports.delete = (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).send({ message: "ID requis." });

  Commande.findByIdAndDelete(id).then(data => {
    if (!data) return res.status(404).send({ message: "Commande non trouvée." });
    res.send({ message: "Commande supprimée avec succès." });
  }).catch(err => res.status(500).send({ message: err.message }));
};
