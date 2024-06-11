import axios from "axios";

const API_URL = "http://localhost:3000/api";

export const createChatroom = async (token, roomData) => {
  try {
    const response = await axios.post(`${API_URL}/chatrooms/create`, roomData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getMessages = async (roomId) => {
  try {
    const response = await axios.get(`${API_URL}/messages/${roomId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getRooms = async () => {
  try {
    const response = await axios.get(`${API_URL}/rooms/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
