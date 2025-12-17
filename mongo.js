'use strict';

const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("[MONGO] Variable de entorno MONGO_URI no definida");
  process.exit(1);
}

async function connectMongo() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("[MONGO] Conectado a MongoDB:", MONGO_URI);
  } catch (err) {
    console.error("[MONGO] Error conectando a MongoDB:", err);
    process.exit(1);
  }
}

module.exports = connectMongo;
