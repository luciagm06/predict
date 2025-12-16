const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27018/predict';

async function connectMongo() {
  await mongoose.connect(MONGO_URI);
  console.log('[PREDICT] Mongo conectado');
}

module.exports = connectMongo;
