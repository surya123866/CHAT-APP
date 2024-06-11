import axios from "axios";

const API_URL = "http://localhost:3000/api";

export const login = async (userId, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { userId, password });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
