const { Router } = require("express");
const { check, validationResult } = require("express-validator");
const Employees = require("../models/EmployeesModel");
const Positions = require("../models/PositionsModel");
const { fullNamePattern, objectIdPattern } = require("../const/patterns");
const escapeRegExp = require("../helpers/escapeRegExp");

const router = Router();

router.get(
  "/employees",
  check("fullName").matches(fullNamePattern).isLength({ max: 100 }),
  async (req, res) => {
    try {
      const filter = {};
      if (req.query.fullName) {
        filter.fullName = {
          $regex: new RegExp(escapeRegExp(req.query.fullName), "i"),
        };
      }
      let page = Number(req.query.page);
      let limit = Number(req.query.limit);
      if (!(limit > 0 && limit < 100)) {
        limit = 20;
      }
      if (!(page >= 1)) {
        page = 1;
      }
      const skip = (page - 1) * limit;

      const totalRecords = await Employees.count(filter);
      const totalPages = Math.ceil(totalRecords / limit);
      const result = await Employees.find(filter, {}, { skip, limit }).populate(
        "position"
      );

      res.json({
        totalRecords,
        totalPages,
        page,
        skip,
        limit,
        result,
      });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
);

router.post(
  "/employees",
  check("fullName").matches(fullNamePattern).isLength({ max: 100 }).exists(),
  check("birthDate").isDate().exists(),
  check("salary").isInt({ min: 1 }).exists(),
  check("position").matches(objectIdPattern).exists(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json(errors);
        return;
      }
      const { fullName, birthDate, position, salary } = req.query;

      const foundPosition = await Positions.findById(position);
      if (!foundPosition) {
        res.status(400).json({ errors: [{ msg: "wrong position id" }] });
        return;
      }

      const newEmployee = {
        fullName,
        birthDate,
        position,
        salary,
      };

      let result = await Employees.create(newEmployee);
      result = await result.populate("position");
      result.populate("position");
      res.json(result);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

router.put(
  "/employees",
  check("_id").matches(objectIdPattern).exists(),
  check("fullName").matches(fullNamePattern).isLength({ max: 100 }).exists(),
  check("birthDate").isDate().exists(),
  check("salary").isInt({ min: 1 }).exists(),
  check("position").matches(objectIdPattern).exists(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json(errors);
        return;
      }
      const { _id, fullName, birthDate, position, salary } = req.query;

      const foundPosition = await Positions.findById(position);
      if (!foundPosition) {
        res.status(400).json({ errors: [{ msg: "wrong position id" }] });
        return;
      }

      const employeeToUpdate = {
        fullName,
        birthDate,
        position,
        salary,
      };

      const result = await Employees.findByIdAndUpdate(_id, employeeToUpdate, {
        new: true,
      }).populate("position");
      if (!result) {
        res.status(400).send({ errors: [{ msg: "wrong id" }] });
        return;
      }
      res.json(result);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

router.delete(
  "/employees",
  check("_id").matches(objectIdPattern).exists(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json(errors);
        return;
      }

      const result = await Employees.findByIdAndDelete(req.query._id).populate("position");
      if (!result) {
        res.status(400).send({ errors: [{ msg: "wrong id" }] });
        return;
      }
      res.json(result);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

module.exports = router;
