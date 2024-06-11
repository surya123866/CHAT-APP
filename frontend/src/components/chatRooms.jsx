import { useEffect, useState } from "react";
import { getRooms } from "../api/chatroom";
import { Link } from "react-router-dom";
import { FiShare2 } from "react-icons/fi";

const ChatRooms = () => {
  const [roomsData, setRoomsData] = useState([]);
  const userId = localStorage.getItem("id");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await getRooms();
        setRoomsData(response);
      } catch (error) {
        console.error("Error fetching Rooms:", error);
      }
    };

    fetchMessages();
  }, []);

  const handleShare = async (roomName, roomId) => {
    try {
      await navigator.clipboard.writeText(`${roomId}`);
      alert(`Join ${roomName} on our chat app! RoomId copied to clipboard.`);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      {roomsData.length === 0 ? (
        <div>
          <h1>You are not in any Active room</h1>
        </div>
      ) : (
        roomsData.map((room) => (
          <div
            key={room.roomId}
            className="block bg-green-100 rounded-md shadow-md p-4 hover:bg-gray-100 transition-colors"
          >
            <Link
              to={`/chat/${room.roomId}/${userId}`}
              className="color-black font-bold"
            >
              {room.roomName}
            </Link>
            <button
              onClick={() => handleShare(room.roomName, room.roomId)}
              className="ml-2"
            >
              <FiShare2 size={20} />
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default ChatRooms;
