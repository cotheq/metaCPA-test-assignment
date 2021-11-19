const { Router } = require("express");
const mongoose = require("mongoose");
const router = Router();
const Employees = require("../models/Employees");

/*
 * Бэк:
 * 1) Сделать запрос на получение всех сотрудников СДЕЛАНО
 * 2) Сделать запрос на добавление сотрудника
 * 3) Сделать запрос на удаление сотрудника по id
 * 4) Сделать запрос на обновление сотрудника по id
 * 5) Сделать поиск сотрудников по имени
 * 5) Сделать поиск сотрудников по должности, зарплате и т.д.
 * 6) Сделать пагинацию СДЕЛАНО
 * 7) Написать тесты
 * 8) если не займет времени сделать авторизацию пользователей
 * */

router.get("/employees", async (req, res) => {
  try {
    let page = Number(req.query.page);
    let limit = Number(req.query.limit);
    if (!(limit > 0 && limit < 100)) {
      limit = 20;
    }
    if (!(page >= 1)) {
      page = 1;
    }
    const skip = (page - 1) * limit;
    const filter = {};
    const docs = await Employees.find(
      filter,
      {},
      { select: "_id", skip, limit }
    );
    const totalRecords = await Employees.count(filter);
    const totalPages = Math.ceil(totalRecords / limit);
    console.log(totalRecords, totalPages);
    res.json({
      totalRecords,
      totalPages,
      page,
      skip,
      limit,
      result: docs,
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// router.get("/test/:p", (req, res) => {
//   res.send(typeof req.params.p);
// });

router.post("/employees", (req, res) => {
  try {
    const newEmployee = {
      fullName: "Test Test",
      birthDate: "1997-10-22",
      position: "Developer",
      salary: "100000",
    };

    Employees.create(newEmployee, (err, doc) => {
      if (err) throw err;
      res.json(doc);
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});
module.exports = router;
