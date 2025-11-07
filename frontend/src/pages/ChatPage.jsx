import { useState, useEffect, useContext, useRef } from "react";
import socket from "../services/socket";
import { API } from "../services/api";
import { AuthContext } from "../context/AuthContext";

const ChatBox = ({ messages, currentUser }) => {
  const chatEndRef = useRef(null);

  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto border p-2 mb-2">
      {messages.map((m, i) => (
        <div
          key={i}
          className={`my-1 ${
            m.sender === currentUser ? "text-right" : "text-left"
          } ${m.sender === "System" ? "text-center text-gray-500 italic" : ""}`}
        >
          {m.sender !== "System" && <strong>{m.sender}: </strong>}
          {m.message}
        </div>
      ))}
      <div ref={chatEndRef} />
    </div>
  );
};

const MessageInput = ({ onSend }) => {
  const [msg, setMsg] = useState("");

  const handleSend = () => {
    if (msg.trim() === "") return;
    onSend(msg);
    setMsg("");
  };

  return (
    <div className="flex mt-2">
      <input
        type="text"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 border p-2 rounded-l"
      />
      <button
        onClick={handleSend}
        className="bg-blue-500 text-white px-4 py-2 rounded-r"
      >
        Send
      </button>
    </div>
  );
};

const ChatPage = () => {
  const { username } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalChats, setTotalChats] = useState(0);

  useEffect(() => {
    if (!username) return;

    // Fetch chat history once
    API.get("/messages")
      .then((res) => setMessages(res.data))
      .catch((err) => console.error(err));

    // Emit join after socket connection
    if (socket.connected) {
      socket.emit("join", username);
    } else {
      socket.on("connect", () => socket.emit("join", username));
    }

    // Append new messages (system + user)
    const handleMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };
    const handleTotalUsers = (count) => setTotalUsers(count);
    const handleTotalChats = (count) => setTotalChats(count);

    socket.on("message", handleMessage);
    socket.on("totalUsers", handleTotalUsers);
    socket.on("totalChats", handleTotalChats);

    return () => {
      socket.off("connect");
      socket.off("message", handleMessage);
      socket.off("totalUsers", handleTotalUsers);
      socket.off("totalChats", handleTotalChats);
    };
  }, [username]);

  const sendMessage = (msg) => {
    socket.emit("message", { sender: username, message: msg, timestamp: new Date() });
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-lg shadow p-4 flex flex-col h-[80vh]">
      <div className="flex justify-between mb-2">
        <h2 className="font-bold text-lg">Chat Room</h2>
        <div className="flex gap-4">
          <span><strong>Total Users:</strong> {totalUsers}</span>
          <span><strong>Total Chats:</strong> {totalChats}</span>
        </div>
      </div>

      <ChatBox messages={messages} currentUser={username} />

      <MessageInput onSend={sendMessage} />
    </div>
  );
};

export default ChatPage;
