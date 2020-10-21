const { Schema, model } = require("mongoose");

const SensoresMotoSchema = new Schema(
  {
    name: {
      type: String,
      required: false
    },
    ubicacion: {
      type: String,
      required: false
    },
    info: {
      type: String,
      required: false
    },
    sensor_codigo: {
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
