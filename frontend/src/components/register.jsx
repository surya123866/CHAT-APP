import { useState } from "react";
import { register } from "../api/auth";

const Register = () => {
  const [formData, setFormData] = useState({
    userId: "",
    deviceId: "",
    name: "",
    phone: "",
    availCoins: 0,
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      setSuccess("User Registered Successfully");
      setError("");
    } catch (err) {
      setError(err);
      setSuccess("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Register</h2>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              User ID
            </label>
            <input
              type="text"
              name="userId"
              className="w-full p-2 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.userId}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Device ID
            </label>
            <input
              type="text"
              name="deviceId"
              className="w-full p-2 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.deviceId}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              className="w-full p-2 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              className="w-full p-2 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Available Coins
            </label>
            <input
              type="number"
              name="availCoins"
              className="w-full p-2 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.availCoins}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="w-full p-2 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
