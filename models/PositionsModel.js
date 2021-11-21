const { Schema, model } = require("mongoose");

const positionsSchema = new Schema({
  name: { type: String, required: true },
  __v: { type: Number, select: false },
});

const Positions = model("Positions", positionsSchema);

module.exports = Positions;
