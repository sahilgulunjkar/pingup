import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Post from "../models/Posts.js";
import User from "../models/User.js";

// Functions to add, get, like & delete post

// Add post
export const AddPost = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { content, post_type } = req.body;
    const images = req.files;
    let image_urls = [];

    if (images && images.length > 0) {
      image_urls = await Promise.all(
        images.map(async (img) => {
          // Read from path as a base64 string since multer uses diskStorage
          const base64File = fs.readFileSync(img.path, "base64");

          const response = await imagekit.files.upload({
            file: base64File,
            fileName: img.originalname,
            folder: "/posts",
            useUniqueFileName: true,
          });

          // Delete the temporary file from the disk after upload
          if (fs.existsSync(img.path)) {
            fs.unlinkSync(img.path);
          }

          // Use helper.buildSrc with urlEndpoint and src in @imagekit/nodejs v7+
          return imagekit.helper.buildSrc({
            urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
            src: response.filePath,
            transformation: [{ quality: "auto" }, { format: "webp" }, { width: "1280" }],
          });
        })
      );
    }

    await Post.create({
      user: userId,
      content,
      image_urls,
      post_type,
    });

    res.json({ success: true, message: "Post created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get feed posts
export const getFeedPosts = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findById(userId);
    const userIds = [userId, ...user.connections, ...user.following];

    const posts = await Post.find({ user: { $in: userIds } })
      .populate("user")
      .sort({ createdAt: -1 });

    res.json({ success: true, posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Like/unlike post
export const likePost = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { postId } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
      await post.save();
      return res.json({ success: true, message: "Post unliked" });
    } else {
      post.likes.push(userId);
      await post.save();
      return res.json({ success: true, message: "Post liked" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    if (post.user.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this post" });
    }

    await Post.findByIdAndDelete(postId);
    res.json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};