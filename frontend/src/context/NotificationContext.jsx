import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { useSocket } from "./SocketContext";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { Bell, ArrowRight } from "lucide-react";

const NotificationContext = createContext(null);

export const useNotifications = () => useContext(NotificationContext);

export default function NotificationProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const socket = useSocket();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // ✅ FETCH INITIAL UNREAD COUNT
  const fetchUnreadCount = async () => {
    try {
      const res = await api.get("/notifications/unread-total");
      setUnreadCount(res.data.count);
    } catch (err) {
      console.error("Failed to fetch unread count:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
    } else {
      setUnreadCount(0);
    }
  }, [user]);

  // ✅ LISTEN FOR REAL-TIME NOTIFICATIONS
  useEffect(() => {
    if (!socket || !user) return;

    const handleNewNotification = (notification) => {
      // ✅ PREMIUM TOAST UI
      toast.custom((t) => (
        <div
          onClick={() => {
            toast.dismiss(t.id);
            navigate("/notifications");
          }}
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full glass-pro shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-white/10 hover:ring-white/20 transition-all cursor-pointer group`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                {notification.sender?.profileImage ? (
                  <img
                    className="h-10 w-10 rounded-full object-cover border border-white/10 shadow-lg"
                    src={notification.sender.profileImage}
                    alt=""
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-indigo-500/20 text-indigo-100 flex items-center justify-center border border-indigo-500/30">
                    <Bell size={18} />
                  </div>
                )}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-white">
                  {notification.sender?.name || "System"}
                </p>
                <p className="mt-1 text-sm text-slate-400 line-clamp-2">
                  {notification.message}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-white/10 group-hover:bg-white/5 transition-colors items-center px-4">
            <ArrowRight size={16} className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      ), { duration: 6000 });

      // Increment count
      setUnreadCount((prev) => prev + 1);
    };

    socket.on("new-notification", handleNewNotification);

    return () => {
      socket.off("new-notification", handleNewNotification);
    };
  }, [socket, user]);

  return (
    <NotificationContext.Provider value={{ unreadCount, setUnreadCount, refreshCount: fetchUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
}
