import AcademicPost from "../models/AcademicPost.js";
import { getIO } from "../socket.js";


// CREATE POST
export const createPost = async (req,res)=>{

  const post = await AcademicPost.create({
    title: req.body.title,
    description: req.body.description,
    tags: req.body.tags,
    author: req.user._id
  })

  // Populate the author before emitting
  const populated = await AcademicPost.findById(post._id)
    .populate("author", "name profileImage")

  // Emit to all connected clients
  getIO().emit("academic:new-post", populated)

  res.json(populated)
}


// GET ALL
export const getPosts = async (req,res)=>{

  const posts = await AcademicPost.find()
    .populate("author","name profileImage")
    .populate("replies.user","name profileImage")
    .sort({ createdAt: -1 })

  res.json(posts)
}


// ADD REPLY
export const addReply = async (req,res)=>{

  const post = await AcademicPost.findById(req.params.id)

  post.replies.push({
    user: req.user._id,
    text: req.body.text
  })

  await post.save()

  // Reload with populated fields
  const updated = await AcademicPost.findById(req.params.id)
    .populate("author", "name profileImage")
    .populate("replies.user", "name profileImage")

  const newReply = updated.replies[updated.replies.length - 1]

  // Emit the new reply to everyone viewing this post
  getIO().emit("academic:new-reply", {
    postId: req.params.id,
    reply: newReply
  })

  res.json({ message: "Reply added", reply: newReply })
}


// DELETE POST
export const deletePost = async (req,res)=>{

  const post = await AcademicPost.findById(req.params.id)

  if(post.author.toString() !== req.user._id.toString()){
    return res.status(403).json({message:"Not allowed"})
  }

  await post.deleteOne()

  // Emit deletion event
  getIO().emit("academic:delete-post", { postId: req.params.id })

  res.json({message:"Deleted"})
}