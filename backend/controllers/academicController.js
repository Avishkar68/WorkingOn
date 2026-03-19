import AcademicPost from "../models/AcademicPost.js";


// CREATE POST
export const createPost = async (req,res)=>{

  const post = await AcademicPost.create({
    title: req.body.title,
    description: req.body.description,
    tags: req.body.tags,
    author: req.user._id
  })

  res.json(post)
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

  res.json({message:"Reply added"})
}


// DELETE POST
export const deletePost = async (req,res)=>{

  const post = await AcademicPost.findById(req.params.id)

  if(post.author.toString() !== req.user._id.toString()){
    return res.status(403).json({message:"Not allowed"})
  }

  await post.deleteOne()

  res.json({message:"Deleted"})
}