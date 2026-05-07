module.exports = mongoose => {
  const Schema = mongoose.Schema;

  const PlatSchema = new Schema(
    {
      nom: { type: String, required: true, trim: true },
      description: { type: String, default: "" },
      prix: { type: Number, required: true, min: 0 },
      image: { type: String, default: "https://via.placeholder.com/300x200?text=Plat" },
      disponible: { type: Boolean, default: true },
      categorie: {
        type: Schema.Types.ObjectId,
        ref: "Categorie",
        required: true
      }
    },
    { timestamps: true }
  );

  PlatSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Plat = mongoose.model("Plat", PlatSchema);
  return Plat;
};
