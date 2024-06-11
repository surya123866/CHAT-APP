const db = require("../config/db");
const { getIo } = require("../socket");

exports.sendFriendRequest = (req, res) => {
  const { targetUserId } = req.body;
  const senderId = req.user.id;

  db.query(
    "SELECT id, userId FROM users WHERE userId = ?",
    [targetUserId],
    (err, results) => {
      if (err || results.length === 0) {
        return res.status(400).send("Target user not found");
      }

      const receiverId = results[0].id;
      const receiverUserId = results[0].userId;

      db.query(
        "SELECT userId FROM users WHERE id = ?",
        [senderId],
        (err, senderResults) => {
          if (err || senderResults.length === 0) {
            return res.status(400).send("Sender user not found");
          }

          const senderUserId = senderResults[0].userId;

          db.query(
            "INSERT INTO friend_requests (senderId, receiverId) VALUES (?, ?)",
            [senderId, receiverId],
            (err) => {
              if (err)
                return res.status(400).send("Failed to send friend request");
              // console.log(receiverId, senderUserId);
              const io = getIo();
              // Emit a socket event to notify the target user using userId
              io.to(receiverUserId).emit("friendRequestNotification", {
                senderUserId,
              });

              res.status(200).send("Friend request sent");
            }
          );
        }
      );
    }
  );
};
