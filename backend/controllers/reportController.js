import Report from "../models/Report.js";

// ✅ SUBMIT REPORT
export const submitReport = async (req, res) => {
  try {
    const { entityId, entityModel, reportedUserId, reason, snapshot } = req.body;

    if (!entityId || !entityModel || !reason || !snapshot) {
      return res.status(400).json({ message: "Missing required report fields" });
    }

    // Check if user already reported this exact item to prevent spam
    const existing = await Report.findOne({
      reporter: req.user._id,
      entityId,
      status: "pending"
    });

    if (existing) {
      return res.status(400).json({ message: "You have already reported this item." });
    }

    const report = await Report.create({
      reporter: req.user._id,
      reportedUser: reportedUserId || null,
      entityId,
      entityModel,
      reason,
      snapshot
    });

    res.status(201).json({ message: "Report submitted successfully.", report });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to submit report" });
  }
};
