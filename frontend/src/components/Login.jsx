import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { API } from "../services/api";

const Login = ({ onJoin }) => {
  const { setUsername } = useContext(AuthContext);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const handleLogin = async () => {
    if (!usernameInput || !passwordInput) return;
    try {
      const res = await API.post("/auth/login", {
        username: usernameInput,
        password: passwordInput
      });
      localStorage.setItem("token", res.data.token);
      setUsername(res.data.user.username);
      onJoin(res.data.user.username);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex flex-col gap-3 bg-white p-6 rounded-lg shadow">
      <input
        type="text"
        placeholder="Username"
        value={usernameInput}
        onChange={(e) => setUsernameInput(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={passwordInput}
        onChange={(e) => setPasswordInput(e.target.value)}
        className="border p-2 rounded"
      />
      <button
        onClick={handleLogin}
        className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded"
      >
        Login
      </button>
    </div>
  );
};

export default Login;
