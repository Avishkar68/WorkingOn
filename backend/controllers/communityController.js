import Community from "../models/Community.js";


// ✅ CREATE COMMUNITY
export const createCommunity = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name required" });
    }

    // 🔥 UNIQUE NAME CHECK
    const existing = await Community.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Community already exists" });
    }

    const community = await Community.create({
      name,
      description,
      createdBy: req.user._id,
      members: [req.user._id] // creator auto joins
    });

    res.status(201).json(community);

  } catch (err) {
    res.status(500).json({ message: "Failed to create community" });
  }
};


// ✅ GET ALL COMMUNITIES
export const getAllCommunities = async (req, res) => {
  try {
    const communities = await Community.find()
      .sort({ createdAt: -1 });

    res.json(communities);

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch communities" });
  }
};


// ✅ GET SINGLE COMMUNITY
export const getSingleCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id)
      .populate("members", "name profileImage");

    if (!community) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(community);

  } catch (err) {
    res.status(500).json({ message: "Failed" });
  }
};


// ✅ JOIN COMMUNITY
export const joinCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);

    if (!community) {
      return res.status(404).json({ message: "Not found" });
    }

    if (!community.members.includes(req.user._id)) {
      community.members.push(req.user._id);
      await community.save();
    }

    res.json({ message: "Joined community" });

  } catch (err) {
    res.status(500).json({ message: "Join failed" });
  }
};


// ✅ LEAVE COMMUNITY
export const leaveCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);

    if (!community) {
      return res.status(404).json({ message: "Not found" });
    }

    community.members.pull(req.user._id);
    await community.save();

    res.json({ message: "Left community" });

  } catch (err) {
    res.status(500).json({ message: "Leave failed" });
  }
};


// ✅ GET USER JOINED COMMUNITIES
export const getUserCommunities = async (req, res) => {
  try {
    const communities = await Community.find({
      members: req.user._id
    }).sort({ createdAt: -1 });

    res.json(communities);

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user communities" });
  }
};