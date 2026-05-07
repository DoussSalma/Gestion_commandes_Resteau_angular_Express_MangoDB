require("dotenv").config();

const config = {
  DB_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT || 3000
};

module.exports = config;
