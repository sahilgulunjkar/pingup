import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Message from "../models/Message.js";

// Functions created to send message, get chat messages, get user recent 
// messages, edit message, delete message for me, delete message for everyone

const connections = {}; // server side event connections

// Server Side Event Connection
export const sseController = (req, res) => {
  const { userId } = req.params;

  // SSE header
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

  // add cliet's response object to connection object
  connections[userId] = res;

  // send an initial event to client
  res.write("log: Connected\n\n");

  // handle disconnection
  req.on("close", () => delete connections[userId]);
};

// Send message
export const sendMessage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { to_user_id, text } = req.body;
    const file = req.file;

    let media_url = null;
    let message_type = "text";

    if (file) {
      try {
        const base64File = fs.readFileSync(file.path, "base64");
        const response = await imagekit.files.upload({
          file: base64File,
          fileName: file.originalname,
          useUniqueFileName: true,
          folder: "/messages",
        });

        if (file.mimetype.startsWith("image")) {
          message_type = "image";
          media_url = imagekit.helper.buildSrc({
            urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
            src: response.filePath,
            transformation: [{ quality: "auto" }, { format: "webp" }, { width: "1280" }],
          });
        } else if (file.mimetype.startsWith("video")) {
          message_type = "video";
          media_url = response.url;
        }
      } finally {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      }
    }

    let message = await Message.create({
      from_user_id: userId,
      to_user_id,
      text,
      message_type,
      media_url,
    });

    message = await message.populate("from_user_id");

    if (connections[to_user_id]) {
      connections[to_user_id].write(`data: ${JSON.stringify(message)}\n\n`);
    }

    res.json({ success: true, message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get chat messages
export const getChatMessages = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { to_user_id } = req.body;

    const messages = await Message
      .find({
        $or: [{ from_user_id: userId, to_user_id }, { from_user_id: to_user_id, to_user_id: userId }],
        hiddenFor: { $ne: userId }
      })
      .sort({ createdAt: -1 });

    await Message.updateMany({ from_user_id: to_user_id, to_user_id: userId }, { seen: true });

    res.json({ success: true, messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user's recent messages
export const getUserRecentMessages = async (req, res) => {
  try {
    const { userId } = req.auth();
    const messages = await Message
      .find({ to_user_id: userId, hiddenFor: { $ne: userId } })
      .populate("from_user_id to_user_id")
      .sort({ createdAt: -1 });

    // Filter to keep only the latest message from each unique sender
    const uniqueMessages = [];
    const seenSenders = new Set();
    for (const msg of messages) {
      if (msg.from_user_id && msg.from_user_id._id) {
        const senderId = msg.from_user_id._id.toString();
        if (!seenSenders.has(senderId)) {
          seenSenders.add(senderId);
          uniqueMessages.push(msg);
        }
      }
    }

    res.json({ success: true, messages: uniqueMessages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};



// Edit message
export const editMessage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.params;
    const { text } = req.body;

    const message = await Message.findById(id);
    if (!message) return res.status(404).json({ success: false, message: "Message not found" });
    if (String(message.from_user_id) !== String(userId)) return res.status(403).json({ success: false, message: "Not allowed" });

    message.text = text;
    message.isEdited = true;
    await message.save();

    if (connections[message.to_user_id]) {
      connections[message.to_user_id].write(`data: ${JSON.stringify({ type: "EDIT", message })}\n\n`);
    }

    res.json({ success: true, message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete message for me
export const deleteForMe = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.params;

    const message = await Message.findById(id);
    if (!message) return res.status(404).json({ success: false, message: "Message not found" });

    message.hiddenFor = message.hiddenFor || [];
    if (!message.hiddenFor.includes(userId)) message.hiddenFor.push(userId);
    await message.save();

    res.json({ success: true, id, scope: "me" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete message for everyone
export const deleteForEveryone = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.params;

    const message = await Message.findById(id);
    if (!message) return res.status(404).json({ success: false, message: "Message not found" });
    if (String(message.from_user_id) !== String(userId)) return res.status(403).json({ success: false, message: "Not allowed" });

    await Message.findByIdAndDelete(id);

    if (connections[message.to_user_id]) {
      connections[message.to_user_id].write(`data: ${JSON.stringify({ type: "DELETE", id })}\n\n`);
    }

    res.json({ success: true, id, scope: "everyone" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};