const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/authController");

const router = express.Router();

router.post(
  "/register",
  [
    body("userId").notEmpty().isString(),
    body("deviceId").notEmpty().isString(),
    body("name").notEmpty().isString(),
    body("phone").notEmpty().isString(),
    body("availCoins").isInt({ min: 0 }),
    body("password").notEmpty().isLength({ min: 6 }),
  ],
  authController.register
);

router.post("/login", authController.login);

module.exports = router;
