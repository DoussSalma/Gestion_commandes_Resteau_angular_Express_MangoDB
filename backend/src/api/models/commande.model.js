module.exports = mongoose => {
  const Schema = mongoose.Schema;

  const LigneCommandeSchema = new Schema({
    plat: { type: Schema.Types.ObjectId, ref: "Plat", required: true },
    nomPlat: { type: String, required: true },
    prixUnitaire: { type: Number, required: true },
    quantite: { type: Number, required: true, min: 1, default: 1 },
    sousTotal: { type: Number, required: true }
  });

  const CommandeSchema = new Schema(
    {
      numeroTable: { type: Number, required: true, min: 1 },
      client: { type: String, default: "Client" },
      lignes: [LigneCommandeSchema],
      total: { type: Number, default: 0 },
      statut: {
        type: String,
        enum: ["en_attente", "en_preparation", "servie", "annulee"],
        default: "en_attente"
      },
      notes: { type: String, default: "" }
    },
    { timestamps: true }
  );

  CommandeSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Commande = mongoose.model("Commande", CommandeSchema);
  return Commande;
};
