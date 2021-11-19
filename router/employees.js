const { Router } = require("express");
const mongoose = require("mongoose");
const router = Router();
const Employees = require("../models/Employees");

/*
* Бэк:
* 1) Сделать запрос на получение всех сотрудников
* 2) Сделать запрос на добавление сотрудника
* 3) Сделать запрос на удаление сотрудника по id
* 4) Сделать запрос на обновление сотрудника по id
* 5) Сделать поиск сотрудников по имени
* 5) Сделать поиск сотрудников по должности, зарплате и т.д.
* 6) Сделать пагинацию
* 7) Написать тесты
* 8) если не займет времени сделать авторизацию пользователей
* */




router.get("/employees", (req, res) => {
  try {
    Employees.find({}, (err, doc) => {
      if (err) throw err;
      res.json(doc);
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
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
