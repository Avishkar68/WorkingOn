import React, { useEffect, useState } from "react";
import api from "../api/axios";
import NotificationCard from "../components/notifications/NotificationCard";

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

    } catch (err) {
      console.error(err);
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

      setSelectedRequest(null);
      setContact("");

      loadNotifications();

    } catch (err) {
      console.error(err.response?.data || err.message);
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

      loadNotifications();

    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">

        <h1 className="text-2xl font-bold flex items-center gap-2">
          🔔 Notifications
        </h1>

        <button
          onClick={markAllRead}
          className="px-4 py-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300"
        >
          Mark all as read
        </button>

      </div>

      {/* LIST */}
      <div className="flex flex-col gap-4">

        {notifications.length === 0 ? (
          <p className="text-gray-500 text-center">
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
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-xl w-[400px] space-y-4 shadow-lg">

            <h2 className="text-lg font-semibold">
              Share Contact Info
            </h2>

            <input
              placeholder="WhatsApp / Email"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full border p-2 rounded"
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={() => {
                  setSelectedRequest(null);
                  setContact("");
                }}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleAccept}
                disabled={loadingId === selectedRequest._id}
                className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {loadingId === selectedRequest._id ? "Sending..." : "Accept & Send"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Notifications;