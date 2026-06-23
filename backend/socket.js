import { Server } from "socket.io";
import User from "./models/User.js";
import Message from "./models/Message.js";
import { supabase } from "./config/supabase.js";

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Authenticate socket connections using JWT (Supabase only)
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error("Authentication error"));
      }

      let user;

      // Try Supabase verification via the Supabase client
      try {
        const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(token);
        if (!error && supabaseUser) {
          if (supabaseUser.email && supabaseUser.email.endsWith("@spit.ac.in")) {
            user = await User.findOne({ supabaseId: supabaseUser.id }).select("-password");
          }
        }
      } catch (supabaseErr) {
        // Fall through
      }

      if (!user) {
        return next(new Error("User not found or unauthorized"));
      }

      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Socket connected: ${socket.user.name} (${socket.id})`);

    // Join a private room for personal notifications
    socket.join(`user-${socket.user._id}`);

    // 🏆 COMMUNITY CHAT LOGIC
    socket.on("join-community", (communityId) => {
      socket.join(`community-${communityId}`);
      console.log(`👤 ${socket.user.name} joined community room: ${communityId}`);
    });

    socket.on("leave-community", (communityId) => {
      socket.leave(`community-${communityId}`);
      console.log(`👤 ${socket.user.name} left community room: ${communityId}`);
    });

    socket.on("send-community-message", async ({ communityId, content }) => {
      try {
        const newMessage = await Message.create({
          sender: socket.user._id,
          community: communityId,
          content
        });

        const populatedMessage = await Message.findById(newMessage._id).populate("sender", "name profileImage");

        io.to(`community-${communityId}`).emit("new-community-message", populatedMessage);
      } catch (err) {
        console.error("Failed to send community message:", err);
      }
    });

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
