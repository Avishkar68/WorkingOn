import Post from "../models/Post.js";
import User from "../models/User.js";
import Community from "../models/Community.js";
import { createNotification } from "../services/notificationService.js";
import { markPostCreated } from "./streakController.js";
import uploadImage from "../utils/uploadImage.js";
import mongoose from "mongoose";

// ✅ CREATE POST (WITH COMMUNITY)
export const createPost = async (req, res) => {
  try {
    const { content, tags, isAnonymous, communityId } = req.body;

    // 🔥 VALIDATION
    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    // ✅ CHECK COMMUNITY EXISTS
    let community = null;


    if (communityId && mongoose.Types.ObjectId.isValid(communityId)) {
      community = await Community.findById(communityId);

      if (!community) {
        return res.status(404).json({ message: "Community not found" });
      }
    }

    let imageUrl = "";

    if (req.file) {
      imageUrl = await uploadImage(req.file.path);
    }

    const post = await Post.create({
      author: req.user._id,
      content,
      tags,
      community: community?._id || null,  // ✅ SAFE
      image: imageUrl,
      isAnonymous
    });

    await markPostCreated(req.user._id);

    res.status(201).json(post);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Post creation failed" });
  }
};


// ✅ GLOBAL FEED (OPTIONAL KEEP)
export const getFeed = async (req, res) => {
  try {
    const posts = await Post.find({ status: "active" })
      .populate("author", "name profileImage branch year")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch feed" });
  }
};


// ✅ COMMUNITY POSTS
export const getCommunityPosts = async (req, res) => {
  try {
    const { communityId } = req.params;

    const posts = await Post.find({
      community: communityId,
      status: "active"
    })
      .populate("author", "name profileImage branch year")
      .sort({ createdAt: -1 });

    res.json(posts);

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};


// ❤️ LIKE POST
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post.likes.includes(req.user._id)) {
      post.likes.push(req.user._id);
      await post.save();

      if (post.author.toString() !== req.user._id.toString()) {
        await createNotification(
          post.author,
          req.user._id,
          "like",
          "liked your post",
          post._id,
          "Post"
        );
      }
    }

    res.json({ message: "Post liked" });

  } catch (err) {
    res.status(500).json({ message: "Failed to like post" });
  }
};


// 💔 UNLIKE
export const unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    post.likes.pull(req.user._id);
    await post.save();

    res.json({ message: "Post unliked" });

  } catch (err) {
    res.status(500).json({ message: "Failed to unlike" });
  }
};


// 🗑 DELETE
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await post.deleteOne();

    res.json({ message: "Post deleted" });

  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};


// 🚨 REPORT
export const reportPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post.reportedBy.includes(req.user._id)) {
      post.reportedBy.push(req.user._id);
      post.status = "reported";
      await post.save();
    }

    res.json({ message: "Post reported" });

  } catch (err) {
    res.status(500).json({ message: "Report failed" });
  }
};


// 👤 USER POSTS
export const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      author: req.params.id
    })
      .populate("author", "name profileImage")
      .sort({ createdAt: -1 });

    res.json(posts);

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user posts" });
  }
};