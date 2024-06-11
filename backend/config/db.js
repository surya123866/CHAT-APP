const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: process.env.DB,
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL Database.");
});

module.exports = db;
