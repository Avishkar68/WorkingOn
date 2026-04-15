import { useEffect, useState } from "react";
import api from "../api/axios";
import NotificationCard from "../components/notifications/NotificationCard";
import PageShell from "../components/layout/PageShell";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { useNotifications } from "../context/NotificationContext";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [contact, setContact] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const { setUnreadCount } = useNotifications();

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

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      await api.put("/notifications/read-all");
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read!");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
      toast.success("Notification deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete notification");
    }
  };

  const handleAccept = async () => {
    if (!selectedRequest) return;
    try {
      setLoadingId(selectedRequest._id);
      await api.post(
        `/projects/${selectedRequest.relatedId}/accept/${selectedRequest.sender._id}`,
        { contact }
      );
      await api.put(`/notifications/${selectedRequest._id}/read`);
      toast.success("Request accepted!");
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

  const handleReject = async (notification) => {
    try {
      setLoadingId(notification._id);
      await api.post(`/projects/${notification.relatedId}/reject/${notification.sender._id}`);
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
      subtitle="Track updates and project requests."
      actions={
        <button
          onClick={markAllRead}
          className="btn-primary px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap"
        >
          Mark all read
        </button>
      }
    >
      <div className="flex flex-col gap-4 pb-10">
        {notifications.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-slate-500">No notifications yet</p>
          </div>
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

      <AnimatePresence>
        {selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="glass-pro p-6 rounded-t-3xl sm:rounded-2xl w-full max-w-[420px] space-y-4 text-white border-t border-white/10 sm:border"
            >
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-2 sm:hidden" />
              <h2 className="text-lg font-bold">Share Contact Info</h2>
              <p className="text-sm text-gray-400">
                The sender will receive this info to reach out regarding the project.
              </p>
              <input
                placeholder="WhatsApp number or Email"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="input w-full bg-white/5 border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                autoFocus
              />
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                <button
                  onClick={() => { setSelectedRequest(null); setContact(""); }}
                  className="order-2 sm:order-1 w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAccept}
                  disabled={loadingId === selectedRequest._id || !contact.trim()}
                  className="order-1 sm:order-2 w-full sm:w-auto btn-primary px-6 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50"
                >
                  {loadingId === selectedRequest._id ? "Processing..." : "Accept & Share"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
};

export default Notifications;