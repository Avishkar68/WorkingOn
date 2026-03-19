import Notification from "../models/Notification.js";

export const createNotification = async (
  recipient,
  sender,
  type,
  message,
  relatedId,
  relatedModel
) => {

  await Notification.create({
    recipient,
    sender,
    type,
    message,
    relatedId,
    relatedModel,
  });

};
