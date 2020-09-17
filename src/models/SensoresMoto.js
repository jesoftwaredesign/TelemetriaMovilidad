const { Schema, model } = require("mongoose");

const SensoresMotoSchema = new Schema(
  {
    title: {
      type: String,
      required: false
    },
    tipo: {
      type: String,
      required: false
    },
    moto_s1: {
      type: String,
      required: false
    },
    moto_codigo: {
      type: String,
      required: false
    },
    user: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = model("sensoresmoto", SensoresMotoSchema);
