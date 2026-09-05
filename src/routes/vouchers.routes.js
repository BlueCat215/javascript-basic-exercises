const express = require("express");
const JsonCollection = require("../db");
const router = express.Router();
const vouchers = new JsonCollection("vouchers.json");

router.post("/apply", (req, res) => {
  const { code } = req.body;
  const found = vouchers.findAll().find((v) => v.code === code?.toUpperCase());
  if (!found) {
    return res.status(404).json({ message: "Mã giảm giá không hợp lệ" });
  }
  res.json(found);
});

module.exports = router;
