const { Schema, model } = require("mongoose");

const SensoresSchema = new Schema(
  {
    title: {
      type: String,
      required: false
    },
    tipo: {
      type: String,
      required: false
    },
    s_temperatura: {
      type: String,
      required: false
    },
    s_humedad: {
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

module.exports = model("sensoresmoto", SensoresSchema);
