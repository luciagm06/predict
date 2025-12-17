const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

async function connectMongo() {
  console.log("[PREDICT] Intentando conectar a Mongo:", MONGO_URI);
  await mongoose.connect(MONGO_URI);
  console.log("[PREDICT] Mongo conectado");
}

module.exports = connectMongo;

