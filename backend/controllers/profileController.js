const db = require("../config/db");
exports.viewProfile = (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT userId, userName, phone, availCoins, isPrime FROM users WHERE id = ?",
    [id],
    (err, result) => {
      if (err || result.length === 0)
        return res.status(404).send("User not found");
      res.status(200).send(result[0]);
    }
  );
};
