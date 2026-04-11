import Notification from "../models/Notification.js";
import { getIO } from "../socket.js";

export const createNotification = async (
  recipient,
  sender,
  type,
  message,
  relatedId,
  relatedModel
) => {

  const notification = await Notification.create({
    recipient,
    sender,
    type,
    message,
    relatedId,
    relatedModel,
  });

  const populated = await Notification.findById(notification._id)
    .populate("sender", "name profileImage")
    .populate("relatedId");

  try {
    const io = getIO();
    io.to(`user-${recipient}`).emit("new-notification", populated);
  } catch (err) {
    console.error("Socket not initialized yet, skipping real-time notify");
  }

};
