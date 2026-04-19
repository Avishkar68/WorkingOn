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
    const userId = req.user._id.toString();
    const pulse = await Pulse.findById(req.params.id);

    if (!pulse || pulse.type !== "poll") {
      return res.status(404).json({ message: "Poll not found" });
    }

    // 🧹 Maintenance: Ensure voters arrays exist
    pulse.pollOptions.forEach(opt => {
      if (!opt.voters) opt.voters = [];
    });

    // 1. Identify which option the user currently has a RECORDED vote for
    let currentVotedOptionIndex = -1;
    pulse.pollOptions.forEach((opt, idx) => {
      if (opt.voters.some(v => v.toString() === userId)) {
        currentVotedOptionIndex = idx;
      }
    });

    // 2. Identify if they are a legacy voter (in votedUsers but no specific option record)
    const isLegacyVoter = currentVotedOptionIndex === -1 && pulse.votedUsers.some(v => v.toString() === userId);

    const newOptionIndex = pulse.pollOptions.findIndex(opt => opt._id.toString() === optionId);
    if (newOptionIndex === -1) {
      return res.status(400).json({ message: "Invalid option" });
    }

    // 3. Handle the vote change
    if (currentVotedOptionIndex !== -1) {
      // Swapping from a known option
      if (currentVotedOptionIndex === newOptionIndex) {
        return res.json(pulse); // No change
      }
      
      // Decrement old
      pulse.pollOptions[currentVotedOptionIndex].votes = Math.max(0, pulse.pollOptions[currentVotedOptionIndex].votes - 1);
      pulse.pollOptions[currentVotedOptionIndex].voters = pulse.pollOptions[currentVotedOptionIndex].voters.filter(
        v => v.toString() !== userId
      );

      // Increment new
      pulse.pollOptions[newOptionIndex].votes += 1;
      pulse.pollOptions[newOptionIndex].voters.push(userId);
    } else {
      // New vote OR Legacy switch
      // If legacy, we can't decrement the old (unknown) option, but we now record the new one properly
      pulse.pollOptions[newOptionIndex].votes += 1;
      pulse.pollOptions[newOptionIndex].voters.push(userId);

      // Add to votedUsers if not already there
      if (!pulse.votedUsers.some(v => v.toString() === userId)) {
        pulse.votedUsers.push(userId);
      }
    }

    await pulse.save();

    // 🔥 EMIT REAL-TIME
    getIO().emit("poll-update", { 
      pulseId: pulse._id, 
      pollOptions: pulse.pollOptions, 
      votedUsers: pulse.votedUsers 
    });

    res.json(pulse);
  } catch (err) {
    console.error("Voting error:", err);
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
