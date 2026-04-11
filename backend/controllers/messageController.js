import Message from "../models/Message.js";

// ✅ GET COMMUNITY MESSAGES (History)
export const getCommunityMessages = async (req, res) => {
  try {
    const { communityId } = req.params;
    
    // Fetch last 50 messages for history
    const messages = await Message.find({ community: communityId })
      .populate("sender", "name profileImage")
      .sort({ createdAt: 1 }) // oldest first for message history flow
      .limit(100);

    res.json(messages);

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch message history" });
  }
};
