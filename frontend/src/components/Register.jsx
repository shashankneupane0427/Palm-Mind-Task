import React, { useState } from "react";
import { API } from "../services/api";

const Register = ({ onRegistered }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!username || !password) return;
    try {
      await API.post("/auth/register", { username, password });
      alert("Registered successfully! You can now login.");
      onRegistered(); 
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex flex-col gap-3 bg-white p-6 rounded-lg shadow">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded"
      />
      <button
        onClick={handleRegister}
        className="bg-green-500 cursor-pointer text-white px-4 py-2 rounded"
      >
        Register
      </button>
    </div>
  );
};

export default Register;
