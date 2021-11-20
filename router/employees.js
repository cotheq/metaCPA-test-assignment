const { Router } = require("express");
const { check, validationResult } = require("express-validator");
const Employees = require("../models/EmployeesModel");
const Positions = require("../models/PositionsModel");
const { fullNamePattern, objectIdPattern } = require("../const/patterns");

const router = Router();
/*
 * Бэк:
 * 1) Сделать запрос на получение всех сотрудников СДЕЛАНО
 * 2) Сделать запрос на добавление сотрудника СДЕЛАНО
 * 3) Сделать запрос на удаление сотрудника по id СДЕЛАНО
 * 4) Сделать запрос на обновление сотрудника по id сделано
 * 5) Сделать поиск сотрудников по имени
 * 5) Сделать поиск сотрудников по должности, зарплате и т.д.
 * 6) Сделать пагинацию СДЕЛАНО
 * 7) Написать тесты
 * 8) если не займет времени сделать авторизацию пользователей
 * */

router.get("/employees", async (req, res) => {
  try {
    const filter = {};
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
});

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

      const result = await Employees.create(newEmployee);
      res.json(result);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

router.put(
  "/employees",
  check("id").matches(objectIdPattern).exists(),
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
      const { id, fullName, birthDate, position, salary } = req.query;

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

      const result = await Employees.findByIdAndUpdate(id, employeeToUpdate, {
        new: true,
      });
      if (!result) {
        res.status(400).send({ errors: [{ msg: "wrong id" }] });
        return;
      }
      console.log(result);
      res.json(result);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

router.delete(
  "/employees",
  check("id").matches(objectIdPattern).exists(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json(errors);
        return;
      }

      console.log(req.query);
      const result = await Employees.findByIdAndDelete({ _id: req.query.id });
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