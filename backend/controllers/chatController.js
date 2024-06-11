const db = require("../config/db");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

exports.getMessages = (req, res) => {
  const roomId = req.params.roomId;
  // First query to get the id from chatrooms
  db.query(
    "SELECT id,roomName FROM chatrooms WHERE roomId = ?",
    [roomId],
    (err, result) => {
      if (err) {
        console.error("Database query error", err);
        return res.status(500).json({ error: "Database query error" });
      }

      if (result.length === 0) {
        return res.status(404).json({ error: "Chatroom not found" });
      }

      const id = result[0].id;
      const roomName = result[0].roomName;

      // Second query to get the messages
      db.query(
        "SELECT * FROM messages WHERE roomId = ? ORDER BY createdAt ASC",
        [id],
        (err, results) => {
          if (err) {
            console.error("Database query error", err);
            return res.status(500).json({ error: "Database query error" });
          }

          res.status(200).json({ roomName: roomName, messages: results });
        }
      );
    }
  );
};

exports.createRoom = async (req, res) => {
  const { roomName, password } = req.body;

  if (!roomName || !password) {
    return res.status(400).send("Room name and password are required");
  }

  if (!req.user.isPrime) {
    return res.status(403).send("Only prime members can create chat rooms");
  }

  try {
    const roomId = Date.now();
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO chatrooms (roomId, roomName, userId, password) VALUES (?, ?, ?, ?)",
      [roomId, roomName, req.user.id, hashedPassword],
      (err) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).send("Room creation failed");
        }
        res.status(201).send({ roomId });
      }
    );
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).send("Internal server error");
  }
};

exports.joinRoom = async (req, res) => {
  const { roomId, password } = req.body;
  const userId = req.user.id;

  if (!roomId || !password) {
    return res.status(400).send("Room ID and password are required");
  }

  try {
    // Start a transaction
    await db.promise().query("START TRANSACTION");

    // Verify if the room exists and get room details
    const [roomExistsResult] = await db
      .promise()
      .query("SELECT * FROM chatrooms WHERE roomId = ?", [roomId]);

    if (roomExistsResult.length === 0) {
      await db.promise().query("ROLLBACK");
      return res.status(400).send("Room not found");
    }
    const room = roomExistsResult[0];

    // Validate the password
    if (!room.password) {
      await db.promise().query("ROLLBACK");
      return res.status(500).send("Room password is undefined");
    }
    const passwordMatch = await bcrypt.compare(password, room.password);
    if (!passwordMatch) {
      await db.promise().query("ROLLBACK");
      return res.status(403).send("Invalid password");
    }

    // Fetch user information
    const [userResult] = await db
      .promise()
      .query("SELECT * FROM users WHERE id = ?", [userId]);
    if (userResult.length === 0) {
      await db.promise().query("ROLLBACK");
      return res.status(400).send("User not found");
    }
    const user = userResult[0];

    // Check if user is already a member of the specified room
    const [userInRoomResult] = await db
      .promise()
      .query(
        "SELECT * FROM room_members WHERE userId = ? AND roomId = (SELECT id FROM chatrooms WHERE roomId = ? LIMIT 1)",
        [userId, roomId]
      );
    const isAlreadyInRoom = userInRoomResult.length > 0;

    // Non-prime member coin deduction check
    if (!user.isPrime && !isAlreadyInRoom) {
      if (user.availCoins < 150) {
        await db.promise().query("ROLLBACK");
        return res.status(403).send("Not enough coins to join another room");
      }

      await db
        .promise()
        .query("UPDATE users SET availCoins = availCoins - 150 WHERE id = ?", [
          userId,
        ]);
    }

    // Check room capacity only if the user is not already in the room
    if (!isAlreadyInRoom) {
      const [roomCountResult] = await db
        .promise()
        .query(
          "SELECT COUNT(*) AS count FROM room_members WHERE roomId = (SELECT id FROM chatrooms WHERE roomId = ?)",
          [roomId]
        );
      if (roomCountResult[0].count >= 6) {
        await db.promise().query("ROLLBACK");
        return res.status(400).send("Room is full");
      }
    }

    // Add user to room only if they are not already in the room
    if (!isAlreadyInRoom) {
      await db
        .promise()
        .query(
          "INSERT INTO room_members (roomId, userId) VALUES ((SELECT id FROM chatrooms WHERE roomId = ?), ?)",
          [roomId, userId]
        );
    }

    // Commit the transaction
    await db.promise().query("COMMIT");

    res.status(200).send("Joined room successfully");
  } catch (err) {
    console.error("Error joining room:", err);
    await db.promise().query("ROLLBACK");
    res.status(500).send("Failed to join room");
  }
};

exports.inviteParticipant = (req, res) => {
  if (!req.user.isPrime)
    return res.status(403).send("Only prime members can invite participants");

  const { roomId, inviteeId } = req.body;

  const token = jwt.sign({ roomId, inviteeId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.status(200).send({ inviteToken: token });
};

exports.joinWithInvite = (req, res) => {
  const { inviteToken } = req.body;

  jwt.verify(inviteToken, process.env.JWT_SECRET, (err, data) => {
    if (err) return res.status(403).send("Invalid or expired invitation token");

    const { roomId, inviteeId } = data;

    db.query(
      "SELECT COUNT(*) AS count FROM room_members WHERE roomId = (SELECT id FROM chatrooms WHERE roomId = ?)",
      [roomId],
      (err, results) => {
        if (err) return res.status(400).send("Failed to join room");
        if (results[0].count >= 6) return res.status(400).send("Room is full");

        db.query(
          "INSERT INTO room_members (roomId, userId) VALUES ((SELECT id FROM chatrooms WHERE roomId = ?), ?)",
          [roomId, req.user.id],
          (err) => {
            if (err) return res.status(400).send("Failed to join room");
            res.status(200).send("Joined room successfully");
          }
        );
      }
    );
  });
};

exports.getChatRooms = (req, res) => {
  const userId = req.user.id; // Assuming req contains the user's ID

  // Query to select distinct roomId and roomName for rooms the user is a member of or has created
  const sql = `
    SELECT DISTINCT chatrooms.roomId, chatrooms.roomName
    FROM chatrooms
    LEFT JOIN room_members ON chatrooms.id = room_members.roomId AND room_members.userId = ?
    WHERE chatrooms.userId = ? OR room_members.userId IS NOT NULL
  `;

  // Execute the query
  db.query(sql, [userId, userId], (err, results) => {
    if (err) {
      console.error("Error fetching chat rooms:", err);
      res.status(500).json({ error: "Error fetching chat rooms" });
      return;
    }

    // Send the chat rooms to the client
    res.status(200).json(results);
  });
};
