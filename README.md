# Chat Room System Project

## Objective
Develop a robust chat room system using JavaScript, Node.js, MySQL, and Express. The application should ensure security, user authentication, and interactive communication.

## Requirements

### 1. User Registration and Authentication
- **Implement user registration and authentication using JWT.**
- Users should provide the following details for registration:
  - `userId`: Unique identifier for the user.
  - `deviceId`: Device identifier for the user's device.
  - `name`: User's full name.
  - `phone`: User's contact number.
  - `availCoins`: Available coins for the user.

### 2. Chat Room Creation
- **Prime members can create a chat room.**
- Create an endpoint (POST `/api/chatrooms`) for room creation, ensuring only authenticated prime members can access it.
- If a chat room has reached its maximum capacity of 6 people, prevent further participants from joining, even with a valid room ID and password.

### 3. Inviting Participants
- **Chat room creators can invite other prime members using the room ID and password.**
- Implement a secure invitation mechanism using a token system.
- Non-prime members can join one room for free. After that, they must pay 150 coins to join additional rooms.

### 4. Joining a Room as a Non-Prime Member
- **Create an endpoint (POST `/api/joinroom`) for non-prime members to join a room.**
- Check if the user is a prime member and has already joined a room for free.
- If the user wants to join another room, ensure they have 150 coins; otherwise, deny access.

### 5. Chat Functionality
- **Users within a chat room can send and receive messages in real-time.**
- Implement WebSocket for real-time communication (POST `/api/messages`).

### 6. Profile Viewing
- **Users can view each other's profiles.**
- Create an endpoint (GET `/api/profile/:userId`) for profile retrieval.

### 7. Friend Requests
- **Users can send friend requests to other participants.**
- Implement friend request functionality (POST `/api/friend-requests`).

### 8. Database Management
- **Use MySQL to store user details, chat room information, messages, and friend requests.**
- Implement proper database schema and queries.

### 9. Security Measures
- **Implement secure password storage using bcrypt.**
- Ensure that only prime members can create chat rooms.
- Protect sensitive information from unauthorized access.

### 10. Error Handling and Validation
- **Implement robust error handling and validation for user inputs.**
- Handle responses appropriately, indicating reasons for denial (e.g., insufficient coins, unauthorized access).

## Installation

1. **Clone the repository:**
   ```sh
   git clone [https://github.com/yourusername/chat-room-system.git](https://github.com/surya123866/CHAT-APP.git)
   cd chat-room-system

2.**Install dependencies:**
   ```sh
   npm install

3.**Set up environment variables:**
  Create a .env file in the root directory and add the following variables:
    ```sh
    DB_HOST=your_database_host
    DB_USER=your_database_user
    DB_PASSWORD=your_database_password
    DB_NAME=your_database_name
    JWT_SECRET=your_jwt_secret

4.**Run the application:**
   ```sh
   node server.js


