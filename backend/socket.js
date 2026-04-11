import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "./models/User.js";

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Authenticate socket connections using JWT
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error("Authentication error"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Socket connected: ${socket.user.name} (${socket.id})`);

    // Join a specific academic post "room" for targeted updates
    socket.on("join-post", (postId) => {
      socket.join(`academic-post-${postId}`);
    });

    socket.on("leave-post", (postId) => {
      socket.leave(`academic-post-${postId}`);
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Socket disconnected: ${socket.user.name} (${socket.id})`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
