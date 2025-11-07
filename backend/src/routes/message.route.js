const express = require("express");
const Message = require("../models/message.model");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();

// Fetch chat history
router.get("/", authMiddleware, async (req, res) => {
  const messages = await Message.find();
  res.json(messages);
});

module.exports = router;
