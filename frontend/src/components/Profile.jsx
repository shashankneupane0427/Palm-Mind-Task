import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { API } from "../services/api";

const Profile = ({ onLogout }) => {
  const { username } = useContext(AuthContext);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Update password
  const handleUpdatePassword = async () => {
    if (!oldPassword || !newPassword) return;
    try {
      const res = await API.put("/auth/update-password", {
        oldPassword,
        newPassword,
      });
      alert(res.data.message);
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update password");
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;
    try {
      const res = await API.delete("/auth/delete");
      alert(res.data.message);
      localStorage.removeItem("token");
      onLogout();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete account");
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow flex flex-col gap-4">
      <h2 className="font-bold text-lg">Profile: {username}</h2>

      <div className="flex flex-col gap-2">
        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={handleUpdatePassword}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Update Password
        </button>
      </div>

      <button
        onClick={handleDeleteAccount}
        className="bg-red-500 text-white px-4 py-2 rounded mt-4"
      >
        Delete Account
      </button>
    </div>
  );
};

export default Profile;
