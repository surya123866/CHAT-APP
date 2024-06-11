import axios from "axios";

const API_URL = "http://localhost:3000/api";

export const joinRoom = async (token, roomData) => {
  try {
    const response = await axios.post(`${API_URL}/joinroom`, roomData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
