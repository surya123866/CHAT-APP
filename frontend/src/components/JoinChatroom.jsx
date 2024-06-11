/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { joinRoom } from "../api/joinroom";

const JoinChatroom = () => {
  const [roomId, setRoomId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await joinRoom(token, { roomId, password });
      setSuccess(data);
      setError("");
      setIsLoading(false);
      navigate(`/chat/${roomId}/${id}`);
    } catch (err) {
      setError(err.message);
      setSuccess("");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Join Chatroom</h2>
        {error && (
          <p className="text-red-500" role="alert">
            {error}
          </p>
        )}
        {success && <p className="text-green-500">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="roomId"
            >
              Room ID
            </label>
            <input
              type="text"
              id="roomId"
              className="w-full p-2 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="text"
              id="userId"
              className="w-full p-2 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full px-4 py-2 font-bold text-white rounded ${
              isLoading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-700"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Joining..." : "Join"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinChatroom;
