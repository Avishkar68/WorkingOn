import Pulse from "../models/Pulse.js";
import { getIO } from "../socket.js";
import uploadImage from "../utils/uploadImage.js";

// ✅ CREATE PULSE
export const createPulse = async (req, res) => {
  try {
    const { type, content, pollOptions } = req.body;

    if (!type || !content) {
      return res.status(400).json({ message: "Type and content are required" });
    }

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadImage(req.file.path);
    }

    const pulse = await Pulse.create({
      type,
      content,
      author: req.user._id,
      image: imageUrl,
      pollOptions: type === "poll" ? JSON.parse(pollOptions || "[]") : []
    });

    const populatedPulse = await Pulse.findById(pulse._id);

    // 🔥 EMIT REAL-TIME
    getIO().emit("new-pulse", populatedPulse);

    res.status(201).json(populatedPulse);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Pulse creation failed" });
  }
};

// ✅ GET ALL PULSES
export const getAllPulses = async (req, res) => {
  try {
    const { sort } = req.query; // latest, trending, controversial
    let pulses = await Pulse.find({ status: { $ne: "reported" } })
      .populate("author", "name profileImage")
      .lean();

    // Sorting Logic
    if (sort === "trending") {
      pulses.sort((a, b) => {
        const scoreA = (a.upvotes?.length || 0) - (a.downvotes?.length || 0);
        const scoreB = (b.upvotes?.length || 0) - (b.downvotes?.length || 0);
        return scoreB - scoreA;
      });
    } else if (sort === "controversial") {
      pulses.sort((a, b) => {
        const scoreA = (a.upvotes?.length || 0) * (a.downvotes?.length || 0);
        const scoreB = (b.upvotes?.length || 0) * (b.downvotes?.length || 0);
        return scoreB - scoreA;
      });
    } else {
      // Default: Latest
      pulses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.json(pulses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch pulses" });
  }
};

// Helper to clean legacy numeric reactions
const ensureArrayReactions = (pulse) => {
  if (!pulse.reactions) {
    pulse.reactions = { funny: [], relatable: [], spicy: [] };
  } else {
    ['funny', 'relatable', 'spicy'].forEach(key => {
      if (!Array.isArray(pulse.reactions[key])) {
        pulse.reactions[key] = [];
      }
    });
  }
};

// ✅ REACT TO PULSE
export const reactToPulse = async (req, res) => {
  try {
    const { type } = req.body; // funny, relatable, spicy
    if (!["funny", "relatable", "spicy"].includes(type)) {
      return res.status(400).json({ message: "Invalid reaction type" });
    }

    const pulse = await Pulse.findById(req.params.id);
    if (!pulse) return res.status(404).json({ message: "Pulse not found" });

    // 🧹 CLEAN LEGACY DATA
    ensureArrayReactions(pulse);

    // Check if user already reacted with THIS type
    const hasReacted = pulse.reactions[type].includes(req.user._id);

    if (hasReacted) {
      // Remove reaction
      pulse.reactions[type] = pulse.reactions[type].filter(id => id.toString() !== req.user._id.toString());
    } else {
      // Add reaction
      pulse.reactions[type].push(req.user._id);
    }

    await pulse.save();

    // 🔥 EMIT REAL-TIME
    getIO().emit("pulse-reaction", { pulseId: pulse._id, reactions: pulse.reactions });

    res.json(pulse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Reaction failed" });
  }
};

// ✅ VOTE IN POLL
export const voteInPoll = async (req, res) => {
  try {
    const { optionId } = req.body;
    const pulse = await Pulse.findById(req.params.id);

    if (!pulse || pulse.type !== "poll") {
      return res.status(404).json({ message: "Poll not found" });
    }

    // 🧹 CLEAN LEGACY DATA
    ensureArrayReactions(pulse);

    // Check if user already voted
    if (pulse.votedUsers.includes(req.user._id)) {
      return res.status(400).json({ message: "You have already voted" });
    }

    // Update vote count for specific option
    const optionIndex = pulse.pollOptions.findIndex(opt => opt._id.toString() === optionId);
    if (optionIndex === -1) {
      return res.status(400).json({ message: "Invalid option" });
    }

    pulse.pollOptions[optionIndex].votes += 1;
    pulse.votedUsers.push(req.user._id);

    // Save with versioning check handled by Mongoose
    await pulse.save();

    // 🔥 EMIT REAL-TIME
    getIO().emit("poll-update", { pulseId: pulse._id, pollOptions: pulse.pollOptions, votedUsers: pulse.votedUsers });

    res.json(pulse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Voting failed" });
  }
};

// ✅ REPORT PULSE
export const reportPulse = async (req, res) => {
  try {
    const pulse = await Pulse.findById(req.params.id);
    if (!pulse) return res.status(404).json({ message: "Pulse not found" });

    // 🧹 CLEAN LEGACY DATA
    ensureArrayReactions(pulse);

    if (!pulse.reportedBy.includes(req.user._id)) {
      pulse.reportedBy.push(req.user._id);
      
      // Auto-hide if reported by 5+ users
      if (pulse.reportedBy.length >= 5) {
        pulse.status = "reported";
      }
      
      await pulse.save();
    }

    res.json({ message: "Reported successfully" });
  } catch (err) {
    res.status(500).json({ message: "Reporting failed" });
  }
};

// ✅ VOTE PULSE (UP/DOWN)
export const votePulse = async (req, res) => {
  try {
    const { voteType } = req.body; // upvote, downvote
    if (!["upvote", "downvote"].includes(voteType)) {
      return res.status(400).json({ message: "Invalid vote type" });
    }

    const pulse = await Pulse.findById(req.params.id);
    if (!pulse) return res.status(404).json({ message: "Pulse not found" });

    const userId = req.user._id;

    // Remove from both first to handle toggle/switch
    pulse.upvotes = pulse.upvotes.filter(id => id.toString() !== userId.toString());
    pulse.downvotes = pulse.downvotes.filter(id => id.toString() !== userId.toString());

    if (voteType === "upvote") {
      pulse.upvotes.push(userId);
    } else {
      pulse.downvotes.push(userId);
    }

    // 🛡️ AUTO-HIDE LOGIC
    if (pulse.downvotes.length >= 10 && pulse.status !== "reported") {
      pulse.status = "hidden";
    }

    await pulse.save();

    // 🔥 EMIT REAL-TIME
    getIO().emit("pulse-vote-update", { 
      pulseId: pulse._id, 
      upvotes: pulse.upvotes, 
      downvotes: pulse.downvotes,
      status: pulse.status 
    });

    res.json(pulse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Voting failed" });
  }
};
