/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import { getMessages } from "../api/chatroom";

const socket = io("http://localhost:3000");

const Chat = () => {
  const { roomId, userId } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch initial messages from the API
    const fetchMessages = async () => {
      try {
        const response = await getMessages(roomId);
        setRoomName(response.roomName);
        setMessages(response.messages);
      } catch (error) {
        console.error("Error fetching initial messages:", error);
      }
    };

    fetchMessages();

    // Join the room via WebSocket
    socket.emit("joinRoom", { roomId });

    // Listen for previous messages event
    socket.on("previousMessages", (msgs) => {
      setMessages((prevMessages) => [...prevMessages, ...msgs]);
    });

    // Listen for new messages
    socket.on("message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
      scrollToBottom();
    });

    // Cleanup function to leave the room and remove socket listeners
    return () => {
      socket.emit("leaveRoom", { roomId });
      socket.off();
    };
  }, [roomId]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("chatMessage", { roomId, message, userId });
      setMessage("");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">{roomName}</h2>
        <div className="space-y-4">
          <div className="h-64 overflow-y-scroll bg-gray-200 p-4 rounded">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="p-4 mb-2 bg-green-100 rounded-lg shadow-md"
              >
                <div className="flex justify-between text-xs text-gray-600">
                  {msg.userId == userId ? (
                    <span>You</span>
                  ) : (
                    <span>{msg.userName}</span>
                  )}
                  <span>{new Date(msg.createdAt).toLocaleTimeString()}</span>
                </div>
                <div className="mt-2 text-gray-900">{msg.message}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <input
            type="text"
            className="w-full p-2 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={sendMessage}
            className="w-full px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
