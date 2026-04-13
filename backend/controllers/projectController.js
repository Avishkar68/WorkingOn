import Project from "../models/Project.js";
import Notification from "../models/Notification.js";
import { createNotification } from "../services/notificationService.js";

export const createProject = async (req, res) => {

  const { title, description, techStack, skillsRequired, teamSize, tags } = req.body;

  const project = await Project.create({
    title,
    description,
    creator: req.user._id,
    members: [req.user._id],

    teamSize: {
      current: 1,
      needed: teamSize.needed
    },

    techStack,
    skillsRequired,
    tags
  });

  res.status(201).json(project);
};



// ✅ GET PROJECTS
export const getProjects = async (req, res) => {

  const projects = await Project.find({ status: "active" })
    .populate("creator", "name profileImage")
    .populate("members", "name profileImage")
    .populate("joinRequests.user", "name profileImage") // IMPORTANT
    .sort({ createdAt: -1 });

  res.json(projects);
};



// ✅ JOIN REQUEST
export const requestJoinProject = async (req, res) => {

  const project = await Project.findById(req.params.id);

  // already member
  if (project.members.includes(req.user._id)) {
    return res.status(400).json({ message: "Already in project" });
  }

  const existing = project.joinRequests.find(
    r => r.user.toString() === req.user._id.toString()
  );

  if (existing) {
    return res.status(400).json({ message: "Already requested" });
  }

  project.joinRequests.push({
    user: req.user._id,
    message: req.body.message,
    status: "pending"
  });

  await project.save();

  // prevent duplicate notification
  const exists = await Notification.findOne({
    recipient: project.creator,
    sender: req.user._id,
    relatedId: project._id
  });

  if (!exists) {
    await createNotification(
      project.creator,
      req.user._id,
      "joinRequest",
      "requested to join your project",
      project._id,
      "Project"
    );
  }

  res.json({ message: "Request sent" });
};



// ✅ ACCEPT
export const acceptJoinRequest = async (req, res) => {

  const { projectId, userId } = req.params;
  const { contact } = req.body;

  const project = await Project.findById(projectId);

  // already member (🔥 prevents duplicate)
  if (project.members.includes(userId)) {
    return res.status(400).json({ message: "Already accepted" });
  }

  const request = project.joinRequests.find(
    r => r.user.toString() === userId
  );

  if (!request) {
    return res.status(404).json({ message: "Request not found" });
  }

  if (request.status !== "pending") {
    return res.status(400).json({ message: "Already processed" });
  }

  if (project.teamSize.current >= project.teamSize.needed) {
    return res.status(400).json({ message: "Team full" });
  }

  request.status = "accepted";
  request.contact = contact;

  project.members.push(userId);
  project.teamSize.current += 1;

  await project.save();

  await createNotification(
    userId,
    req.user._id,
    "joinAccepted",
    `Your request for "${project.title}" was accepted. Contact: ${contact}`,
    project._id,
    "Project"
  );

  res.json({ message: "Accepted" });
};



// ✅ REJECT
export const rejectJoinRequest = async (req, res) => {

  const { projectId, userId } = req.params;

  const project = await Project.findById(projectId);

  const request = project.joinRequests.find(
    r => r.user.toString() === userId
  );

  if (!request) {
    return res.status(404).json({ message: "Not found" });
  }

  if (request.status !== "pending") {
    return res.status(400).json({ message: "Already processed" });
  }

  request.status = "rejected";

  await project.save();

  await createNotification(
    userId,
    req.user._id,
    "joinRejected",
    `Your request for "${project.title}" was rejected`,
    project._id,
    "Project"
  );

  res.json({ message: "Rejected" });
};
export const getUserProjects = async (req,res)=>{
  const projects = await Project.find({ creator: req.params.id })
    .populate("creator", "name profileImage branch year")
    .populate("members", "name profileImage")
    .sort({ createdAt: -1 });
  res.json(projects)
}
export const deleteProject = async (req,res)=>{

  const project = await Project.findById(req.params.id)

  if(!project){
    return res.status(404).json({message:"Not found"})
  }

  if(project.creator.toString() !== req.user._id.toString()){
    return res.status(403).json({message:"Not allowed"})
  }

  await project.deleteOne()

  res.json({message:"Project deleted"})
}
export const getProjectById = async (req, res) => { const project = await Project.findById(req.params.id).populate("creator", "name profileImage").populate("members", "name profileImage").populate("joinRequests.user", "name profileImage"); res.json(project); };
export const leaveProject = async (req, res) => { const project = await Project.findById(req.params.id); project.members.pull(req.user._id); project.teamSize.current -= 1; await project.save(); res.json({ message: "Left project" }); };