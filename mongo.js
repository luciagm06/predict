'use strict';

const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

async function connectMongo() {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI no definida en variables de entorno");
    }

    await mongoose.connect(MONGO_URI);

    console.log("[MONGO] Conectado a MongoDB");
    console.log("[MONGO] URI:", MONGO_URI);
  } catch (err) {
    console.error("[MONGO] Error de conexión:", err);
    process.exit(1);
  }
}

module.exports = connectMongo;
