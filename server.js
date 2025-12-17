'use strict';

const express = require("express");
const path = require("path");
const predictRoutes = require("./routes/predictRoutes");
const { initModel } = require("./services/tfModelService");
const connectMongo = require("./mongo");

const PORT = process.env.PORT || 3002;

const app = express();
app.use(express.json());

const modelDir = path.resolve(__dirname, "model");
app.use("/model", express.static(modelDir));

app.use("/", predictRoutes);

async function startServer() {
  try {
    console.log('[ENV] PORT:', process.env.PORT);
    console.log('[ENV] MONGO_URI:', process.env.MONGO_URI);
    console.log('[ENV] MODEL_VERSION:', process.env.MODEL_VERSION);
    
    await connectMongo();
    console.log('[PREDICT] MongoDB conectado exitosamente');

    app.listen(PORT, () => {
      console.log(`[PREDICT] Servicio escuchando en http://localhost:${PORT}`);
    });

    const serverUrl = `http://localhost:${PORT}`;
    await initModel(serverUrl);
    console.log('[PREDICT] Modelo cargado exitosamente');

  } catch (err) {
    console.error("Error al iniciar:", err);
    process.exit(1);
  }
}

startServer();