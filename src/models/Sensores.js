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
    valor: {
      type: Number,
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

module.exports = model("Sensores", SensoresSchema);
