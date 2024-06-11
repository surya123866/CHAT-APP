const { body, validationResult } = require("express-validator");

const validateRegistration = [
  body("userId").notEmpty().isString(),
  body("deviceId").notEmpty().isString(),
  body("name").notEmpty().isString(),
  body("phone").notEmpty().isString(),
  body("availCoins").isInt({ min: 0 }),
  body("password").notEmpty().isLength({ min: 6 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  validateRegistration,
};
