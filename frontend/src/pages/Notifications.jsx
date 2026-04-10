import { useEffect, useState } from "react";
import api from "../api/axios";
import NotificationCard from "../components/notifications/NotificationCard";
import PageShell from "../components/layout/PageShell";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";

const Notifications = () => {

  const [notifications, setNotifications] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [contact, setContact] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  // 🔥 LOAD NOTIFICATIONS
  const loadNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // ✅ MARK SINGLE READ
  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);

      setNotifications(prev =>
        prev.map(n =>
          n._id === id ? { ...n, read: true } : n
        )
      );

    } catch (err) {
      console.error(err);
    }
  };

  // ✅ MARK ALL READ
  const markAllRead = async () => {
    try {
      await api.put("/notifications/read-all");

      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
      toast.success("All notifications marked as read!");

    } catch (err) {
      console.error(err);
    }
  };

  // ✅ DELETE
  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);

      setNotifications(prev =>
        prev.filter(n => n._id !== id)
      );
      toast.success("Notification deleted");

    } catch (err) {
      console.error(err);
      toast.error("Failed to delete notification");
    }
  };

  // ✅ ACCEPT (WITH CONTACT)
  const handleAccept = async () => {

    if (!selectedRequest) return;

    try {
      setLoadingId(selectedRequest._id);

      await api.post(
        `/projects/${selectedRequest.relatedId}/accept/${selectedRequest.sender._id}`,
        { contact }
      );

      // mark notification read
      await api.put(`/notifications/${selectedRequest._id}/read`);

      toast.success("Request accepted and contact shared!");
      setSelectedRequest(null);
      setContact("");

      loadNotifications();

    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to accept request");
    } finally {
      setLoadingId(null);
    }
  };

  // ✅ REJECT
  const handleReject = async (notification) => {

    try {
      setLoadingId(notification._id);

      await api.post(
        `/projects/${notification.relatedId}/reject/${notification.sender._id}`
      );

      // mark read
      await api.put(`/notifications/${notification._id}/read`);

      toast.success("Request rejected");
      loadNotifications();

    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to reject request");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <PageShell
      eyebrow="Inbox"
      title="Notifications"
      subtitle="Track updates, requests, and activity from your workspace."
      actions={
        <button
          onClick={markAllRead}
          className="btn-primary px-4 py-2 rounded-xl text-sm font-medium"
        >
          Mark all as read
        </button>
      }
    >

      {/* LIST */}
      <div className="flex flex-col gap-4">

        {notifications.length === 0 ? (
          <p className="text-slate-500 text-center">
            No notifications yet
          </p>
        ) : (
          notifications.map((n) => (
            <NotificationCard
              key={n._id}
              notification={n}
              onRead={markRead}
              onDelete={deleteNotification}
              onAccept={(notif) => setSelectedRequest(notif)}
              onReject={handleReject}
              loading={loadingId === n._id}
            />
          ))
        )}

      </div>

      {/* 🔥 CONTACT MODAL */}
      <AnimatePresence>
      {selectedRequest && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4"
        >
<div className="glass-pro p-6 rounded-2xl w-full max-w-[420px] space-y-4 text-white">

  <h2 className="text-lg font-semibold">
    Share Contact Info
  </h2>

  <input
    placeholder="WhatsApp / Email"
    value={contact}
    onChange={(e) => setContact(e.target.value)}
    className="input"
  />

  <div className="flex justify-end gap-3">

    <button
      onClick={() => {
        setSelectedRequest(null);
        setContact("");
      }}
      className="btn-secondary px-4 py-2 rounded-lg"
    >
      Cancel
    </button>

    <button
      onClick={handleAccept}
      disabled={loadingId === selectedRequest._id}
      className="btn-primary px-4 py-2 rounded-lg"
    >
      {loadingId === selectedRequest._id ? "Sending..." : "Accept & Send"}
    </button>

  </div>
</div>
        </motion.div>
      )}
      </AnimatePresence>

    </PageShell>
  );
};

export default Notifications;