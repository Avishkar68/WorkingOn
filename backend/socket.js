import { Server } from "socket.io";
import User from "./models/User.js";
import Message from "./models/Message.js";
import { supabase } from "./config/supabase.js";
import { getCache, setCache } from "./services/redisService.js";

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

      // 1. Development bypass fallback
      if (process.env.NODE_ENV !== "production") {
        if (!token || token === "undefined" || token === "null" || token.startsWith("mock-")) {
          const user = await User.findById("6a396eaf88d3cb29f4cfc436").select("-password");
          if (user) {
            socket.user = user;
            return next();
          }
        }
      }

      if (!token) {
        return next(new Error("Authentication error: token missing"));
      }

      // 2. Try checking Redis cache first
      const cacheKey = `spitians:auth:token:${token}`;
      try {
        const cachedAuth = await getCache(cacheKey);
        if (cachedAuth && cachedAuth.user) {
          socket.user = cachedAuth.user;
          return next();
        }
      } catch (cacheErr) {
        console.error("[Socket Auth] Cache read error:", cacheErr.message);
      }

      let user;

      // 3. Try Supabase verification via the Supabase client
      try {
        const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(token);
        if (error || !supabaseUser) throw error || new Error("User not found on Supabase");

        if (supabaseUser.email && supabaseUser.email.endsWith("@spit.ac.in")) {
          user = await User.findOne({ supabaseId: supabaseUser.id }).select("-password");

          // Auto-link MongoDB profile on the fly if profile exists in MongoDB but doesn't have supabaseId or has outdated ID
          if (!user && supabaseUser.email) {
            user = await User.findOne({ email: supabaseUser.email }).select("-password");
            if (user) {
              user.supabaseId = supabaseUser.id;
              user.emailVerified = true;
              await user.save();
              console.log(`[Socket Auth] Auto-linked MongoDB user ${user.email} with Supabase ID ${supabaseUser.id}`);
            }
          }

          if (user) {
            socket.user = user;
            // Cache successful authentication for 10 minutes (600 seconds)
            await setCache(cacheKey, { user }, 600);
            return next();
          }
        }
      } catch (supabaseErr) {
        console.error("[Socket Auth] Supabase verification failed:", supabaseErr.message);
      }

      return next(new Error("User not found or unauthorized"));
    } catch (err) {
      console.error("[Socket Auth] Fatal middleware error:", err.message);
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
