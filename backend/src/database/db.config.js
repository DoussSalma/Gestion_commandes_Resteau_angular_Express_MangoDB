const config = require("../config/config");
const mongoose = require("mongoose");

const db = {};
mongoose.Promise = global.Promise;
mongoose.set("strictQuery", false);
db.mongoose = mongoose;
db.url = config.DB_URL;

db.categories = require("../api/models/categorie.model")(mongoose);
db.plats = require("../api/models/plat.model")(mongoose);
db.commandes = require("../api/models/commande.model")(mongoose);

module.exports = db;
