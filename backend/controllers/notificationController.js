import Notification from "../models/Notification.js";
export const getNotifications = async (req, res) => {

  const notifications = await Notification.find({
    recipient: req.user._id
  })
    .populate("sender", "name profileImage")
    .populate("relatedId") // 🔥 THIS
    .sort({ createdAt: -1 })
    .limit(50);
  
    res.json(notifications);
  
  };
  export const markAsRead = async (req, res) => {

    const notification = await Notification.findById(req.params.id);
  
    notification.read = true;
  
    await notification.save();
  
    res.json({ message: "Notification marked as read" });
  
  };
  export const markAllRead = async (req, res) => {

    await Notification.updateMany(
      { recipient: req.user._id },
      { read: true }
    );
  
    res.json({ message: "All notifications marked as read" });
  
  };
  export const deleteNotification = async (req, res) => {

    await Notification.findByIdAndDelete(req.params.id);
  
    res.json({ message: "Notification deleted" });
  
  };
        