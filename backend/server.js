import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";

import connectDB from "./config/db.js";
import cron from "node-cron";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import opportunityRoutes from "./routes/opportunityRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import limiter from "./middleware/rateLimiter.js";
import commentRoutes from "./routes/commentRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import exploreRoutes from "./routes/exploreRoutes.js";
import academicRoutes from "./routes/academicRoutes.js";
import challengeRoutes from "./routes/challengeRoutes.js";
import streakRoutes from "./routes/streakRoutes.js";
import { scrapeInternshala } from "./controllers/opportunityScraper.js";
import communityRoutes from "./routes/communityRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { initSocket } from "./socket.js";
dotenv.config();

const app = express();
const httpServer = http.createServer(app);
initSocket(httpServer);

connectDB();
cron.schedule("0 9 * * *", async () => {
  console.log("⏳ Running scraper every minute...");
  await scrapeInternshala();
});
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use("/api/auth/login", limiter)

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/explore", exploreRoutes);
app.use("/api/academic", academicRoutes );
app.use("/api/challenge", challengeRoutes);
app.use("/api/streak", streakRoutes);
app.use("/api/communities", communityRoutes);
app.use("/api/messages", messageRoutes);

const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
