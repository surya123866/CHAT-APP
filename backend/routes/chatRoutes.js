const express = require("express");
const { body } = require("express-validator");
const chatController = require("../controllers/chatController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/messages/:roomId", authenticateToken, chatController.getMessages);
router.get("/rooms", authenticateToken, chatController.getChatRooms);
router.post("/chatrooms/create", authenticateToken, chatController.createRoom);
router.post("/joinroom", authenticateToken, chatController.joinRoom);
router.post("/invite", authenticateToken, chatController.inviteParticipant);
router.post(
  "/joinWithInvite",
  authenticateToken,
  chatController.joinWithInvite
);

module.exports = router;
