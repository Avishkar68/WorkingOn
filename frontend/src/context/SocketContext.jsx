import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export default function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  // Extract token here so we can watch it for changes
  const token = localStorage.getItem("token");

  useEffect(() => {
    // If no token is found, ensure any existing socket is closed and exit
    if (!token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const SOCKET_URL = import.meta.env.VITE_API_BASE_URL
      ? import.meta.env.VITE_API_BASE_URL.replace("/api", "")
      : "https://spitconnect.onrender.com";

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

    // Cleanup: disconnect when component unmounts or token changes
    return () => {
      s.disconnect();
    };

    /**
     * Dependency: [token]
     * This ensures that when the user logs in and the token is set, 
     * this effect re-runs and establishes the connection without a page reload.
     */
  }, [token]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}