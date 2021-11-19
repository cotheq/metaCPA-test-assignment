const { Schema, model } = require("mongoose");

const employeesSchema = new Schema(
  {
    fullName: String,
    birthDate: Date,
    position: String,
    salary: Number,
  },
  { versionKey: false }
);

const Employees = model("Employees", employeesSchema);

module.exports = Employees;
