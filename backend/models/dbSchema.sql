CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId VARCHAR(255) UNIQUE NOT NULL,
  deviceId VARCHAR(255) NOT NULL,
  userName VARCHAR(255) NOT NULL,
  phone VARCHAR(255) NOT NULL,
  availCoins INT NOT NULL DEFAULT 0,
  password VARCHAR(255) NOT NULL,
  isPrime BOOLEAN DEFAULT FALSE
);

CREATE TABLE chatrooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  roomName VARCHAR(255),
  roomId VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255)  NOT NULL,
  userId INT,
  FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE room_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  roomId INT,
  userId INT,
  FOREIGN KEY (roomId) REFERENCES chatrooms(id),
  FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  roomId INT,
  userId INT,
  message TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (roomId) REFERENCES chatrooms(id),
  FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE friend_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  senderId INT,
  receiverId INT,
  status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (senderId) REFERENCES users(id),
  FOREIGN KEY (receiverId) REFERENCES users(id)
);
