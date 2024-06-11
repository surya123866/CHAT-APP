const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const socketConfig = require("./socket");
const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const profileRoutes = require("./routes/profileRoutes");
const friendRoutes = require("./routes/friendRoutes");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.json());

const server = http.createServer(app);
const io = socketConfig.init(server);

app.use("/api", authRoutes);
app.use("/api", chatRoutes);
app.use("/api", profileRoutes);
app.use("/api", friendRoutes);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinRoom", ({ roomId }) => {
    socket.join(roomId);
  });

  socket.on("message", ({ roomId, message, userId }) => {
    db.query(
      "SELECT id,userName FROM users WHERE id = ?",
      [userId],
      (err, results) => {
        if (err) {
          console.error("Database query error", err);
          return;
        }

        if (results.length === 0) {
          console.error("User ID does not exist");
          return;
        }

        db.query(
          "SELECT id FROM chatrooms WHERE roomId = ?",
          [roomId],
          (err, roomResults) => {
            if (err) {
              console.error("Database query error", err);
              return;
            }

            if (roomResults.length === 0) {
              console.error("Room ID does not exist");
              return;
            }

            const roomIdInDb = roomResults[0].id;

            db.query(
              "INSERT INTO messages (roomId, userId, message) VALUES (?, ?, ?)",
              [roomIdInDb, userId, message],
              (err, result) => {
                if (err) {
                  console.error("Failed to save message to database", err);
                  return;
                }

                const messageData = {
                  id: result.insertId,
                  roomId: roomIdInDb,
                  userId: userId,
                  userName: userName,
                  message: message,
                  createdAt: new Date(),
                };

                io.to(roomId).emit("message", messageData);
              }
            );
          }
        );
      }
    );
  });

  socket.on("chatMessage", ({ roomId, message, userId }) => {
    // console.log(roomId, message, userId);

    db.query(
      "SELECT userName FROM users WHERE id = ?",
      [userId],
      (err, userResults) => {
        if (err) {
          console.error("Database query error", err);
          return;
        }

        if (userResults.length === 0) {
          console.error("User ID does not exist");
          return;
        }

        const userName = userResults[0].userName;

        db.query(
          "SELECT id FROM chatrooms WHERE roomId = ?",
          [roomId],
          (err, roomResults) => {
            if (err) {
              console.error("Database query error", err);
              return;
            }

            if (roomResults.length === 0) {
              console.error("Room ID does not exist");
              return;
            }

            const roomIdInDb = roomResults[0].id;

            db.query(
              "INSERT INTO messages (roomId, userId, message, userName) VALUES (?, ?, ?, ?)",
              [roomIdInDb, userId, message, userName],
              (err, result) => {
                if (err) {
                  console.error("Failed to save message to database", err);
                  return;
                }

                const messageData = {
                  id: result.insertId,
                  roomId: roomIdInDb,
                  userId: userId,
                  userName: userName,
                  message: message,
                  createdAt: new Date(),
                };

                io.to(roomId).emit("message", messageData);
              }
            );
          }
        );
      }
    );
  });

  socket.on("register", (userId) => {
    socket.join(userId.toString());
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port 3000");
});

module.exports = { io };
