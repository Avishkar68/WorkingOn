import Post from "../models/Post.js";
import User from "../models/User.js";
import { createNotification } from "../services/notificationService.js";
import uploadImage from "../utils/uploadImage.js";
// export const createPost = async (req, res) => {

//   const { content, tags, image, isAnonymous } = req.body;

//   const post = await Post.create({
//     author: req.user._id,
//     content,
//     tags,
//     image,
//     isAnonymous
//   });

//   res.status(201).json(post);

// };
export const createPost = async (req, res) => {
  try {

    const { content, tags, isAnonymous } = req.body;

    let imageUrl = "";

    // ✅ HANDLE IMAGE UPLOAD
    if (req.file) {
      imageUrl = await uploadImage(req.file.path);
    }

    const post = await Post.create({
      author: req.user._id,
      content,
      tags,
      image: imageUrl, // ✅ STORE CLOUDINARY URL
      isAnonymous
    });

    res.status(201).json(post);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Post creation failed" });
  }
};

export const getFeed = async (req, res) => {

  const user = await User.findById(req.user._id);

  const following = user.following;

  const posts = await Post.find({
    status: "active"
  })
    .populate("author", "name profileImage branch year")
    .sort({ createdAt: -1 })
    .limit(50);

  res.json(posts);

};

export const likePost = async (req, res) => {

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

};

export const unlikePost = async (req, res) => {

  const post = await Post.findById(req.params.id);

  post.likes.pull(req.user._id);

  await post.save();

  res.json({ message: "Post unliked" });

};

export const deletePost = async (req, res) => {

  const post = await Post.findById(req.params.id);

  if (post.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not allowed" });
  }

  await post.deleteOne();

  res.json({ message: "Post deleted" });

};
export const reportPost = async (req, res) => {

  const post = await Post.findById(req.params.id);

  if (!post.reportedBy.includes(req.user._id)) {

    post.reportedBy.push(req.user._id);
    post.status = "reported";

    await post.save();

  }

  res.json({ message: "Post reported" });

};
export const getUserPosts = async (req, res) => {

  try {

    const posts = await Post.find({
      author: req.params.id   // ✅ CORRECT FIELD
    })
      .populate("author", "name profileImage")
      .sort({ createdAt: -1 });

    res.json(posts);

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user posts" });
  }

};