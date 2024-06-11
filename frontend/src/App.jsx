import { Route, Routes, Link, useNavigate } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";
import Profile from "./components/profile";
import CreateChatroom from "./components/createchatroom";
import JoinChatroom from "./components/JoinChatroom";
import Chat from "./components/chat";
import NotFound from "./components/notFound";
import ChatRooms from "./components/chatRooms";
import FriendRequest from "./components/friendRequest";

const App = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div>
      <nav className="p-4 bg-gray-800 text-white">
        <ul className="flex space-x-4">
          {!token ? (
            <>
              <li>
                <Link to="/">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <Link to="/create-chatroom">Create Chatroom</Link>
              </li>
              <li>
                <Link to="/join-chatroom">Join Chatroom</Link>
              </li>
              <li>
                <Link to="/chatRooms">Your Chat Rooms</Link>
              </li>
              <li>
                <Link to="/friendRequest">send A Friend Request</Link>
              </li>
              <li>
                <button
                  className="bg-red-400 border-none p-2 rounded-lg outline-none color-white"
                  onClick={onLogout}
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={!token ? <Login /> : <Profile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-chatroom" element={<CreateChatroom />} />
        <Route path="/join-chatroom" element={<JoinChatroom />} />
        <Route path="/chatRooms" element={<ChatRooms />} />
        <Route path="/chat/:roomId/:userId" element={<Chat />} />
        <Route path="/friendRequest" element={<FriendRequest />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
