const express = require("express");
const friendController = require("../controllers/friendController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/friend-requests",
  authenticateToken,
  friendController.sendFriendRequest
);

module.exports = router;
