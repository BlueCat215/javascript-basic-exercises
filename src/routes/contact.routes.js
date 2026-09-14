const express = require("express");
const JsonCollection = require("../db");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

const router = express.Router();
const messages = new JsonCollection("contact-messages.json");

router.post("/", async (req, res) => {
  const { firstName, lastName, email, phone, country, subject, message } =
    req.body;
  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
  }
  const created = await messages.create({
    firstName,
    lastName,
    email,
    phone,
    country,
    subject,
    message,
    createdAt: new Date().toISOString(),
  });
  res.status(201).json(created);
});

router.get(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    res.json(await messages.findAll());
  },
);

module.exports = router;
