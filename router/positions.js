const { Router } = require("express");
const { check, validationResult } = require("express-validator");
const Positions = require("../models/PositionsModel");
const { objectIdPattern } = require("../const/patterns");

const router = Router();

router.get("/positions", async (req, res) => {
  try {
    const result = await Positions.find();
    res.json(result);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post(
  "/positions",
  check("name").isLength({ max: 100 }).exists(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json(errors);
        return;
      }
      const result = await Positions.create({ name: req.query.name });
      res.json(result);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

router.put(
  "/positions",
  check("_id").matches(objectIdPattern).exists(),
  check("name").isLength({ max: 100 }).exists(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json(errors);
        return;
      }

      const { _id, name } = req.query;
      const foundPosition = await Positions.findById(_id);
      if (!foundPosition) {
        res.status(400).json({ errors: [{ msg: "wrong position id" }] });
        return;
      }

      const result = await Positions.findByIdAndUpdate(
        _id,
        { name },
        { new: true }
      );
      if (!result) {
        res.status(400).send({ errors: [{ msg: "wrong position id" }] });
        return;
      }
      res.json(result);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

router.delete(
  "/positions",
  check("_id").matches(objectIdPattern).exists(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json(errors);
        return;
      }
      const result = await Positions.findByIdAndDelete({ _id: req.query._id });
      if (!result) {
        res.status(400).send({ errors: [{ msg: "wrong position id" }] });
        return;
      }
      res.json(result);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
);

module.exports = router;
