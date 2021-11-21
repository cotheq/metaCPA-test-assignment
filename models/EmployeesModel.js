const { Schema, model } = require("mongoose");

const employeesSchema = new Schema({
  fullName: { type: String, required: true },
  birthDate: { type: Date, required: true },
  salary: { type: Number, required: true },
  position: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Positions",
  },
  __v: { type: Number, select: false },
});


const Employees = model("Employees", employeesSchema);

module.exports = Employees;
