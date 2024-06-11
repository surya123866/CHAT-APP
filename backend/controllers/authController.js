const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const { validationResult } = require("express-validator");
const dotenv = require("dotenv");
dotenv.config();

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, deviceId, name, phone, password, availCoins } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (userId, deviceId, userName, phone, availCoins, password) VALUES (?, ?, ?, ?, ?, ?)",
    [userId, deviceId, name, phone, availCoins, hashedPassword],
    (err) => {
      if (err) return res.status(400).send("User Registration Failed");
      res.status(201).send("User Registered Successfully");
    }
  );
};

exports.login = (req, res) => {
  const { userId, password } = req.body;
  console.log(process.env.JWT_SECRET);
  db.query(
    "SELECT * FROM users WHERE userId = ?",
    [userId],
    async (err, results) => {
      if (err || results.length === 0) {
        return res.status(400).send({ error: "User not found" });
      }

      const user = results[0];
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).send({ error: "Invalid Password" });
      }

      const token = jwt.sign(
        { id: user.id, isPrime: user.isPrime },
        process.env.JWT_SECRET
      );
      res.header("Authorization", "Bearer " + token).send({
        token,
        id: user.id,
      });
    }
  );
};
