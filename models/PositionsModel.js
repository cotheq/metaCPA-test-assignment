const { Schema, model } = require("mongoose");

const positionsSchema = new Schema({
  name: { type: String, required: true },
});

const Positions = model("Positions", positionsSchema);

module.exports = Positions;
