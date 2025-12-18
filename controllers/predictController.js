'use strict';

const { predict, getModelInfo } = require('../services/tfModelService');
const Prediction = require('../models/prediction');

function health(req, res) {
  res.json({ status: 'ok', service: 'predict' });
}

function ready(req, res) {
  const info = getModelInfo();
  res.json(info);
}

async function doPredict(req, res) {
  const start = Date.now();
  const { features, meta } = req.body;

  try {
    const info = getModelInfo();
    if (!info.ready) {
      return res.status(503).json({
        error: 'Service unavailable',
        message: 'Model not ready yet'
      });
    }

    if (!features || !Array.isArray(features)) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'features must be an array'
      });
    }

    if (features.length !== 7) {
      return res.status(400).json({
        error: 'Bad request',
        message: `Expected 7 features, got ${features.length}`
      });
    }

    if (!meta) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'meta is required'
      });
    }

    if (!meta.target_date || !meta.time_start || !meta.time_end) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'meta must contain target_date, time_start, and time_end'
      });
    }

    console.log('[PREDICT] Validaciones OK');
    console.log('[PREDICT] features:', features);
    console.log('[PREDICT] target_date:', meta.target_date);

    const predictionValue = await predict(features);

    const saved = await Prediction.create({
      prediction_value: predictionValue,
      features: features,
      timestamp: new Date(),
      target_date: new Date(meta.target_date),
      time_start: new Date(meta.time_start),
      time_end: new Date(meta.time_end)
    });

    res.status(201).json({
      predictionId: saved._id,
      prediction: saved.prediction_value,
      timestamp: saved.timestamp,
      latencyMs: Date.now() - start
    });

  } catch (err) {
    console.error('[PREDICT] Error:', err.message);
    res.status(500).json({
      error: 'Prediction failed',
      message: err.message
    });
  }
}

module.exports = {
  health,
  ready,
  doPredict
};
