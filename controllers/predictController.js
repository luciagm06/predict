'use strict';

const { getModelInfo, predict } = require("../services/tfModelService");
const Prediction = require("../models/prediction");

const MODEL_VERSION = process.env.MODEL_VERSION || "unknown";

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

    const prediction = await predict(features);
    const latencyMs = Date.now() - start;

    console.log('[PREDICT] Intentando guardar en MongoDB...');

    const saved = await Prediction.create({
      dataId,
      features,
      prediction,
      source,
      correlationId,
      modelVersion: MODEL_VERSION,
      latencyMs
    });

    console.log('[PREDICT] Guardado exitoso! ID:', saved._id);

    res.status(201).json({
      predictionId: saved._id,
      prediction,
      timestamp: saved.createdAt,
      latencyMs
    });

  } catch (err) {
    console.error("[PREDICT] Error en /predict:", err.message);
    console.error("[PREDICT] Stack:", err.stack);
    res.status(500).json({ 
      error: "Internal error", 
      message: err.message 
    });
  }
}

module.exports = {
  health,
  ready,
  doPredict
};