const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.route");
const Message = require("./models/message.model");
const User = require("./models/user.model");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let users = [];

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Handle user joining
  socket.on("join", async (username) => {
    socket.username = username;

   
    const joinMessage = await Message.create({
      sender: "System",
      message: `--- ${username} joined the chat ---`,
      timestamp: new Date(),
    });

    // Emit join message
    io.emit("message", joinMessage);

    // Emit total registered users
    const totalUsers = await User.countDocuments();
    io.emit("totalUsers", totalUsers);

    // Emit total chat count
    const totalChats = await Message.countDocuments();
    io.emit("totalChats", totalChats);
  });

  // Handle incoming messages
  socket.on("message", async (data) => {
    const msg = await Message.create({
      sender: socket.username,
      message: data.message,
      timestamp: new Date(),
    });

    io.emit("message", msg);

    // Update total chat count
    const totalChats = await Message.countDocuments();
    io.emit("totalChats", totalChats);
  });

  // Handle user disconnecting
  socket.on("disconnect", () => {
    users = users.filter(u => u.id !== socket.id);
   
  });
});

// Fetch all chat messages
app.get("/api/messages", async (req, res) => {
  const messages = await Message.find().sort({ timestamp: 1 }); 
  res.json(messages);
});

server.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
