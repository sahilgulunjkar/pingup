import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Story from "../models/Story.js";
import User from "../models/User.js";
import { inngest } from "../inngest/index.js";

// Functions to add, get & delete stories

// Add story
export const addUserStory = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { content, media_type, background_color } = req.body;
    const media = req.file;
    let media_url = '';

    if (media && (media_type === "image" || media_type === "video")) {
      const base64File = fs.readFileSync(media.path, "base64");

      const response = await imagekit.files.upload({
        file: base64File,
        fileName: media.originalname,
        useUniqueFileName: true,
        folder: "/stories",
      });

      media_url =
        media_type === "image"
          ? imagekit.helper.buildSrc({
              urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
              src: response.filePath,
              transformation: [
                { quality: "auto" },
                { format: "webp" },
                { width: "512" },
              ],
            })
          : response.url; // videos keep original URL
    }

    const story = await Story.create({
      user: userId,
      content,
      media_url,
      media_type,
      background_color,
    });

    // Schedule deletion after 24h
    await inngest.send ({
      name: "app/story.delete",
      data: { storyId: story._id }
    });

    res.json({ success: true, message: "Story created successfully", story });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
};

// Get stories
export const getStories = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findById(userId);

    // user connections and followings
    const userIds = [userId, ...user.connections, ...user.following];

    const stories = await Story.find({ user: { $in: userIds } }).populate("user");

    res.json({ success: true, stories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete story
export const deleteStory = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { storyId } = req.params;

    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).json({ success: false, message: "Story not found" });
    }

    if (story.user.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await Story.findByIdAndDelete(storyId);

    res.json({ success: true, message: "Story deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};