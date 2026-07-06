import { supabase } from "../config/supabase.js";
import User from "../models/User.js";
import { getCache, setCache } from "../services/redisService.js";

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const hasToken = authHeader && authHeader.startsWith("Bearer") && authHeader.split(" ")[1] !== "null" && authHeader.split(" ")[1] !== "undefined";

    // Development bypass for local testing (only if no auth token is provided)
    if (process.env.NODE_ENV !== "production" && req.headers["x-dev-bypass"] === "true" && !hasToken) {
      const user = await User.findById("6a396eaf88d3cb29f4cfc436").select("-password");
      if (user) {
        req.user = user;
        return next();
      }
    }

    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      req.token = token;

      // 1. Try checking cache first
      const cacheKey = `spitians:auth:token:${token}`;
      try {
        const cachedAuth = await getCache(cacheKey);
        if (cachedAuth) {
          if (cachedAuth.user) {
            req.user = cachedAuth.user;
            return next();
          } else if (cachedAuth.supabaseUser) {
            const isSelfRoute = 
              req.originalUrl === "/api/auth/me" || 
              req.originalUrl === "/api/users/me" || 
              req.path === "/me";

            if (isSelfRoute) {
              req.supabaseUser = cachedAuth.supabaseUser;
              req.supabaseUser.sub = cachedAuth.supabaseUser.id;
              return next();
            }
          }
        }
      } catch (cacheErr) {
        console.error("[Auth Middleware] Cache read error:", cacheErr.message);
      }

      // 2. Try Supabase verification via the Supabase client
      try {
        const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(token);
        
        if (error) throw error;
        
        if (supabaseUser) {
          if (!supabaseUser.email || !supabaseUser.email.endsWith("@spit.ac.in")) {
            return res.status(403).json({
              message: "Only SPIT emails (@spit.ac.in) are allowed"
            });
          }

          let user = await User.findOne({ supabaseId: supabaseUser.id }).select("-password");
          
          // Auto-link MongoDB profile on the fly if profile exists in MongoDB but doesn't have supabaseId or has outdated ID
          if (!user && supabaseUser.email) {
            user = await User.findOne({ email: supabaseUser.email }).select("-password");
            if (user) {
              user.supabaseId = supabaseUser.id;
              user.emailVerified = true;
              await user.save();
              console.log(`[Auth Middleware] Auto-linked MongoDB user ${user.email} with Supabase ID ${supabaseUser.id}`);
            }
          }

          if (user) {
            req.user = user;
            // Cache successful authentication for 10 minutes (600 seconds)
            await setCache(cacheKey, { user }, 600);
            return next();
          }

          // If profile does not exist yet in MongoDB, check if it's a self-identity endpoint
          const isSelfRoute = 
            req.originalUrl === "/api/auth/me" || 
            req.originalUrl === "/api/users/me" || 
            req.path === "/me";

          if (isSelfRoute) {
            req.supabaseUser = supabaseUser;
            req.supabaseUser.sub = supabaseUser.id; // Backward compatibility with controller expectations
            // Cache supabaseUser verification for unregistered user for 10 minutes
            await setCache(cacheKey, { supabaseUser }, 600);
            return next();
          }

          return res.status(401).json({
            message: "User profile not found. Please complete registration."
          });
        }
      } catch (supabaseErr) {
        console.error("Supabase token verification failed:", supabaseErr.message);
        return res.status(401).json({
          message: "Not authorized, token failed"
        });
      }
    }

    return res.status(401).json({
      message: "Not authorized, token missing"
    });

  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(401).json({
      message: "Not authorized, token failed"
    });
  }
};

export default protect;
