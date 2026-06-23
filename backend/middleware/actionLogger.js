import mongoose from "mongoose";
import UserActionLog from "../models/UserActionLog.js";
import User from "../models/User.js";

export const actionLogger = async (req, res, next) => {
  // Save reference to original json response sender
  const originalJson = res.json;
  let responseBody = null;

  // Intercept the response body to extract user details (like on login/register)
  res.json = function (body) {
    responseBody = body;
    return originalJson.apply(this, arguments);
  };

  res.on("finish", async () => {
    // Only log successful mutative actions (GET requests are excluded)
    if (res.statusCode >= 200 && res.statusCode < 300) {
      try {
        const method = req.method;
        const url = req.originalUrl.split("?")[0]; // remove query params

        let action = null;
        let description = null;
        let userId = req.user?._id || (responseBody && responseBody._id);
        let metadata = {};

        // Parse actions by checking request method and URL pattern
        if (method === "POST") {
          if (url.match(/^\/api\/auth\/register$/i)) {
            action = "USER_REGISTER";
            description = "Registered a new account";
            userId = responseBody?._id;
            metadata = { email: req.body?.email, name: req.body?.name };
          } else if (url.match(/^\/api\/auth\/login$/i)) {
            action = "USER_LOGIN";
            description = "Logged in successfully";
            userId = responseBody?._id;
            metadata = { email: responseBody?.email };
          } else if (url.match(/^\/api\/posts$/i)) {
            action = "CREATE_POST";
            description = "Created a new post";
            metadata = { postId: responseBody?._id, isAnonymous: req.body?.isAnonymous };
          } else if (url.match(/^\/api\/posts\/[a-f\d]{24}\/like$/i)) {
            action = "LIKE_POST";
            description = "Liked a post";
            const postId = url.split("/")[3];
            metadata = { postId };
          } else if (url.match(/^\/api\/posts\/[a-f\d]{24}\/unlike$/i)) {
            action = "UNLIKE_POST";
            description = "Unliked a post";
            const postId = url.split("/")[3];
            metadata = { postId };
          } else if (url.match(/^\/api\/posts\/[a-f\d]{24}\/report$/i)) {
            action = "REPORT_POST";
            description = "Reported a post";
            const postId = url.split("/")[3];
            metadata = { postId };
          } else if (url.match(/^\/api\/comments$/i)) {
            action = "CREATE_COMMENT";
            description = "Added a comment";
            metadata = { commentId: responseBody?._id, postId: req.body?.postId };
          } else if (url.match(/^\/api\/comments\/[a-f\d]{24}\/like$/i)) {
            action = "LIKE_COMMENT";
            description = "Liked a comment";
            const commentId = url.split("/")[3];
            metadata = { commentId };
          } else if (url.match(/^\/api\/users\/[a-f\d]{24}\/follow$/i)) {
            action = "FOLLOW_USER";
            const targetId = url.split("/")[3];
            description = "Followed a user";
            metadata = { targetUserId: targetId };
          } else if (url.match(/^\/api\/users\/[a-f\d]{24}\/unfollow$/i)) {
            action = "UNFOLLOW_USER";
            description = "Unfollowed a user";
            const targetId = url.split("/")[3];
            metadata = { targetUserId: targetId };
          } else if (url.match(/^\/api\/communities$/i)) {
            action = "CREATE_COMMUNITY";
            description = "Created a new community";
            metadata = { communityId: responseBody?._id, name: req.body?.name };
          } else if (url.match(/^\/api\/communities\/[a-f\d]{24}\/join$/i)) {
            action = "JOIN_COMMUNITY";
            const communityId = url.split("/")[3];
            description = "Joined a community";
            metadata = { communityId };
          } else if (url.match(/^\/api\/communities\/[a-f\d]{24}\/leave$/i)) {
            action = "LEAVE_COMMUNITY";
            const communityId = url.split("/")[3];
            description = "Left a community";
            metadata = { communityId };
          } else if (url.match(/^\/api\/events$/i)) {
            action = "CREATE_EVENT";
            description = "Created a new event";
            metadata = { eventId: responseBody?._id, title: req.body?.title };
          } else if (url.match(/^\/api\/events\/[a-f\d]{24}\/register$/i)) {
            action = "REGISTER_EVENT";
            const eventId = url.split("/")[3];
            description = "Registered for an event";
            metadata = { eventId };
          } else if (url.match(/^\/api\/events\/[a-f\d]{24}\/cancel$/i)) {
            action = "CANCEL_EVENT";
            const eventId = url.split("/")[3];
            description = "Cancelled event registration";
            metadata = { eventId };
          } else if (url.match(/^\/api\/projects$/i)) {
            action = "CREATE_PROJECT";
            description = "Created a new project";
            metadata = { projectId: responseBody?._id, title: req.body?.title };
          } else if (url.match(/^\/api\/projects\/[a-f\d]{24}\/join$/i)) {
            action = "REQUEST_JOIN_PROJECT";
            const projectId = url.split("/")[3];
            description = "Requested to join project";
            metadata = { projectId };
          } else if (url.match(/^\/api\/projects\/[a-f\d]{24}\/accept\/[a-f\d]{24}$/i)) {
            action = "ACCEPT_PROJECT_JOIN";
            const parts = url.split("/");
            const projectId = parts[3];
            const targetUserId = parts[5];
            description = "Accepted project join request";
            metadata = { projectId, targetUserId };
          } else if (url.match(/^\/api\/projects\/[a-f\d]{24}\/reject\/[a-f\d]{24}$/i)) {
            action = "REJECT_PROJECT_JOIN";
            const parts = url.split("/");
            const projectId = parts[3];
            const targetUserId = parts[5];
            description = "Rejected project join request";
            metadata = { projectId, targetUserId };
          } else if (url.match(/^\/api\/projects\/[a-f\d]{24}\/leave$/i)) {
            action = "LEAVE_PROJECT";
            const projectId = url.split("/")[3];
            description = "Left project";
            metadata = { projectId };
          } else if (url.match(/^\/api\/pulses$/i)) {
            action = "CREATE_PULSE";
            description = "Created a new pulse/poll";
            metadata = { pulseId: responseBody?._id };
          } else if (url.match(/^\/api\/pulses\/[a-f\d]{24}\/react$/i)) {
            action = "REACT_PULSE";
            const pulseId = url.split("/")[3];
            description = "Reacted to pulse";
            metadata = { pulseId, reactionType: req.body?.reactionType };
          } else if (url.match(/^\/api\/pulses\/[a-f\d]{24}\/vote$/i)) {
            action = "VOTE_PULSE_POLL";
            const pulseId = url.split("/")[3];
            description = "Voted in pulse poll";
            metadata = { pulseId, optionIndex: req.body?.optionIndex };
          } else if (url.match(/^\/api\/pulses\/[a-f\d]{24}\/vote-pulse$/i)) {
            action = "VOTE_PULSE_POST";
            const pulseId = url.split("/")[3];
            description = "Voted on pulse post";
            metadata = { pulseId, voteType: req.body?.voteType };
          } else if (url.match(/^\/api\/challenge\/complete$/i)) {
            action = "COMPLETE_DAILY_CHALLENGE";
            description = "Completed the daily challenge";
            metadata = { score: responseBody?.score };
          }
        } else if (method === "PUT") {
          if (url.match(/^\/api\/users\/update$/i)) {
            action = "UPDATE_PROFILE";
            description = "Updated user profile details";
            metadata = { updatedFields: req.body ? Object.keys(req.body) : [] };
          }
        } else if (method === "DELETE") {
          if (url.match(/^\/api\/posts\/[a-f\d]{24}$/i)) {
            action = "DELETE_POST";
            const postId = url.split("/")[3];
            description = "Deleted a post";
            metadata = { postId };
          } else if (url.match(/^\/api\/comments\/[a-f\d]{24}$/i)) {
            action = "DELETE_COMMENT";
            const commentId = url.split("/")[3];
            description = "Deleted a comment";
            metadata = { commentId };
          } else if (url.match(/^\/api\/events\/[a-f\d]{24}$/i)) {
            action = "DELETE_EVENT";
            const eventId = url.split("/")[3];
            description = "Deleted an event";
            metadata = { eventId };
          } else if (url.match(/^\/api\/projects\/[a-f\d]{24}$/i)) {
            action = "DELETE_PROJECT";
            const projectId = url.split("/")[3];
            description = "Deleted a project";
            metadata = { projectId };
          }
        }

        // Save log to MongoDB if matched
        if (action && userId && mongoose.Types.ObjectId.isValid(userId)) {
          let userName = req.user?.name;

          if (!userName) {
            // Find user profile name
            const dbUser = await User.findById(userId).select("name");
            if (dbUser) userName = dbUser.name;
          }

          if (userName) {
            const logEntry = new UserActionLog({
              userId,
              userName,
              action,
              description,
              metadata,
              ipAddress: req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress,
              userAgent: req.headers["user-agent"]
            });

            await logEntry.save();
          }
        }
      } catch (err) {
        console.error("ActionLogger middleware error:", err.message);
      }
    }
  });

  next();
};

export default actionLogger;
