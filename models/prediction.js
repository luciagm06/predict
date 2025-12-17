'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PredictionSchema = new Schema({
  dataId: {
    type: Schema.Types.ObjectId,
    required: false
  },
  features: {
    type: [Number],
    required: true
  },
  prediction: {
    type: Number,
    required: true
  },
  source: {
    type: String,
    default: 'orchestrator'
  },
  correlationId: {
    type: String,
    required: false
  },
  modelVersion: {
    type: String,
    required: true
  },
  latencyMs: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('prediction', PredictionSchema);
