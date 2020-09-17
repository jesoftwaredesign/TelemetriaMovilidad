const { Schema, model } = require("mongoose");

const SensoresSchema = new Schema(
  {
    sensor_codigo: {
      type: String,
      required: false
    },
    valor_sensor: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = model("datossensores", SensoresSchema);
