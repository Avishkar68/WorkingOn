import User from "../models/User.js";
import Post from "../models/Post.js";
import Project from "../models/Project.js";
import Opportunity from "../models/Opportunity.js";
import Event from "../models/Event.js";
export const globalSearch = async (req, res) => {

  const query = req.query.q;

  const users = await User.find({
    name: { $regex: query, $options: "i" }
  }).select("name profileImage branch year"); // add year also

  const posts = await Post.find({
    content: { $regex: query, $options: "i" }
  })
    .populate("author", "name profileImage branch year") // ✅ FIX
    .limit(10);

  const projects = await Project.find({
    title: { $regex: query, $options: "i" }
  }).limit(10);

  const opportunities = await Opportunity.find({
    title: { $regex: query, $options: "i" }
  }).limit(10);

  const events = await Event.find({
    title: { $regex: query, $options: "i" }
  }).limit(10);

  res.json({
    users,
    posts,
    projects,
    opportunities,
    events
  });

};