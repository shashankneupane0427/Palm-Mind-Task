import React, { useState } from "react";

const MessageInput = ({ onSend }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
        className="flex-1 border p-2 rounded"
      />
      <button
        onClick={handleSend}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
