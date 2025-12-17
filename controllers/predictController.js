// controllers/predictController.js
const { getModelInfo, predict } = require("../services/tfModelService");
const Prediction = require("../models/prediction");

function health(req, res) {
  res.json({
    status: "ok",
    service: "predict"
  });
}

function ready(req, res) {
  const info = getModelInfo();

  if (!info.ready) {
    return res.status(503).json({
      ready: false,
      modelVersion: info.modelVersion,
      message: "Model is still loading"
    });
  }

  res.json({
    ready: true,
    modelVersion: info.modelVersion
  });
}

async function doPredict(req, res) {
  const start = Date.now();

  try {
    const info = getModelInfo();
    if (!info.ready) {
      return res.status(503).json({
        error: "Model not ready",
        ready: false
      });
    }

    const { features, meta } = req.body;

    if (!features) {
      return res.status(400).json({ error: "Missing features" });
    }
    if (!meta || typeof meta !== "object") {
      return res.status(400).json({ error: "Missing meta object" });
    }

    const { featureCount, dataId, source, correlationId } = meta;

    if (featureCount !== info.inputDim) {
      return res.status(400).json({
        error: `featureCount must be ${info.inputDim}, received ${featureCount}`
      });
    }

    if (!Array.isArray(features) || features.length !== info.inputDim) {
      return res.status(400).json({
        error: `features must be an array of ${info.inputDim} numbers`
      });
    }

    // 🔮 Predicción
    const prediction = await predict(features);
    const latencyMs = Date.now() - start;

    // 💾 Persistencia en MongoDB (timestamp lo genera Mongo)
    const saved = await Prediction.create({
      dataId,
      features,
      prediction,
      source,
      correlationId,
      modelVersion: info.modelVersion,
      latencyMs
    });

    res.status(201).json({
      predictionId: saved._id,
      prediction,
      timestamp: saved.createdAt, // 👈 viene de Mongo
      latencyMs
    });

  } catch (err) {
    console.error("Error en /predict:", err);
    res.status(500).json({ error: "Internal error" });
  }
}

module.exports = {
  health,
  ready,
  doPredict
};
