/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { getProfile } from "../api/profile";

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile(id, token);
        setProfile(data);
      } catch (err) {
        setError("Failed to fetch profile.");
      }
    };

    fetchProfile();
  }, [token, id]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Profile</h2>
        {error && <p className="text-red-500">{error}</p>}
        <div className="space-y-4">
          <p>
            <strong>User ID:</strong> {profile.userId}
          </p>
          <p>
            <strong>Name:</strong> {profile.userName}
          </p>
          <p>
            <strong>Phone:</strong> {profile.phone}
          </p>
          <p>
            <strong>Available Coins:</strong> {profile.availCoins}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
