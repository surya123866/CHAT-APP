/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { createChatroom } from "../api/chatroom";
import { useNavigate } from "react-router-dom";

const CreateChatroom = () => {
  const [roomName, setRoomName] = useState("");
  const [password, setPassword] = useState(""); // Added password state
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await createChatroom(token, { roomName, password }); // Included password in data
      setSuccess("Chatroom Created Successfully");
      setError("");
      navigate("/chatRooms");
    } catch (err) {
      setError(err.message);
      setSuccess("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Create Chatroom</h2>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Chatroom Name
            </label>
            <input
              type="text"
              className="w-full p-2 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="w-full p-2 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateChatroom;
