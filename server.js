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

// ✅ SOLUCIÓN: Conectar a MongoDB ANTES de iniciar el servidor
async function startServer() {
  try {
    // 1. Primero conectar a MongoDB
    await connectMongo();
    console.log('[PREDICT] MongoDB conectado exitosamente');

    // 2. Luego iniciar el servidor HTTP
    const server = app.listen(PORT, () => {
      const serverUrl = `http://localhost:${PORT}`;
      console.log(`[PREDICT] Servicio escuchando en ${serverUrl}`);
    });

    // 3. Finalmente cargar el modelo
    const serverUrl = `http://localhost:${PORT}`;
    await initModel(serverUrl);
    console.log('[PREDICT] Modelo cargado exitosamente');

  } catch (err) {
    console.error("Error al iniciar el servidor:", err);
    process.exit(1);
  }
}

// Iniciar servidor
startServer();