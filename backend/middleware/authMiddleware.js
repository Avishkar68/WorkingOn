import { supabase } from "../config/supabase.js";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      // Try Supabase verification via the Supabase client
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
