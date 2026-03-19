import User from "../models/User.js";
import Post from "../models/Post.js";
import Project from "../models/Project.js";
import Event from "../models/Event.js";
import Opportunity from "../models/Opportunity.js";
export const getAdminStats = async (req, res) => {

    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const totalProjects = await Project.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalOpportunities = await Opportunity.countDocuments();
  
    const reportedPosts = await Post.countDocuments({
      status: "reported"
    });
  
    res.json({
      totalUsers,
      totalPosts,
      totalProjects,
      totalEvents,
      totalOpportunities,
      reportedPosts
    });
  
  };
  export const getReportedPosts = async (req, res) => {

    const posts = await Post.find({
      status: "reported"
    })
      .populate("author", "name profileImage")
      .sort({ createdAt: -1 });
  
    res.json(posts);
  
  };
  export const deletePostAdmin = async (req, res) => {

    const post = await Post.findById(req.params.id);
  
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
  
    await post.deleteOne();
  
    res.json({ message: "Post deleted by admin" });
  
  };
  export const banUser = async (req, res) => {

    const user = await User.findById(req.params.id);
  
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  
    user.isBanned = true;
  
    await user.save();
  
    res.json({ message: "User banned" });
  
  };
  export const unbanUser = async (req, res) => {

    const user = await User.findById(req.params.id);
  
    user.isBanned = false;
  
    await user.save();
  
    res.json({ message: "User unbanned" });
  
  };
          
  export const pinPost = async (req, res) => {

    const post = await Post.findById(req.params.id);
  
    post.isPinned = true;
  
    await post.save();
  
    res.json({ message: "Post pinned" });
  
  };
  export const getAllUsers = async (req, res) => {

    const users = await User.find().select("-password");
  
    res.json(users);
  
  };