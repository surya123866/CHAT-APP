import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const FriendRequest = () => {
  const [targetUserId, setTargetUserId] = useState("");
  const [message, setMessage] = useState("");
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("id");
    if (userId) {
      socket.emit("register", userId);
    }

    socket.on("friendRequestNotification", (data) => {
      alert(`New friend request from ${data.senderId}`);
      setFriendRequests((prevRequests) => [...prevRequests, data.senderId]);
    });

    return () => {
      socket.off("friendRequestNotification");
    };
  }, []);

  const sendFriendRequest = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/friend-requests",
        { targetUserId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessage(response.data);
    } catch (error) {
      setMessage(error.response?.data || "Failed to send friend request");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={targetUserId}
        onChange={(e) => setTargetUserId(e.target.value)}
        placeholder="Enter target user ID"
      />
      <button onClick={sendFriendRequest}>Send Friend Request</button>
      {message && <p>{message}</p>}
      <div>
        <h3>Friend Requests</h3>
        <ul>
          {friendRequests.map((id, index) => (
            <li key={index}>Friend request from user ID: {id}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FriendRequest;
