import Project from "../models/Project.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { createNotification } from "../services/notificationService.js";
import { invalidateCachePattern } from "../services/redisService.js";
import { sendTeammateEmail } from "../services/emailService.js";

export const createProject = async (req, res) => {
  const { title, description, projectType, availability, openings, skillsRequired } = req.body;

  const project = await Project.create({
    title,
    description: description || `Looking for teammates for a ${projectType || 'project'}.`,
    creator: req.user._id,
    members: [],
    teamSize: {
      current: 0,
      needed: Number(openings) || 0
    },
    skillsRequired: skillsRequired || [],
    techStack: skillsRequired || [],
    tags: [projectType].filter(Boolean),
    projectType: projectType || "Other",
    availability: Number(availability) || 0,
    openings: Number(openings) || 0
  });

  (async () => {
    try {
      const users = await User.find({ isBanned: false, email: { $exists: true } }).select("email name");
      const platformUrl = req.headers.origin || process.env.FRONTEND_URL || "http://localhost:5173";
      await sendTeammateEmail(project, users, platformUrl);
    } catch (err) {
      console.error("Error in background teammate email notification:", err);
    }
  })();

  await invalidateCachePattern("spitians:cache:projects:*");
  await invalidateCachePattern("spitians:cache:admin:*");
  res.status(201).json(project);
};

// ✅ GET PROJECTS
export const getProjects = async (req, res) => {
  const projects = await Project.find({ status: "active" })
    .populate("creator", "name profileImage email branch year")
    .populate("members", "name profileImage email branch year")
    .populate("joinRequests.user", "name profileImage email branch year")
    .sort({ createdAt: -1 });

  res.json(projects);
};

// ✅ JOIN REQUEST (APPLY)
export const requestJoinProject = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project.members.includes(req.user._id)) {
    return res.status(400).json({ message: "Already in project" });
  }

  const existing = project.joinRequests.find(
    r => r.user.toString() === req.user._id.toString()
  );

  if (existing) {
    return res.status(400).json({ message: "Already requested" });
  }

  const { skills, interests, availability, github, portfolio, message } = req.body;

  project.joinRequests.push({
    user: req.user._id,
    skills: skills || [],
    interests: interests || "",
    availability: Number(availability) || 0,
    github: github || "",
    portfolio: portfolio || "",
    message: message || "",
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

  await invalidateCachePattern("spitians:cache:projects:*");
  res.json({ message: "Request sent" });
};

// ✅ ACCEPT
export const acceptJoinRequest = async (req, res) => {
  const { projectId, userId } = req.params;
  const { contact } = req.body;

  const project = await Project.findById(projectId);

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

  const contactInfo = contact || req.user.email || "";

  request.status = "accepted";
  request.contact = contactInfo;

  project.members.push(userId);
  project.teamSize.current += 1;

  await project.save();

  await createNotification(
    userId,
    req.user._id,
    "joinAccepted",
    `Your request for "${project.title}" was accepted. Contact: ${contactInfo}`,
    project._id,
    "Project"
  );

  await invalidateCachePattern("spitians:cache:projects:*");
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

  await invalidateCachePattern("spitians:cache:projects:*");
  res.json({ message: "Rejected" });
};

export const getUserProjects = async (req, res) => {
  const projects = await Project.find({ creator: req.params.id })
    .populate("creator", "name profileImage branch year email")
    .populate("members", "name profileImage email branch year")
    .populate("joinRequests.user", "name profileImage email branch year")
    .sort({ createdAt: -1 });
  res.json(projects);
};

export const deleteProject = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({ message: "Not found" });
  }

  if (project.creator.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not allowed" });
  }

  await project.deleteOne();

  await invalidateCachePattern("spitians:cache:projects:*");
  await invalidateCachePattern("spitians:cache:admin:*");
  res.json({ message: "Project deleted" });
};

export const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate("creator", "name profileImage email branch year")
    .populate("members", "name profileImage email branch year")
    .populate("joinRequests.user", "name profileImage email branch year");
  res.json(project);
};

export const leaveProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  project.members.pull(req.user._id);
  project.teamSize.current -= 1;
  await project.save();
  await invalidateCachePattern("spitians:cache:projects:*");
  res.json({ message: "Left project" });
};