
const ChatBox = ({ messages, currentUser }) => (
  <div className="flex-1 overflow-y-auto border p-2 mb-2">
    {messages.map((m, i) => (
      <div
        key={i}
        className={`my-1 ${m.sender === currentUser ? "text-right" : "text-left"}`}
      >
        <strong>{m.sender}: </strong>{m.message}
      </div>
    ))}
  </div>
);

export default ChatBox;
