const { Schema, model } = require("mongoose");

const NoteSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    tipo: {
      type: String,
      required: true
    },
    ubicacion: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    user: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = model("sensores", NoteSchema);
