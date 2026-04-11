import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export default function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const SOCKET_URL = import.meta.env.VITE_API_BASE_URL
      ? import.meta.env.VITE_API_BASE_URL.replace("/api", "")
      : "http://localhost:4000";

    const s = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    s.on("connect", () => {
      console.log("🔌 Socket connected:", s.id);
    });

    s.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
