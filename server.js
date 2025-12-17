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

connectMongo();

app.listen(PORT, async () => {
  const serverUrl = `http://localhost:${PORT}`;
  console.log(`[PREDICT] Servicio escuchando en ${serverUrl}`);

  try {
    await initModel(serverUrl);
  } catch (err) {
    console.error("Error al inicializar modelo:", err);
    process.exit(1);
  }
});

