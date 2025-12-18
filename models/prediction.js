'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PredictionSchema = new Schema(
  {
    prediction_value: {
      type: Number,
      required: true
    },

    features: {
      type: [Number],
      required: true
    },

    timestamp: {
      type: Date,
      default: Date.now
    },

    target_date: {
      type: Date,
      required: true
    },

    time_start: {
      type: Date,
      required: true
    },

    time_end: {
      type: Date,
      required: true
    }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model('Prediction', PredictionSchema, 'predictions');
