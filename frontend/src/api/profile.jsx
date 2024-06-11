import axios from "axios";

const API_URL = "http://localhost:3000/api";

export const getProfile = async (userId, token) => {
  console.log(userId);
  try {
    const response = await axios.get(`${API_URL}/profile/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
