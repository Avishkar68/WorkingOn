import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import { createNotification } from "../services/notificationService.js";

export const addComment = async (req, res) => {

    const { postId, content } = req.body;
  
    const comment = await Comment.create({
      post: postId,
      author: req.user._id,
      content
    });
  
    const post = await Post.findById(postId);
  
    post.comments.push(comment._id);
  
    await post.save();
  
    if (post.author.toString() !== req.user._id.toString()) {
  
      await createNotification(
        post.author,
        req.user._id,
        "comment",
        "commented on your post",
        post._id,
        "Post"
      );
  
    }
  
    res.json(comment);
  
  };
  
  export const getComments = async (req, res) => {

    const comments = await Comment.find({
      post: req.params.postId
    })
      .populate("author", "name profileImage")
      .sort({ createdAt: -1 });
  
    res.json(comments);
  
  };

  export const deleteComment = async (req, res) => {

    const comment = await Comment.findById(req.params.id);
  
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }
  
    await comment.deleteOne();
  
    res.json({ message: "Comment deleted" });
  
  };

  export const likeComment = async (req, res) => {

    const comment = await Comment.findById(req.params.id);
  
    if (!comment.likes.includes(req.user._id)) {
  
      comment.likes.push(req.user._id);
      await comment.save();
  
    }
  
    res.json({ message: "Comment liked" });
  
  };

  